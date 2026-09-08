import { randomUUID } from "node:crypto";
import { db } from "../../database/db.js";


export class ProjectRepository {

  async findManyByOwner(ownerId) {
    return db
      .prepare(
        `SELECT id,name,description,created_at 
        FROM projects 
        WHERE owner_id=? 
        ORDER BY created_at DESC`
      )
      .all(ownerId)
  }

  async findById(id, ownerId) {
    return db
      .prepare(
        `SELECT id,name,description,created_at 
        FROM projects 
        WHERE id=? AND owner_id=?`
      )
      .get(id, ownerId)
  }

  async create(data) {
    const id = randomUUID();
    db
      .prepare(
        `INSERT INTO projects(id,owner_id,name,description,created_at) 
        VALUES(?,?,?,?,?)`
      )
      .run(id, data.ownerId, data.name, data.description, new Date().toISOString());

    return this.findById(id, data.ownerId);
  }

  async update(id, { name, ownerId, description }) {
    db.prepare(`
      UPDATE projects 
      SET
      name = COALESCE(?, name),
      description = COALESCE(?, description) WHERE id = ?
    `).run(
      name ?? null,
      description ?? null,
      id);

    return this.findById(id, ownerId);
  }

  async delete(id, ownerId) {
    db
      .prepare("DELETE FROM projects WHERE id=? AND owner_id=?")
      .run(id, ownerId)
  }

}
