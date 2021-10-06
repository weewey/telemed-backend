import { twilioClient } from "../../src/clients/twilio-client";
import { VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";
import MobileService from "../../src/services/mobile-service";
import TechnicalError from "../../src/errors/technical-error";
import BusinessError from "../../src/errors/business-error";
import { Errors } from "../../src/errors/error-mappings";

describe("MobileServiceTest", () => {
  describe("#verifyMobileNumber", () => {
    it("should call twilioClient.sendMobileVerificationCode", async () => {
      const spy = jest.spyOn(twilioClient, "sendMobileVerificationCode")
        .mockResolvedValue({} as VerificationInstance);
      await MobileService.verifyMobileNumber("123");
      expect(spy).toBeCalledWith("123");
    });

    describe("when it errors", () => {
      it("should return technical error", async () => {
        jest.spyOn(twilioClient, "sendMobileVerificationCode")
          .mockRejectedValue(new Error("test"));
        await expect(MobileService.verifyMobileNumber("123"))
          .rejects
          .toThrow(new TechnicalError("test"));
      });
    });
  });

  describe("#isVerificationCodeValid", () => {
    describe("when it is valid", () => {
      it("should call twilioClient.isVerificationCodeValid", async () => {
        const spy = jest.spyOn(twilioClient, "checkMobileVerificationCode")
          .mockResolvedValue({ valid: true } as VerificationCheckInstance);
        await MobileService.checkVerificationCode("123", "123");
        expect(spy).toBeCalledWith("123", "123");
      });
    });
    describe("when it is invalid", () => {
      it("should return business error", async () => {
        jest.spyOn(twilioClient, "checkMobileVerificationCode")
          .mockResolvedValue({ valid: false } as VerificationCheckInstance);
        await expect(MobileService.checkVerificationCode("123", "123"))
          .rejects.toThrow(new BusinessError(Errors.INVALID_MOBILE_VERIFICATION_CODE.code,
            `${Errors.INVALID_MOBILE_VERIFICATION_CODE.message}`));
      });
    });

    describe("when it errors", () => {
      it("should throw the expected error", async () => {
        jest.spyOn(twilioClient, "checkMobileVerificationCode")
          .mockRejectedValue(new Error("test"));
        await expect(MobileService.checkVerificationCode("123", "1"))
          .rejects
          .toThrow(new TechnicalError("test"));
      });
    });
  });
});
