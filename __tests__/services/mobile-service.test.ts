import { twilioClient } from "../../src/clients/twilio-client";
import { VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";
import MobileService from "../../src/services/mobile-service";
import TechnicalError from "../../src/errors/technical-error";
import BusinessError from "../../src/errors/business-error";
import { Errors } from "../../src/errors/error-mappings";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

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

  describe("#sendMessage", () => {
    let spy: jest.SpyInstance;
    beforeEach(() => {
      spy = jest.spyOn(twilioClient, "sendMessage").mockResolvedValue({} as MessageInstance);
    });

    it("should call twilioClient.sendMessage", async () => {
      await MobileService.sendMessage("123", "hello");
      expect(spy).toBeCalledWith("123", "hello");
    });

    describe("when it errors", () => {
      it("should raise a TechnicalError", async () => {
        spy = jest.spyOn(twilioClient, "sendMessage").mockRejectedValue(new Error("twilio error"));
        await expect(MobileService.sendMessage("123", "hello"))
          .rejects
          .toThrow("Failed to send message via TwilioClient to 123");
      });
    });
  });
});
