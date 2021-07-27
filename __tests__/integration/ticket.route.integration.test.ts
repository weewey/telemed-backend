import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../../src/app";

describe("#Ticket Route Integration Test", () => {
  const TICKETS_PATH = "/api/v1/tickets";

  describe("#GET /tickets", () => {
    it("should create queue successfully given clinic exists", async () => {
      await request(app)
        .get(TICKETS_PATH)
        .expect(StatusCodes.OK);
    });
  });
});
