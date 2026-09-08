import { db } from "../../database/db.js";


export class TaskRepository {

  async findManyByProject(projectId) {
    return db
      .prepare(`
        SELECT id,title,description,status,created_at 
        FROM tasks 
        WHERE project_id=? 
        ORDER BY created_at DESC
      `)
      .all(projectId)
  }

  async create(data) {
    const id = randomUUID();
    db
      .prepare(
        `INSERT 
        INTO tasks(id,project_id,title,description,status,created_at) 
        VALUES(?,?,?,?,?,?)`
      )
      .run(id, data.projectId, data.title, data.description, "TODO", new Date().toISOString());
    return this.findById(id);
  }

  async findById(id) {
    return db
      .prepare(`SELECT * FROM tasks WHERE id=?`)
      .get(id)
  }

  async update(id, { title, description, status }) {
    db.prepare(`
      UPDATE tasks 
      SET
      title = COALESCE(?, title),
      status = COALESCE(?, status),
      description = COALESCE(?, description) WHERE id = ?
    `).run(
      title ?? null,
      status ?? null,
      description ?? null,
      id);

    return this.findById(id);
  }

  async remove(id) {
    db
      .prepare(`DELETE * FROM tasks WHERE id=?`)
      .get(id)
  }
}