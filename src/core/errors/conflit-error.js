import { AppError } from "./error.js";

export const conflict = (message, details) => {
  return new AppError(409, "CONFLICT", message, details);
}