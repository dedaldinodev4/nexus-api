import { AppError } from "./error";

export const conflict = (message, details) => {
  return new AppError(409, "CONFLICT", message, details);
}