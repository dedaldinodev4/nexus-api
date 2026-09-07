import { AppError } from "./error.js";

export const badRequest = (message, details) => {
  return new AppError(400, "BAD_REQUEST", message, details);
}