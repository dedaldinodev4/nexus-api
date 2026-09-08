import { 
  forbidden, 
  notFound, 
  badRequest 
} from "../../core/errors/index.js";


export class ProjectService {
  #repository;
  #taskService;

  constructor(repository, taskService) {
    this.#repository = repository;
    this.#taskService = taskService;
  }

  async listByOwner(ownerId) {
    const projects = await this.#repository.findManyByOwner(ownerId);
    return projects;
  }

  async getById(id) {
    const project = await this.#repository.findById(id)
    if (!project) {
      throw notFound(`Project not found.`)
    }
    return project;
  }

  async create({ ownerId, name, description }) {
    if (!name?.trim()) {
      throw badRequest("Project name is required");
    }

    const project = await this.#repository.create({
      ownerId, name, description
    })

    return project;
  }

  async update(id, { name, description }) {
    const project = await this.#repository.findById(id)
    if (!project) {
      throw notFound(`Project not found.`)
    }

    const result = await this.#repository.update(
      id,
      {
        name,
        description
      }
    );

    return result;
  }

  async delete(id) {
    const project = await this.#repository.findById(id)
    if (!project) {
      throw notFound(`Project not found.`)
    }
    await this.#repository.delete(id)
  }

  async getAllTasks (projectId, ownerId) {
    const project = await this.#repository.findById(projectId, ownerId)
    if (!project) {
      throw forbidden("Project not found or not owned by user");
    }

    const tasks = await this.#taskService.listByProject(projectId);
    return tasks;
  }

  async createTask (ownerId, { projectId, title, description }) {
    const project = await this.#repository.findById(projectId, ownerId)
    if (!project) {
      throw forbidden("Project not found or not owned by user");
    }

    if (!title?.trim()) {
      throw badRequest("Task title is required");
    }

    const task = await this.#taskService.create({
      projectId,
      title,
      description
    });
    return task;
  }





}