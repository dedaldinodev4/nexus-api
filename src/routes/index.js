import { registerUserRoutes } from "../modules/users/users.routes.js";


export function registerRoutes (router) {
  registerUserRoutes(router, { prefix: "/api/v1" })

  return router;
}