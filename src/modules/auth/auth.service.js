import { randomBytes, createHash } from "node:crypto";
import { conflict, badRequest } from "../../core/errors/index.js";
import { hashPassword, verifyPassword, cookie } from "../../utils/auth.js";

export class AuthService {
  #repository;
  #userService

  constructor (repository, userService) {
    this.#repository = repository;
    this.#userService = userService;
  }

  async register ({ name, email, password }) {
    if (!name || !email || !password || password.length < 10) {
      throw badRequest("name, email and a password of at least 10 characters are required");
    }

    const userExisting = await this.#userService.getByEmail(email);

    if (userExisting) {
      throw conflict("Email already registered");
    }
    const { salt, hash } = await hashPassword(password);
    const result = await this.#repository.create({
      name, email, hash, salt
    })

    return result;
  }

  async login ({ email, password }) {
    const user = await this.#userService.getByEmailWithPassword(email);
    const isValidPassword = await verifyPassword(
      password, 
      user.password_salt, 
      user.password_hash
    )

    if (!user || !isValidPassword) {
      throw unauthorized("Invalid email or password");
    }

    const token = randomBytes(32).toString("base64url");
    // create a session
    await this.#repository.createSession({
      token,
      userId: user.id
    })

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      setCookie: cookie(token)
    };
  }

  async logout (match) {
    const hash = createHash("sha256").update(match[1]).digest("hex");
    await this.#repository.destroySession(hash);
  }

}