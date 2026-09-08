import { config } from "../../config/index.js";
import { readJson, json } from "../../core/http.js";

export class AuthController {
  #service;

  constructor (service) {
    this.#service = service;
  }

  async register ({ req, res }) {
    const body = await readJson(req, config.bodyLimit);
    const user = await this.#service.register(body);
    json(res, 201, { data: user });
  }

  async login ({ req, res }) {
    const body = await readJson(req, config.bodyLimit);
    const result = await this.#service.login(body);
    json(
      res,
      200,
      { data: result.user },
      { "set-cookie": result.setCookie }
    );
  }

  async logout ({ req, res }) {
    const cookie = req.headers.cookie || "";
    const match = cookie.match(/(?:^|;\s*)sid=([^;]+)/);
    if (match) {
      await this.#service.logout(match);
    }
    json(
      res,
      200,
      { data: { loggedOut: true } },
      { "set-cookie": "sid=; HttpOnly; Path=/; Max-Age=0" }
    );
  }

  async me ({ res, state }) {
    json(res, 200, { data: state.user });
  }

}