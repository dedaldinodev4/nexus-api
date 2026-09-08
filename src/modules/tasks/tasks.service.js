import { notFound } from "../../core/errors/index.js";


export class TaskService {
  #repository;

  constructor (repository) {
    this.#repository = repository;
  }

  async listByProject (projectId) {
    const tasks = await this.#repository.findManyByProject(projectId);
    return tasks;
  }

  async create ({ projectId, title, description }) {
    const task = await this.#repository.create({
      projectId,
      title,
      description
    })

    return task;
  }

  async getById (id) {
    const task = await this.#repository.findById(id)
    if (!task) {
      throw notFound(`Task not found.`)
    }

    return task;
  }

  async update (id,{ title, description, status } ) {
    const task = await this.#repository.findById(id)
    if (!task) {
      throw notFound(`Task not found.`)
    } 

    const result = await this.#repository.update(
      id,
      {
        title, 
        description, 
        status
      }
    )

    return result;
  }

  async remove (id) {
    const task = await this.#repository.findById(id)
    if (!task) {
      throw notFound(`Task not found.`)
    }
    await this.#repository.remove(id)
  }

}