import { UserController } from "./users.controller.js";
import { UserRepository } from "./users.repository.js";
import { UserService } from "./users.service.js";


export function userFactory() {
  const userRepository = new UserRepository();

  const userService = new UserService(
    userRepository
  )

  const userController = new UserController(
    userService
  )

  return {
    userRepository,
    userService,
    userController,
  }
}