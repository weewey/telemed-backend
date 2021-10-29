import VideoService from "../../src/services/video-service";
import { twilioClient } from "../../src/clients/twilio-client";
import { RoomInstance } from "twilio/lib/rest/video/v1/room";
import { ConversationInstance } from "twilio/lib/rest/conversations/v1/service/conversation";

describe("VideoServiceTest", () => {
  let createRoomSpyInstance: jest.SpyInstance;
  let createConversationSpyInstance: jest.SpyInstance;
  let addParticipantToConversationSpyInstance: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    createRoomSpyInstance = jest.spyOn(twilioClient, "createRoom")
      .mockResolvedValue({ sid: "roomSid" } as RoomInstance);
    createConversationSpyInstance =
        jest.spyOn(twilioClient, "createConversation").mockResolvedValue({} as ConversationInstance);
    addParticipantToConversationSpyInstance =
        jest.spyOn(twilioClient, "addParticipantToConversation").mockResolvedValue();
    jest.spyOn(twilioClient, "generateVideoToken").mockReturnValue("mocktoken");
  });

  it("should return token from  twilioClient.generateVideoToken", async () => {
    const token = await VideoService.generateToken("doctor@gmail.com", "roomName");
    expect(token).toEqual("mocktoken");
  });

  it("should call createRoom", async () => {
    await VideoService.generateToken("doctor@gmail.com", "roomName");
    expect(createRoomSpyInstance).toBeCalledWith("roomName");
  });

  it("should call addParticipantToConversation", async () => {
    await VideoService.generateToken("doctor@gmail.com", "roomName");
    expect(addParticipantToConversationSpyInstance).toBeCalledWith("roomSid", "doctor@gmail.com");
  });

  it("should call createConversation", async () => {
    await VideoService.generateToken("doctor@gmail.com", "roomName");
    expect(createConversationSpyInstance).toBeCalledWith("roomSid");
  });
});
