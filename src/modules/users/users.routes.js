import { userFactory } from "./users.factory.js";

export function registerUserRoutes(router, { prefix = "" }) {
  const { userController } = userFactory()
  router
    .get(`${prefix}/users`, userController.list.bind(userController))
    .get(`${prefix}/users/:id`, userController.getById.bind(userController))
    .patch(`${prefix}/users/:id`, userController.update.bind(userController))
    .delete(`${prefix}/users/:id`, userController.delete.bind(userController))

  return router;
}