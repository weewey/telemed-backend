import twilio, { Twilio } from "twilio";
import { VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";
import EnvConfig from "../config/env-config";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";
import AccessToken from "twilio/lib/jwt/AccessToken";

export class TwilioClient {
  private client: Twilio;

  private readonly verifyServiceSid: string;

  private readonly messageServiceSid: string;

  private readonly chatServiceSid: string;

  private readonly videoApiKeySid: string;

  private readonly videoApiSecret: string;

  private readonly accountSid: string;

  constructor(
    accountSid: string,
    accountToken: string,
    verifyServiceSid: string,
    messageServiceSid: string,
    videoApiKeySid: string,
    videoApiSecret: string,
    chatServiceSid: string,
  ) {
    this.client = twilio(accountSid, accountToken, {
      edge: "singapore",
      lazyLoading: true,
    });
    this.accountSid = accountSid;
    this.verifyServiceSid = verifyServiceSid;
    this.messageServiceSid = messageServiceSid;
    this.videoApiKeySid = videoApiKeySid;
    this.videoApiSecret = videoApiSecret;
    this.chatServiceSid = chatServiceSid;
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
    return this.client.messages.create({
      body: message,
      to: toMobileNumber,
      messagingServiceSid: this.messageServiceSid,
    });
  }

  public generateVideoToken(identity: string, room: string): string {
    const token = new AccessToken(this.accountSid, this.videoApiKeySid, this.videoApiSecret, { region: "sg1" });
    token.identity = identity;
    const grant = new AccessToken.VideoGrant({ room });
    const chatGrant = new AccessToken.ChatGrant({ serviceSid: this.chatServiceSid });
    token.addGrant(grant);
    token.addGrant(chatGrant);
    return token.toJwt();
  }
}

export const twilioClient = new TwilioClient(
  EnvConfig.twilioConfig.accountSid,
  EnvConfig.twilioConfig.accountToken,
  EnvConfig.twilioConfig.verifyServiceSid,
  EnvConfig.twilioConfig.messageServiceSid,
  EnvConfig.twilioConfig.videoApiKeySid,
  EnvConfig.twilioConfig.videoApiSecret,
  EnvConfig.twilioConfig.chatServiceSid,
);
