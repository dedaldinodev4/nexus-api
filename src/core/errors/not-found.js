import { AppError } from "./error.js";

export const notFound = (message = "Resource not found") => {
  return new AppError(404, "NOT_FOUND", message);
}