import BaseError from "./base-error";
import { ApiErrorType } from "./api-error-type";

export default class NotFoundError extends BaseError {
  public readonly code: string;

  public constructor(message: string, code: string, id = "") {
    super(404, ApiErrorType.business, message, id);
    this.code = code;

    Object.defineProperty(this, "code", {
      writable: false
    });
  }
}
