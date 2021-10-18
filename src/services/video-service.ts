import { twilioClient } from "../clients/twilio-client";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";

class VideoService {
  public static generateToken(identity: string, room: string): string {
    try {
      return twilioClient.generateVideoToken(identity, room);
    } catch (e) {
      const errorMessage = `Error generating video token from Twilio: ${e.message}`;
      Logger.error(errorMessage);
      throw new TechnicalError(e.message);
    }
  }
}

export default VideoService;
