import { TwilioClient } from "../../src/clients/twilio-client";
import twilio from "twilio";
import AccessToken from "twilio/lib/jwt/AccessToken";

const mockVerificationCreate = jest.fn();
const mockMessageCreate = jest.fn();
const mockVideoRoomCreateFetch = jest.fn();
const mockConversationFetch = jest.fn();
const mockCreateParticipantsToConversation = jest.fn();

jest.mock("twilio", () => jest.fn(() => ({
  verify: {
    services: () => ({
      verificationChecks: {
        create: mockVerificationCreate,
      },
      verifications: {
        create: mockVerificationCreate,
      },
    }),
  },
  messages: {
    create: jest.fn(() => mockMessageCreate),
  },
  video: {
    rooms: () => ({
      fetch: mockVideoRoomCreateFetch,
    }),
  },
  conversations: {
    services: () => ({
      conversations: () => ({
        fetch: mockConversationFetch,
        participants: {
          create: mockCreateParticipantsToConversation,
        },
      }),
    }),
  },
}
)));

jest.mock("twilio/lib/jwt/AccessToken");

describe("TwilioClient", () => {
  it("new should call twilio with the expected", () => {
    // @ts-ignore
    const testClient = new TwilioClient(
      "ACaccountSid",
      "accountToken",
      "verifyServiceSid",
      "messageServiceSid",
      "videoApiKeySid",
      "videoApiSecret",
    );
    expect(twilio).toHaveBeenCalledWith("ACaccountSid", "accountToken",
      { "edge": "singapore", "lazyLoading": true });
  });

  describe("checkMobileVerificationCode", () => {
    it("should call the expected", async () => {
      const testClient = new TwilioClient(
        "ACaccountSid",
        "accountToken",
        "verifyServiceSid",
        "messageServiceSid",
        "videoApiKeySid",
        "videoApiSecret",
        "chatServiceSid",
      );
      await testClient.checkMobileVerificationCode("123", "123");
      expect(mockVerificationCreate).toHaveBeenCalledWith({ to: "123", code: "123" });
    });
  });

  describe("sendMobileVerificationCode", () => {
    it("should call the expected", async () => {
      const testClient = new TwilioClient(
        "ACaccountSid",
        "accountToken",
        "verifyServiceSid",
        "messageServiceSid",
        "videoApiKeySid",
        "videoApiSecret",
        "chatServiceSid",
      );
      await testClient.sendMobileVerificationCode("123");
      expect(mockVerificationCreate).toHaveBeenCalledWith({ to: "123", channel: "sms" });
    });
  });

  describe("generateVideoToken", () => {
    it("should call the expected", () => {
      const testClient = new TwilioClient(
        "ACaccountSid",
        "accountToken",
        "verifyServiceSid",
        "messageServiceSid",
        "videoApiKeySid",
        "videoApiSecret",
        "chatServiceSid",
      );
      testClient.generateVideoToken("123", "hello");
      expect(AccessToken).toHaveBeenCalledWith("ACaccountSid", "videoApiKeySid", "videoApiSecret", { region: "sg1" });
    });
  });

  describe("createRoom", () => {
    describe("if the room exists", () => {
      it("should return the room from client.video.rooms.fetch", async () => {
        const testClient = new TwilioClient(
          "ACaccountSid",
          "accountToken",
          "verifyServiceSid",
          "messageServiceSid",
          "videoApiKeySid",
          "videoApiSecret",
          "chatServiceSid",
        );
        await testClient.createRoom("test");
        expect(mockVideoRoomCreateFetch).toHaveBeenCalled();
      });
    });
  });

  describe("createConversation", () => {
    it("should call from client.conversation.services.fetch", async () => {
      const testClient = new TwilioClient(
        "ACaccountSid",
        "accountToken",
        "verifyServiceSid",
        "messageServiceSid",
        "videoApiKeySid",
        "videoApiSecret",
        "chatServiceSid",
      );
      await testClient.createConversation("test");
      expect(mockConversationFetch).toHaveBeenCalled();
    });
  });

  describe("addParticipantToConversation", () => {
    it("should call conversations.participants.create", async () => {
      const testClient = new TwilioClient(
        "ACaccountSid",
        "accountToken",
        "verifyServiceSid",
        "messageServiceSid",
        "videoApiKeySid",
        "videoApiSecret",
        "chatServiceSid",
      );
      await testClient.addParticipantToConversation("roomSid", "identity");
      expect(mockCreateParticipantsToConversation).toHaveBeenCalledWith({ identity: "identity" });
    });
  });
});
