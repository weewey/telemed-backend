import ZoomClient, {
  CreateZoomMeetingRequest,
  CreateZoomUserRequest,
  ZoomUserInfo,
} from "../../src/clients/zoom-client";
import axios, { AxiosInstance } from "axios";

describe("ZoomClient", () => {
  const apiKey = "apiKey";
  const apiSecret = "apiSecret";
  const baseUrl = "baseUrl";

  describe("constructor", () => {
    it("should call axios create with the expected value", () => {
      const spy = jest.spyOn(axios, "create").mockReturnValue({} as AxiosInstance);
      // eslint-disable-next-line no-new
      new ZoomClient(baseUrl, apiKey, apiSecret);
      expect(spy).toBeCalledWith({ "baseURL": "baseUrl",
        "headers":
            { "Accept": "application/json", "Content-Type": "application/json" } });
    });
  });

  describe("createMeetings", () => {
    let zoomClient: ZoomClient;
    const mockAxios = { post: jest.fn() };
    const createZoomMeetingRequest = { host_id: "host_id" } as CreateZoomMeetingRequest;

    beforeEach(() => {
      jest.spyOn(axios, "create").mockReturnValue(mockAxios as unknown as AxiosInstance);
      zoomClient = new ZoomClient(baseUrl, apiKey, apiSecret);
    });

    it("should call post with the expected params", async () => {
      const spy = jest.spyOn(mockAxios, "post").mockResolvedValue({});
      await zoomClient.createMeeting(createZoomMeetingRequest);
      expect(spy).toBeCalledWith(`${baseUrl}/users/host_id/meetings`, createZoomMeetingRequest,
        { "headers": { "Authorization": expect.any(String) } });
    });
  });

  describe("createUser", () => {
    let zoomClient: ZoomClient;
    const mockAxios = { post: jest.fn() };
    const createZoomUserRequest = { action: "1", user_info: { email: "" } as ZoomUserInfo } as CreateZoomUserRequest;

    beforeEach(() => {
      jest.spyOn(axios, "create").mockReturnValue(mockAxios as unknown as AxiosInstance);
      zoomClient = new ZoomClient(baseUrl, apiKey, apiSecret);
    });

    it("should call axios create with the expected value", async () => {
      const spy = jest.spyOn(mockAxios, "post").mockResolvedValue({});
      await zoomClient.createUser(createZoomUserRequest);
      expect(spy).toBeCalledWith(`${baseUrl}/users`, createZoomUserRequest,
        { "headers": { "Authorization": expect.any(String) } });
    });
  });
});
