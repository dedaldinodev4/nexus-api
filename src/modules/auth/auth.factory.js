import { UserRepository } from "../users/users.repository.js";
import { UserService } from "../users/users.service.js";
import { AuthController } from "./auth.controller.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";


export function authFactory () {
  const authRepository = new AuthRepository();
  const userRepository = new UserRepository();
  
  const userService = new UserService(
    userRepository
  );

  const authService = new AuthService(
    authRepository,
    userService
  );

  const authController = new AuthController(
    authService
  );

  return {
    authRepository,
    authService,
    authController
  }
}