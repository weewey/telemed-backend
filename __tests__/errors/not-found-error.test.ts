import { ApiErrorType } from "../../src/errors/api-error-type";
import NotFoundError from "../../src/errors/not-found-error";

describe("NotFound error", () => {
  it("should create a new NotFoundError", () => {
    const error: NotFoundError = new NotFoundError("QDOC-TEST-001", "Message");
    expect(error.message).toBe("Message");
    expect(error.code).toBe("QDOC-TEST-001");
    expect(error.type).toBe(ApiErrorType.notFound);
  });

  it("should not be able to modify code", () => {
    const error: NotFoundError = new NotFoundError("Message", "QDOC-TEST-001");

    const propertyDescriptors = Object.getOwnPropertyDescriptors(error);
      const isInvalidParamsWriteable =
        propertyDescriptors.code.writable;
      expect(isInvalidParamsWriteable).toStrictEqual(false);
  });
});
