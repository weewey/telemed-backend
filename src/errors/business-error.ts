import BaseError from "./base-error";
import { ApiErrorType } from "./api-error-type";

export default class BusinessError extends BaseError {
  public readonly code: string;

  public constructor(code: string, message: string, id = "") {
    super(400, ApiErrorType.business, message, id);
    this.code = code;

    Object.defineProperty(this, "code", {
      writable: false,
    });
  }
}
