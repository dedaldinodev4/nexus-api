import { db } from "../../database/db.js";

export const usersRepository = {
  findById: (id) => db.prepare(
    `SELECT id, name, email, role, created_at FROM users WHERE id=?`
  ).get(id)
}