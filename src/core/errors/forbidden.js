import { AppError } from "./error";

export const forbidden = (message = "Forbidden") => {
  return new AppError(403, "FORBIDDEN", message);
}