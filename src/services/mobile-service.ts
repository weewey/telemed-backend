import { twilioClient } from "../clients/twilio-client";
import TechnicalError from "../errors/technical-error";
import { Logger } from "../logger";
import BusinessError from "../errors/business-error";
import { Errors } from "../errors/error-mappings";

interface VerifyMobilePhone {
  to: string
  channel: string
  status: string
  valid: boolean
}

class MobileService {
  public static async verifyMobileNumber(mobileNumber: string): Promise<VerifyMobilePhone> {
    try {
      const { to, channel, status, valid } = await twilioClient.sendMobileVerificationCode(mobileNumber);
      return { to, channel, status, valid };
    } catch (e) {
      Logger.error(`Error sending mobile verification code to ${mobileNumber} ${e.name} ${e.message}`);
      throw new TechnicalError(e.message);
    }
  }

  public static async checkVerificationCode(mobileNumber: string,
    verificationCode: string): Promise<VerifyMobilePhone> {
    try {
      const verificationCheckInstance = await twilioClient
        .checkMobileVerificationCode(mobileNumber, verificationCode);
      if (verificationCheckInstance.valid) {
        const { to, channel, status, valid } = verificationCheckInstance;
        return { to, channel, status, valid };
      }
    } catch (e) {
      Logger.error(`Error verifying mobile verification code ${mobileNumber} ${e.name} ${e.message}`);
      throw new TechnicalError(e.message);
    }

    throw new BusinessError(Errors.INVALID_MOBILE_VERIFICATION_CODE.code,
      `${Errors.INVALID_MOBILE_VERIFICATION_CODE.message}`);
  }

  public static async sendMessage(mobileNumber: string, messageBody: string): Promise<void> {
    try {
      await twilioClient.sendMessage(mobileNumber, messageBody);
    } catch (e) {
      const errorMessage = `Failed to send message via TwilioClient to ${mobileNumber}: ${e.message}`;
      Logger.error(errorMessage);
      throw new TechnicalError(errorMessage);
    }
  }
}

export default MobileService;
