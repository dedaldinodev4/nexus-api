import { notFound } from "../../core/errors/index.js";
import { UserRepository } from "./users.repository.js";

export class UserService {
  #repository;

  constructor (repository) {
    this.#repository = repository;
  }

  async getAllUsers ({ page = "1", limit = "10" }) {
    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 10, 1));
    
    const offset = (currentPage - 1) * perPage;
    
    const [users, total] = await Promise.all([
      this.#repository.findMany({ limit: perPage, offset}),
      this.#repository.count()
    ]);

    return {
      data: users,
      pagination: {
        page: currentPage,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage)
      }
    }
  }

  async getById (id) {
    const user = await this.#repository.findById(id);
    if (!user) {
      throw notFound("User not found.");
    }
    return user;
  }

  async getByEmail (email) {
    const user = await this.#repository.findByEmail(email);
    if (!user) {
      throw notFound("User not found.");
    }
    return user;
  }

  async update (id, data) {
    const user = await this.#repository.findById(id);
    if (!user) {
      throw notFound("User not found.");
    }

    const userUpdated = await this.#repository.update(
      id,
      {
        name: data.name,
        email: data.email
      }
    )
    return  userUpdated;
  }

  async delete (id) {
    const user = await this.#repository.findById(id);
    
    if (!user) {
      throw notFound("User not found.");
    }
    await this.#repository.delete(id);

  }

}