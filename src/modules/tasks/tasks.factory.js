import { TaskController } from "./tasks.controller.js";
import { TaskRepository } from "./tasks.repository.js";
import { TaskService } from "./tasks.service.js";


export function taskFactory () {

  const taskRepository = new TaskRepository();

  const taskService = new TaskService(
    taskRepository
  );

  const taskController = new TaskController(
    taskService
  )

  return {
    taskRepository,
    taskService,
    taskController,
  }
}