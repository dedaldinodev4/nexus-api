import { AppError } from "./error.js";

export const unauthorized = (message = "Authentication required") => {
  return new AppError(401, "UNAUTHORIZED", message);
}