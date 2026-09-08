import { TaskRepository } from "../tasks/tasks.repository.js";
import { TaskService } from "../tasks/tasks.service.js";

import { ProjectController } from "./projects.controller.js";
import { ProjectRepository } from "./projects.repository.js";
import { ProjectService } from "./projects.service.js";


export function projectFactory() {

  const projectRepository = new ProjectRepository();
  const taskRepository = new TaskRepository();
  const taskService = new TaskService(
    taskRepository
  );

  const projectService = new ProjectService(
    projectRepository,
    taskService
  )

  const projectController = new ProjectController(
    projectService
  )

  return {
    projectRepository,
    projectService,
    projectController,
  }
}