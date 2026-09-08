import { taskFactory } from "./tasks.factory.js";

export function tasksRoutes(router, { prefix = "" }) {
  const { taskController } = taskFactory()
  router
    .get(`${prefix}/tasks/:id`, taskController.getById.bind(taskController))
    .put(`${prefix}/tasks/:id`, taskController.update.bind(taskController))
    .delete(`${prefix}/tasks/:id`, taskController.remove.bind(taskController))

  return router;
}