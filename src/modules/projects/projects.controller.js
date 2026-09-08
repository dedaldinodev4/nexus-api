import { config } from "../../config/index.js";
import { json, readJson } from "../../core/http.js";

export class ProjectController {
  #service;

  constructor(service) {
    this.#service = service;
  }

  async list ({ res, state }) {
    const projects = await this.#service.listByOwner(state.user.id);
    json(res, 200, { data: projects });
  }

  async getById({ res, params }) {
    const project = await this.#service.getById(params.id);
    return json(res, 200, project)
  }

  async create ({req, res, state }) {
    const body = await readJson(req, config.bodyLimit);
    const project = await this.#service.create({
      name: body.name,
      ownerId: state.user.id,
      description: body.description || ""
    });

    return json(res, 201, { data: project })
  }

  async update({ req, res, state, params }) {
    const body = await readJson(req, config.bodyLimit);
    const task = await this.#service.update(
      params.id,
      {
        name: body.name,
        ownerId: state.user.id,
        description: body.description || ""
      }
    );
    return json(res, 201, task)
  }

  async delete({ res, params }) {
    await this.#service.delete(params.id);
    res.writeHead(204);
    res.end();
  }

  async getTasks ({ res, state, params }) {
    const tasks = await this.#service.getAllTasks(params.id, state.user.id);
    return json(res, 200, { data: tasks });
  }

  async createTask ({ res, state, params }) {
    const task = await this.#service.create.createTask(
      state.user.id,
      {
        projectId: params.id,
        title: body.title,
        description: body.description || ""
      }
    );
    return json(res, 201, { data: task });
  }

}