import { randomUUID } from "node:crypto";
import { db } from "../../database/db";

export const projectsRepository = {
  
  listByOwner: (ownerId) => db.prepare(
    "SELECT id,name,description,created_at FROM projects WHERE owner_id=? ORDER BY created_at DESC"
  ).all(ownerId),

  findById: (id, ownerId) => db.prepare(
    "SELECT id,name,description,created_at FROM projects WHERE id=? AND owner_id=?"
  ).get(id, ownerId),

  create: (ownerId, name, description = "") => {
    const id = randomUUID();
    db.prepare(
      "INSERT INTO projects(id,owner_id,name,description,created_at) VALUES(?,?,?,?,?)"
    ).run(id, ownerId, name, description, new Date().toISOString());
    return projects.findById(id, ownerId);
  },
  
  delete: (id, ownerId) => db.prepare("DELETE FROM projects WHERE id=? AND owner_id=?").run(id, ownerId)
};