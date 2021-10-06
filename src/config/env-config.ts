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
    };
  }
}

export default new EnvConfig();
