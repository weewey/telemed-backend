import { twilioClient } from "../../src/clients/twilio-client";
import { VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";
import MobileService from "../../src/services/mobile-service";

describe("MobileServiceTest", () => {
  describe("#verifyPhoneNumber", () => {
    it("should call twilioClient.sendPhoneVerificationCode", async () => {
      const spy = jest.spyOn(twilioClient, "sendPhoneVerificationCode")
        .mockResolvedValue({} as VerificationInstance);
      await MobileService.verifyPhoneNumber("123");
      expect(spy).toBeCalledWith("123");
    });
  });

  describe("#isVerificationCodeValid", () => {
    it("should call twilioClient.isVerificationCodeValid", async () => {
      const spy = jest.spyOn(twilioClient, "checkPhoneVerificationCode")
        .mockResolvedValue({} as VerificationCheckInstance);
      await MobileService.isVerificationCodeValid("123", "123");
      expect(spy).toBeCalledWith("123", "123");
    });
  });
});
