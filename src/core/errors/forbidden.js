import { AppError } from "./error.js";

export const forbidden = (message = "Forbidden") => {
  return new AppError(403, "FORBIDDEN", message);
}