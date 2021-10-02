import { get } from "lodash";

export interface ZoomConfig {
  apiKey: string
  apiSecret: string
  baseUrl: string
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
}

export default new EnvConfig();
