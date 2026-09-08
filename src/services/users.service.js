import { usersRepository } from "../repositories";

export class UserService {
  _repository = usersRepository;

  async list () {
    const users = this._repository.findAll(email);
    return users
  }

  async findbyId (id) {
    const user = this._repository.findOne(id);
    if (!user)
      throw forbidden("User not exist.");
    return user
  }

  async findByEmail (email) {
    const user = this._repository.findByEmail(email);
    if (!user)
      throw forbidden("User not exist.");
    return user
  }

}