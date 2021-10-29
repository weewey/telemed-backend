import { twilioClient } from "../clients/twilio-client";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";

class VideoService {
  public static async generateToken(identity: string, roomName: string): Promise<string> {
    try {
      const room = await twilioClient.createRoom(roomName);
      await twilioClient.createConversation(room.sid);
      await twilioClient.addParticipantToConversation(room.sid, identity);
      return twilioClient.generateVideoToken(identity, roomName);
    } catch (e) {
      const errorMessage = `Error generating video token from Twilio: ${e.message}`;
      Logger.error(errorMessage);
      throw new TechnicalError(e.message);
    }
  }
}

export default VideoService;
