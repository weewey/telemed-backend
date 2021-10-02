import axios, { AxiosInstance } from "axios";
import jwt from "jsonwebtoken";
import EnvConfig from "../config/env-config";

export interface ZoomUserInfo {
  email: string
  type: number
  first_name: string
  last_name: string
}

export interface ZoomUser {
  id: string
  email: string
}

export interface CreateZoomUserRequest {
  action: string
  user_info: ZoomUserInfo
}

export interface ZoomMeeting {
  uuid: string
  id: string
  start_url: string
  join_url: string
}

export interface ZoomMeetingSettings {
  audio: string
  auto_recording: string
  enforce_login: boolean
  host_video: boolean
  mute_upon_entry: boolean
  participant_video: boolean
  waiting_room: boolean
  watermark: boolean
}

export interface CreateZoomMeetingRequest {
  host_id: string
  waiting_room: boolean
  settings: ZoomMeetingSettings
  timezone: string
  topic: string
  type: number
  encryption_type: string
}

export default class ZoomClient {
  private client: AxiosInstance;

  private readonly baseUrl: string;

  private readonly apiSecret: string;

  private readonly apiKey: string;

  constructor(baseUrl: string, apiKey: string, apiSecret: string) {
    this.baseUrl = baseUrl;
    this.apiSecret = apiSecret;
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  public async createMeeting(createZoomMeetingRequest: CreateZoomMeetingRequest): Promise<ZoomMeeting> {
    return this.client.post<CreateZoomMeetingRequest, ZoomMeeting>(
      `${this.baseUrl}/users/${createZoomMeetingRequest.host_id}/meetings`,
      createZoomMeetingRequest,
      { headers: { "Authorization": `Bearer ${this.getToken(this.apiKey, this.apiSecret)}` } },
    );
  }

  public async createUser(createZoomUserRequest: CreateZoomUserRequest): Promise<ZoomUser> {
    return this.client.post<CreateZoomUserRequest, ZoomUser>(`${this.baseUrl}/users`,
      createZoomUserRequest,
      { headers: { "Authorization": `Bearer ${this.getToken(this.apiKey, this.apiSecret)}` } });
  }

  private getToken(apiKey: string, apiSecret: string): string {
    const payload = {
      iss: apiKey,
      exp: ((new Date()).getTime() + 5000),
    };
    return jwt.sign(payload, apiSecret);
  }
}

export const zoomClient =
    new ZoomClient(EnvConfig.zoomConfig.baseUrl, EnvConfig.zoomConfig.apiKey, EnvConfig.zoomConfig.apiSecret);
