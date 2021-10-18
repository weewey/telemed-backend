import VideoService from "../../src/services/video-service";

describe("VideoServiceTest", () => {
  it("should call twilioClient.generateVideoToken", () => {
    const spy = jest.spyOn(VideoService, "generateToken").mockReturnValue("token");
    VideoService.generateToken("doctor@gmail.com", "ticketid");
    expect(spy).toBeCalledWith("doctor@gmail.com", "ticketid");
  });
});
