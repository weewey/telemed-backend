import BaseError from "./base-error";
import {
  ValidateJsErrorFormat,
  invalidParamMapper,
  ExpressValidatorErrors,
} from "./invalid-param-mapper";
import { ApiErrorType } from "./api-error-type";
import { InvalidParam } from "./invalid-param";
import { Logger } from "../logger";

export default class ValidationError extends BaseError {
  public readonly invalidParams: InvalidParam[];

  private constructor(invalidParams: InvalidParam[], id = "") {
    super(400, ApiErrorType.validation, undefined, id);

    this.logErrorsWithMultipleReasons(invalidParams);
    this.invalidParams = invalidParams;

    Object.defineProperty(this, "invalidParams", { writable: false });
    Object.defineProperty(this, "message", {
      enumerable: false,
      writable: false,
    });
  }

  public static from(
    {
      validateJsErrors,
      invalidParams,
      expressValidatorErrors,
    }: {
      validateJsErrors?: ValidateJsErrorFormat;
      invalidParams?: InvalidParam[];
      expressValidatorErrors?: ExpressValidatorErrors;
    },
    id = "",
  ): ValidationError {
    if (validateJsErrors) {
      return ValidationError.fromValidateJs(validateJsErrors, id);
    }
    if (invalidParams) {
      return ValidationError.fromInvalidParam(invalidParams, id);
    }
    if (expressValidatorErrors) {
      return ValidationError.fromExpressValidatorErrors(
        expressValidatorErrors,
        id,
      );
    }

    return new ValidationError([]);
  }

  private static fromValidateJs(
    input: ValidateJsErrorFormat,
    id = "",
  ): ValidationError {
    return new ValidationError(
      invalidParamMapper.fromValidateJSError(input),
      id,
    );
  }

  private static fromInvalidParam(
    invalidParams: InvalidParam[],
    id = "",
  ): ValidationError {
    return new ValidationError(invalidParams, id);
  }

  private static fromExpressValidatorErrors(
    errors: ExpressValidatorErrors,
    id = "",
  ): ValidationError {
    return new ValidationError(
      invalidParamMapper.fromExpressValidatorFormat(errors),
      id,
    );
  }

  private logErrorsWithMultipleReasons(invalidParams: InvalidParam[]): void {
    const errors: {
      [key: string]: string[];
    } = invalidParamMapper.toValidateJSError(invalidParams);
    const errorsWithMultipleReasons = Object.keys(errors)
      .filter(key => errors[key].length > 1)
      .map(name => {
        return { name, reasons: errors[name] };
      });

    if (errorsWithMultipleReasons.length > 0) {
      Logger.error("ValidationError instance has multiple reasons", {
        validationError: this,
        errorsWithMultipleReasons,
      });
    }
  }
}
