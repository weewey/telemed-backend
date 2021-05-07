import ValidationError from "../../src/errors/validation-error";
import { Logger } from "../../src/logger";
import { ApiErrorType } from "../../src/errors/api-error-type";

jest.mock("../../src/logger", () => ({
  error: jest.fn()
}));

describe("validation error", () => {
  const validationSample = {
    id: "fake-uuid",
    invalidParams: [ { name: "error", reason: "reason" } ],
    type: "validation"
  };
  it("should create a new validation error from invalid params", () => {
    const error: ValidationError = ValidationError.from(
      { invalidParams: validationSample.invalidParams },
      validationSample.id
    );
    expect(error.message).toBe("");
    expect(error.status).toBe(400);
    expect(error.type).toBe(ApiErrorType.validation);
    expect(error.invalidParams).toStrictEqual(validationSample.invalidParams);
  });

  it("should create a new validation error from Express validator errors", () => {
    const error: ValidationError = ValidationError.from({
      expressValidatorErrors: [ { param: "nric", msg: "Invalid NRIC" } ]
    });
    expect(error.message).toBe("");
    expect(error.status).toBe(400);
    expect(error.type).toBe(ApiErrorType.validation);
    expect(error.invalidParams).toStrictEqual([
      {
        name: "nric",
        reason: "Invalid NRIC"
      }
    ]);
  });
  it("should create a new validation error from validate js error outputs", () => {
    const error: ValidationError = ValidationError.from({
      validateJsErrors: { error: [ "reason" ] }
    });
    expect(error.message).toBe("");
    expect(error.status).toBe(400);
    expect(error.type).toBe(ApiErrorType.validation);
    expect(error.invalidParams).toStrictEqual(validationSample.invalidParams);
  });

  it("should be able to handle undefined errors", () => {
    const error: ValidationError = ValidationError.from({});
    expect(error.invalidParams).toStrictEqual([]);
  });

  it("should be able to convert invalidParams back to its original format", () => {
    const error: ValidationError = ValidationError.from(
      { invalidParams: validationSample.invalidParams },
      validationSample.id
    );
    expect(error.invalidParams).toStrictEqual(validationSample.invalidParams);
  });

  it("should not serialize message when converting to json", () => {
    const error: ValidationError = ValidationError.from(
      { invalidParams: validationSample.invalidParams },
      validationSample.id
    );
    expect(JSON.parse(JSON.stringify(error))).not.toContain("message");
  });

  it("should not be able to modify invalidParams or message", () => {
    const error: ValidationError = ValidationError.from(
      { invalidParams: validationSample.invalidParams },
      validationSample.id
    );

    const propertyDescriptors = Object.getOwnPropertyDescriptors(error);
    expect(propertyDescriptors.invalidParams.writable).toStrictEqual(false);
    expect(propertyDescriptors.message.writable).toStrictEqual(false);
  });


  // Todo need to mock Logger propery, current getting undefined
  it.skip("should log if there are errors with multiple reasons", () => {
    const validationError = ValidationError.from({
      validateJsErrors: { nric: [ "Invalid", "Missing" ] }
    });
    expect(Logger.error).toHaveBeenCalledWith(
      "ValidationError instance has multiple reasons",
      {
        validationError,
        errorsWithMultipleReasons: [
          { name: "nric", reasons: [ "Invalid", "Missing" ] }
        ]
      }
    );
  });
});

describe("ValidationError.from", () => {
  it("should return validation error with empty arguments ", () => {
    const error = ValidationError.from({});
    expect(error.invalidParams).toBeInstanceOf(Array);
    expect(error.invalidParams).toHaveLength(0);
  });
});
