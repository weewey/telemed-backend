import TechnicalError from "../../src/errors/technical-error";
import { ApiErrorType } from "../../src/errors/api-error-type";

describe("technical error", () => {
  it("should create a new technical error", () => {
    const error: TechnicalError = new TechnicalError();
    expect(error.message).toBe("Internal Server Error");
    expect(error.status).toBe(500);
    expect(error.type).toBe(ApiErrorType.technical);
  });
});
