import { randomUUID } from "node:crypto";
import { db } from "../../database/db.js";

export const tasksRepository = {
  
  list: (projectId) => db.prepare(
    "SELECT id,title,description,status,created_at FROM tasks WHERE project_id=? ORDER BY created_at DESC"
  ).all(projectId),

  create: (data) => {
    const id = randomUUID();
    db.prepare(
      "INSERT INTO tasks(id,project_id,title,description,status,created_at) VALUES(?,?,?,?,?,?)"
    ).run(id, data.projectId, data.title, data.description, "TODO", new Date().toISOString());
    return db.prepare("SELECT * FROM tasks WHERE id=?").get(id);
  }

};