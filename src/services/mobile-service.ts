import { twilioClient } from "../clients/twilio-client";
import { VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";

class MobileService {
  public static async verifyPhoneNumber(phoneNumber: string): Promise<VerificationInstance> {
    return twilioClient.sendPhoneVerificationCode(phoneNumber);
  }

  public static async isVerificationCodeValid(phoneNumber: string,
    verificationCode: string): Promise<VerificationCheckInstance> {
    return twilioClient
      .checkPhoneVerificationCode(phoneNumber, verificationCode);
  }
}

export default MobileService;
