import { randomUUID, randomBytes } from "node:crypto";
import { db } from "../../database/db";
import { conflict, unauthorized, badRequest } from "../../core/errors";
import { hashPassword, verifyPassword, tokenHash, cookie } from "../../utils/auth";


export const authRepository = {

  register: async ({ name, email, password }) => {
    if (!name || !email || !password || password.length < 10) {
      throw badRequest("name, email and a password of at least 10 characters are required");
    }

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);

    if (existing)
      throw conflict("Email already registered");

    const { salt, hash } = await hashPassword(password);
    const id = randomUUID();
    db.prepare(`
      INSERT INTO users(id,name,email,password_hash,password_salt,role,created_at)
      VALUES(?,?,?,?,?,'MEMBER',?)
    `).run(id, name.trim(), email.trim().toLowerCase(), hash, salt, new Date().toISOString());
    return { id, name: name.trim(), email: email.trim().toLowerCase(), role: "MEMBER" };
  },

  login: async ({ email, password }) => {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
    const isValidPassword = await verifyPassword(password, user.password_salt, user.password_hash)
    if (!user || !isValidPassword) {
      throw unauthorized("Invalid email or password");
    }
    const token = randomBytes(32).toString("base64url");

    db.prepare(`
      INSERT INTO sessions(id,user_id,token_hash,expires_at,created_at)
      VALUES(?,?,?,?,?)
    `).run(
      randomUUID(), user.id, tokenHash(token),
      new Date(Date.now() + config.sessionTtlMs).toISOString(),
      new Date().toISOString()
    );
    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      setCookie: cookie(token)
    };
  }

}