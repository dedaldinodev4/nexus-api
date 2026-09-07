import { AppError } from "./error";

export const badRequest = (message, details) => {
  return new AppError(400, "BAD_REQUEST", message, details);
}