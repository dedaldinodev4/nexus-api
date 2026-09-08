import { usersRoutes } from "../modules/users/users.routes.js";
import { authRoutes } from "../modules/auth/auth.routes.js";


export function registerRoutes (router) {
  usersRoutes(router, { prefix: "/api/v1" })
  authRoutes(router, { prefix: "/api/v1" })

  return router;
}