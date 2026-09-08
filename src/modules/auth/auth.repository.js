import { randomUUID } from "node:crypto";
import { db } from "../../database/db.js";
import { config } from '../../config/index.js' 
import { tokenHash } from "../../utils/auth.js";

export class AuthRepository {

  async create ({ name, email, hash, salt }) {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO users(id,name,email,password_hash,password_salt,role,created_at)
      VALUES(?,?,?,?,?,'MEMBER',?)
    `).run(id, name.trim(), email.trim().toLowerCase(), hash, salt, new Date().toISOString());
    return { id, name: name.trim(), email: email.trim().toLowerCase(), role: "MEMBER" };
  }

  async createSession ({ token, userId }) {
    return db.prepare(`
      INSERT INTO sessions(id,user_id,token_hash,expires_at,created_at)
      VALUES(?,?,?,?,?)
    `).run(
      randomUUID(), userId, tokenHash(token),
      new Date(Date.now() + config.sessionTtlMs).toISOString(),
      new Date().toISOString()
    );
  }

  async destroySession (hash) {
    db.prepare("DELETE FROM sessions WHERE token_hash=?").run(hash);
  }

}