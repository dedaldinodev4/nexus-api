import { json } from "../core/http.js";

import { usersRoutes } from "../modules/users/users.routes.js";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { tasksRoutes } from "../modules/tasks/tasks.routes.js";
import { projectsRoutes } from "../modules/projects/projects.routes.js";
import { db } from "../database/db.js";
import { AppError } from "../core/errors/error.js";


export function registerRoutes(router) {

  usersRoutes(router, { prefix: "/api/v1" })
  authRoutes(router, { prefix: "/api/v1" })
  tasksRoutes(router, { prefix: "/api/v1" })
  projectsRoutes(router, { prefix: "/api/v1" })


  router.get("/health", async ({ res }) => {
    try {
      db.prepare(`SELECT 1`);
      return json(
        res,
        200,
        {
          status: "ok",
          uptime: Math.floor(process.uptime()),
          timestamp: new Date().toISOString(),
          node: process.version,
          version: '1.0.0',
          database: 'connected',
        });
    } catch (error) {
      throw new AppError('error', 503, { status: 'error', database: 'disconnected' });
    }
  });

  return router;
}