import { get } from "lodash";

export interface ZoomConfig {
  apiKey: string
  apiSecret: string
  baseUrl: string
}

export interface TwilioConfig {
  accountSid: string
  accountToken: string
  verifyServiceSid: string
  messageServiceSid: string
  videoApiKeySid: string
  videoApiSecret: string
}

class EnvConfig {
  public get nodeEnvironment(): string {
    return get(process.env, "NODE_ENV", "local");
  }

  public get isTestEnvironment(): boolean {
    return [ "local", "dev", "test" ].includes(this.nodeEnvironment);
  }

  public get zoomConfig(): ZoomConfig {
    return {
      apiKey: get(process.env, "ZOOM_API_KEY", ""),
      apiSecret: get(process.env, "ZOOM_API_SECRET", ""),
      baseUrl: get(process.env, "ZOOM_BASE_URL", ""),
    };
  }

  public get twilioConfig(): TwilioConfig {
    return {
      accountSid: get(process.env, "TWILIO_ACCOUNT_SID", ""),
      accountToken: get(process.env, "TWILIO_ACCOUNT_TOKEN", ""),
      verifyServiceSid: get(process.env, "TWILIO_VERIFY_SERVICE_SID", ""),
      messageServiceSid: get(process.env, "TWILIO_MESSAGE_SERVICE_SID", ""),
      videoApiKeySid: get(process.env, "TWILIO_VIDEO_API_KEY_SID", ""),
      videoApiSecret: get(process.env, "TWILIO_VIDEO_API_SECRET", ""),
    };
  }

  public get pendingTicketNumToNotify(): number {
    const pendingTicketNumToNotify = get(process.env, "PENDING_TICKET_NUM_TO_NOTIFY", "2");
    return Number(pendingTicketNumToNotify);
  }

  public get qdocPortalBaseUrl(): string {
    return get(process.env, "QDOC_PORTAL_BASE_URL", "");
  }
}

export default new EnvConfig();
