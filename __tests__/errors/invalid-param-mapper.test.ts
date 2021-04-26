import {
  invalidParamMapper,
  ExpressValidatorErrors
} from "../../src/errors/invalid-param-mapper";
import { InvalidParam } from "../../src/errors/invalid-param";

describe("Invalid Param Mapper", () => {
  describe("from validateJS", () => {
    it("should map ValidateJS to invalidParams", () => {
      const validateJSErrors = { error: [ "reason" ] };
      const invalidParams = [ { name: "error", reason: "reason" } ];

      expect(
        invalidParamMapper.fromValidateJSError(validateJSErrors)
      ).toStrictEqual(invalidParams);
    });

    it("should map an empty value to invalidParams with empty values", () => {
      const validateJSErrors = { nric: undefined, mobileNumber: [ "Invalid" ] };
      const invalidParams: InvalidParam[] = [
        { name: "mobileNumber", reason: "Invalid" }
      ];

      expect(
        invalidParamMapper.fromValidateJSError(validateJSErrors)
      ).toStrictEqual(invalidParams);
    });
  });

  describe("to invalidParams", () => {
    it("should map invalidParams to empty values", () => {
      const invalidParams = [ { name: "error", reason: "reason" } ];
      const validateJSErrors = { error: [ "reason" ] };

      expect(invalidParamMapper.toValidateJSError(invalidParams)).toStrictEqual(
        validateJSErrors
      );
    });
    it("should merge multiple invalidParams to ValidateJS", () => {
      const emptyInvalidParams: InvalidParam[] = [
        { name: "mobileNumber", reason: "Not starting with 8 or 9" },
        { name: "mobileNumber", reason: "Not 8 characters" }
      ];
      const emptyValidateJSErrors = {
        mobileNumber: [ "Not starting with 8 or 9", "Not 8 characters" ]
      };
      expect(
        invalidParamMapper.toValidateJSError(emptyInvalidParams)
      ).toStrictEqual(emptyValidateJSErrors);
    });
  });

  describe("from ExpressValidator format", () => {
    it("should map EspressValidator to invalid Params", () => {
      const errors: ExpressValidatorErrors = [
        { msg: "Invalid Nric", param: "nric" },
        { msg: "Invalid Mobile Number", param: "mobileNumber" }
      ];
      const invalidParams: InvalidParam[] = [
        { name: "nric", reason: "Invalid Nric" },
        {
          name: "mobileNumber",
          reason: "Invalid Mobile Number"
        }
      ];
      expect(
        invalidParamMapper.fromExpressValidatorFormat(errors)
      ).toStrictEqual(invalidParams);
    });
  });
  describe("to ExpressValidator format", () => {
    it("should map Invalid Params to ExpressValidator format", () => {
      const invalidParams: InvalidParam[] = [
        { name: "nric", reason: "Invalid Nric" },
        {
          name: "mobileNumber",
          reason: "Invalid Mobile Number"
        }
      ];
      const errors: ExpressValidatorErrors = [
        { msg: "Invalid Nric", param: "nric" },
        { msg: "Invalid Mobile Number", param: "mobileNumber" }
      ];
      expect(
        invalidParamMapper.toExpressValidatorFormat(invalidParams)
      ).toStrictEqual(errors);
    });
  });
});
