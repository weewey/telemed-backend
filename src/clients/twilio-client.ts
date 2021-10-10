import twilio, { Twilio } from "twilio";
import { VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";
import EnvConfig from "../config/env-config";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

export class TwilioClient {
  private client: Twilio;

  private readonly verifyServiceSid: string;

  private readonly messageServiceSid: string;

  constructor(accountSid: string,
    accountToken: string,
    verifyServiceSid: string,
    messageServiceSid: string) {
    this.client = twilio(accountSid, accountToken, {
      edge: "singapore",
      lazyLoading: true,
    });
    this.verifyServiceSid = verifyServiceSid;
    this.messageServiceSid = messageServiceSid;
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

  public async sendMessage(
    toMobileNumber: string,
    message: string,
  ): Promise<MessageInstance> {
    return this.client.messages
      .create({
        body: message,
        to: toMobileNumber,
        messagingServiceSid: this.messageServiceSid,
      });
  }
}

export const twilioClient = new TwilioClient(
  EnvConfig.twilioConfig.accountSid,
  EnvConfig.twilioConfig.accountToken,
  EnvConfig.twilioConfig.verifyServiceSid,
  EnvConfig.twilioConfig.messageServiceSid,
);
