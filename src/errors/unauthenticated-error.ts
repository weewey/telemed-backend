import BaseError from "./base-error";
import { ApiErrorType } from "./api-error-type";

export default class UnauthenticatedError extends BaseError {
  public constructor(message = "Unauthorized", id = "") {
    super(401, ApiErrorType.authentication, message, id);
  }
}
