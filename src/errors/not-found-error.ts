import BaseError from "./base-error";
import { ApiErrorType } from "./api-error-type";
export default class NotFoundError extends BaseError {
  public readonly code: string;

  public constructor(code: string, message: string, id = "") {
    super(404, ApiErrorType.notFound, message, id);
    this.code = code;

    Object.defineProperty(this, "code", {
      writable: false,
    });
  }
}
