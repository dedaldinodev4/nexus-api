import { json, readJson } from "../../core/http.js";
import { config } from "../../config/index.js";


export class TaskController {
  #service;

  constructor(service) {
    this.#service = service;
  }

  async getById({ res, params }) {
    const task = await this.#service.getById(params.id);
    return json(res, 200, task)
  }

  async update({ req, res, params }) {
    const body = await readJson(req, config.bodyLimit);
    const task = await this.#service.update(
      params.id,
      body
    );
    return json(res, 201, task)
  }

  async remove({ res, params }) {
    await this.#service.remove(params.id);
    res.writeHead(204);
    res.end();
  }
}