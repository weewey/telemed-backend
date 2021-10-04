import ZoomService from "../../src/services/zoom-service";
import { zoomClient, ZoomMeeting, ZoomUser } from "../../src/clients/zoom-client";

describe("ZoomService", () => {
  const email = "email";
  const firstName = "firstName";
  const lastName = "lastName";

  describe("createUser", () => {
    it("should call zoomClient.createUser with the expected params", async () => {
      const spy = jest.spyOn(zoomClient, "createUser").mockResolvedValue({} as ZoomUser);
      await ZoomService.createUser(email, firstName, lastName);
      expect(spy).toBeCalledWith(
        { "action": "create",
          "user_info":
                { "email": "email", "first_name": "firstName", "last_name": "lastName", "type": 1 } },
      );
    });

    describe("when it errors", () => {
      it("should throw an error", async () => {
        jest.spyOn(zoomClient, "createUser").mockRejectedValue(new Error("123"));
        await expect(ZoomService.createUser(email, firstName, lastName)).rejects.toThrowError();
      });
    });
  });

  describe("createMeeting", () => {
    it("should call zoomClient.createMeeting", async () => {
      const spy = jest.spyOn(zoomClient, "createMeeting").mockResolvedValue({} as ZoomMeeting);
      await ZoomService.createMeeting(email);
      expect(spy).toBeCalledWith({
        "encryption_type": "e2ee",
        "host_id": "email",
        "settings": {
          "audio": "both",
          "auto_recording": "none",
          "enforce_login": false,
          "host_video": true,
          "mute_upon_entry": false,
          "participant_video": true,
          "waiting_room": true,
          "watermark": false,
        },
        "timezone": "Asia/Singapore",
        "topic": "Consultation with Dr email",
        "type": 1,
        "waiting_room": true,
      });
    });
  });
});
