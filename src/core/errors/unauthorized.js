import { AppError } from "./error";

export const unauthorized = (message = "Authentication required") => {
  return new AppError(401, "UNAUTHORIZED", message);
}