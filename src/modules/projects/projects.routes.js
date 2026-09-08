import { projectFactory } from "./projects.factory.js";

export function projectsRoutes(router, { prefix = "" }) {
  const { projectController } = projectFactory()
  router
    .post(`${prefix}/projects`, projectController.create.bind(projectController))
    .get(`${prefix}/projects`, projectController.list.bind(projectController))
    .get(`${prefix}/projects/:id`, projectController.getById.bind(projectController))
    .put(`${prefix}/projects/:id`, projectController.update.bind(projectController))
    .delete(`${prefix}/projects/:id`, projectController.delete.bind(projectController))
    
    .get(`${prefix}/projects/:id/tasks`, projectController.getTasks.bind(projectController))
    .post(`${prefix}/projects/:id/tasks`, projectController.createTask.bind(projectController))

  return router;
}