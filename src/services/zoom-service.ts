import { zoomClient, ZoomMeeting, ZoomUser } from "../clients/zoom-client";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";

export default class ZoomService {
  static BASIC_USER_TYPE = 1;

  static INSTANT_MEETING_TYPE = 1;

  public static async createUser(email: string, firstName: string, lastName: string): Promise<ZoomUser> {
    try {
      return await zoomClient.createUser({
        action: "create",
        user_info: {
          email,
          first_name: firstName,
          last_name: lastName,
          type: this.BASIC_USER_TYPE,
        },
      });
    } catch (e) {
      const errorMessage = `Error creating zoom user ${e.message}`;
      Logger.error(errorMessage);
      throw e;
    }
  }

  public static async createMeeting(email: string): Promise<ZoomMeeting> {
    const createMeetingRequest = {
      host_id: email,
      waiting_room: true,
      settings: {
        audio: "both",
        auto_recording: "none",
        enforce_login: false,
        host_video: true,
        mute_upon_entry: false,
        participant_video: true,
        waiting_room: true,
        watermark: false,
      },
      timezone: "Asia/Singapore",
      topic: `Consultation with Dr ${email}`,
      type: this.INSTANT_MEETING_TYPE,
      encryption_type: "e2ee",
    };
    try {
      return await zoomClient.createMeeting(createMeetingRequest);
    } catch (e) {
      Logger.error(`Error creating meeting: ${e.message}`);
      throw new TechnicalError(e.message);
    }
  }
}
