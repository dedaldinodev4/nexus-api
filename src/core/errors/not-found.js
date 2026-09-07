import { AppError } from "./error";

export const notFound = (message = "Resource not found") => {
  return new AppError(404, "NOT_FOUND", message);
}