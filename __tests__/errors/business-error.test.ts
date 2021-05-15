import { ApiErrorType } from "../../src/errors/api-error-type";
import BusinessError from "../../src/errors/business-error";

describe("business error", () => {
  it("should create a new business error", () => {
    const error: BusinessError = new BusinessError("QDOC-TEST-001", "Message");
    expect(error.message).toBe("Message");
    expect(error.code).toBe("QDOC-TEST-001");
    expect(error.type).toBe(ApiErrorType.business);
  });

  it("should not be able to modify code", () => {
    const error: BusinessError = new BusinessError("QDOC-TEST-001", "Message");

    const propertyDescriptors = Object.getOwnPropertyDescriptors(error);
    const isInvalidParamsWriteable =
        propertyDescriptors.code.writable;
    expect(isInvalidParamsWriteable).toStrictEqual(false);
  });
});
