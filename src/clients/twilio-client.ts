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

  public async sendPhoneVerificationCode(phoneNumber: string): Promise<VerificationInstance> {
    return this.client.verify
      .services(this.verifyServiceSid)
      .verifications
      .create({
        to: phoneNumber,
        channel: "sms",
      });
  }

  public async checkPhoneVerificationCode(phoneNumber: string,
    verificationCode: string): Promise<VerificationCheckInstance> {
    return this.client.verify
      .services(this.verifyServiceSid)
      .verificationChecks
      .create({
        to: phoneNumber,
        code: verificationCode,
      });
  }
}

export const twilioClient = new TwilioClient(
  EnvConfig.twilioConfig.accountSid,
  EnvConfig.twilioConfig.accountToken,
  EnvConfig.twilioConfig.verifyServiceSid,
);
