import { db } from "../../database/db.js";


export const usersRepository = {
  findOne: (id) => db.prepare(
    `SELECT id, name, email, role, created_at FROM users WHERE id=?`
  ).get(id),

  findByEmail: (email) => db.prepare(
    `SELECT id, name, email, role, created_at FROM users WHERE email=?`
  ).get(email),

  findAll: () => db.prepare(
    `SELECT id, name, email, role, created_at FROM users ORDER BY id`
  ).all()
}