import { config } from "../../config/index.js";
import { json,  } from "../../core/http.js";


export class UserController {
  #service;

  constructor (service) {
    this.#service = service;
  }

  async list ({ res, query }) {
    const users = await this.#service.getAllUsers({
      page: query.get("page"),
      limit: query.get("limit")
    });

    return json(
      res,
      200,
      users
    )
  }

  async getById ({ res, params }) {
    const user = await this.#service.getById(params.id);
    return json(res, 200, user)
  }
  

  async update ({ req, res, params }) {
    const body = await readJson(req, config.bodyLimit);

    const user = await this.#service.update(
      params.id,
      body
    );
    return json(res, 201, user)
  }

  async delete ({ res, params }) {
    await this.#service.delete(params.id);
    res.writeHead(204);
    res.end();
  }

}