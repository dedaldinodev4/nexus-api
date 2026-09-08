import { authFactory } from "./auth.factory.js";

export function authRoutes(router, { prefix = "" }) {
  const { authController } = authFactory()
  router
    .post(`${prefix}/auth/register`, authController.register.bind(authController))
    .post(`${prefix}/auth/login`, authController.login.bind(authController))
    .post(`${prefix}/auth/logout`, authController.logout.bind(authController))
    .get(`${prefix}/auth/me`, authController.me.bind(authController))
    

  return router;
}