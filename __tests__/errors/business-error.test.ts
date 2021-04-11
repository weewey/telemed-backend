import { ApiErrorType } from "../../src/errors/api-error-type";
import BusinessError from "../../src/errors/business-error";

describe("business error", () => {
  it("should create a new business error", () => {
    const error: BusinessError = new BusinessError("Message", "PPH-TEST-001");
    expect(error.message).toBe("Message");
    expect(error.code).toBe("PPH-TEST-001");
    expect(error.type).toBe(ApiErrorType.business);
  });

  it("should not be able to modify code", () => {
    const error: BusinessError = new BusinessError("Message", "PPH-TEST-001");

    const propertyDescriptors = Object.getOwnPropertyDescriptors(error);
    if (propertyDescriptors.code !== null) {
      const isInvalidParamsWriteable =
        propertyDescriptors.code.writable;
      expect(isInvalidParamsWriteable).toStrictEqual(false);
    } else {
      throw new Error("Became Invalid");
    }
  });
});
