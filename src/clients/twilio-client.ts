import twilio, { Twilio } from "twilio";
import { VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";
import EnvConfig from "../config/env-config";

export class TwilioClient {
  private client: Twilio;

  private verifyServiceSid: string;

  constructor(accountSid: string, accountToken: string, verifyServiceSid: string) {
    this.client = twilio(accountSid, accountToken, {
      edge: "singapore",
      lazyLoading: true,
    });
    this.verifyServiceSid = verifyServiceSid;
  }

  public async sendMobileVerificationCode(mobileNumber: string): Promise<VerificationInstance> {
    return this.client.verify
      .services(this.verifyServiceSid)
      .verifications
      .create({
        to: mobileNumber,
        channel: "sms",
      });
  }

  public async checkMobileVerificationCode(mobileNumber: string,
    verificationCode: string): Promise<VerificationCheckInstance> {
    return this.client.verify
      .services(this.verifyServiceSid)
      .verificationChecks
      .create({
        to: mobileNumber,
        code: verificationCode,
      });
  }
}

export const twilioClient = new TwilioClient(
  EnvConfig.twilioConfig.accountSid,
  EnvConfig.twilioConfig.accountToken,
  EnvConfig.twilioConfig.verifyServiceSid,
);
