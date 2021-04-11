import { ApiErrorType } from "../../src/errors/api-error-type";
import BaseError from "../../src/errors/base-error";

describe("Base Error", () => {
  it("should create a new Base error with provided error message", () => {
    const error: BaseError = new BaseError(400, ApiErrorType.authorization, "Message");
    expect(error.message).toBe("Message");
  });

  it("should create a new Base error with empty string if there is no message provided", () => {
    const error: BaseError = new BaseError(400, ApiErrorType.authorization, undefined);
    expect(error.message).toBe("");
  });

  it("should not serialize status when converting to json", () => {
    const error: BaseError = new BaseError(400, ApiErrorType.authorization, "Message");
    expect(JSON.parse(JSON.stringify(error))).not.toContain("status");
  });

  it("should not be able to edit id, message, status, type", () => {
    const error: BaseError = new BaseError(400, ApiErrorType.authorization, "Message");
    const propertyDescriptors = Object.getOwnPropertyDescriptors(error);

    expect(propertyDescriptors.id.writable).toBe(false);
    expect(propertyDescriptors.message.writable).toBe(false);
    expect(propertyDescriptors.status.writable).toBe(false);
    expect(propertyDescriptors.type.writable).toBe(false);
  });
});
