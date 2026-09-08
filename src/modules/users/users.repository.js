import { db } from "../../database/db.js";


export class UserRepository {
  
  async findMany({ limit, offset }) {
    return db
      .prepare(`
        SELECT id, name, email, role, created_at 
        FROM users ORDER BY created_at DESC LIMIT ? OFFSET ? `)
      .all(limit, offset)
  }

  async count() {
    const result = db.prepare(`SELECT COUNT(*) AS count FROM users`).get();
    return result.count;
  }

  async findById(id) {
    return db
      .prepare(`SELECT id, name, email, role, created_at FROM users WHERE id=?`)
      .get(id)
  }

  findByEmail(email) {
    return db
      .prepare(`SELECT id, name, email FROM users WHERE email=?`)
      .get(email)
  }

  async update(id, { name, email }) {
    db.prepare(`
      UPDATE users 
      SET
      name = COALESCE(?, name)
      email = COALESCE(?, email) WHERE id = ?
    `).run(name ?? null, email ?? null, id);

    return this.findById(id);
  }

  async delete (id) {
    db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
  }

}