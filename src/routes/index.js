import { usersRoutes } from "../modules/users/users.routes.js";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { tasksRoutes } from "../modules/tasks/tasks.routes.js";
import { projectsRoutes } from "../modules/projects/projects.routes.js";


export function registerRoutes (router) {
  usersRoutes(router, { prefix: "/api/v1" })
  authRoutes(router, { prefix: "/api/v1" })
  tasksRoutes(router, { prefix: "/api/v1" })
  projectsRoutes(router, { prefix: "/api/v1" })

  return router;
}