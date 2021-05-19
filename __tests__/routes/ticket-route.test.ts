import request from "supertest";
import app from "../../src/app";
import TicketService from "../../src/services/ticket-service";
import QueueService from "../../src/services/queue-service";
import Ticket from "../../src/models/ticket";
import TicketStatus from "../../src/ticket_status";
import { StatusCodes } from "http-status-codes";
import { Logger } from "../../src/logger";

describe("Tickets Route", () => {
  const clinicId = 1;
  const patientId = 1;
  const queueId = 1;
  const displayNumber = 1;

  const ticketsPath = "/api/v1/tickets";

  const ticket = {
    "patientId": patientId,
    "status": TicketStatus.WAITING,
    "queueId": queueId,
    "displayNumber": displayNumber,
    "clinicId": clinicId,
  } as Ticket;

  beforeEach(jest.clearAllMocks);

  describe("POST /tickets", () => {
    describe("Successful scenarios", () => {
      // eslint-disable-next-line jest/expect-expect
      it("should return 201 with the expected body", async () => {
        jest.spyOn(QueueService, "getQueuesByClinicAndStatus")
          .mockResolvedValue([ { id: queueId, latestGeneratedTicketDisplayNumber: displayNumber } as any ]);
        jest.spyOn(TicketService, "create").mockResolvedValue(ticket);
        await request(app).post(ticketsPath)
          .send({ patientId, queueId, clinicId })
          .expect(StatusCodes.CREATED)
          .expect(ticket);
      });

      it("calls TicketService #create with the expected params", async () => {
        const ticketServiceSpy = jest.spyOn(TicketService, "create").mockResolvedValue(ticket);
        const expectedTicketAttr = { clinicId, patientId, queueId };

        await request(app).post(ticketsPath)
          .send({ patientId, queueId, clinicId });

        expect(ticketServiceSpy).toHaveBeenCalledTimes(1);
        expect(ticketServiceSpy).toHaveBeenCalledWith(expectedTicketAttr);
      });
    });

    describe("Error scenarios", () => {
      beforeEach(() => {
        jest.spyOn(Logger, "error").mockImplementation(() => {});
      });

      it.each([
        [ "patientId is missing", { clinicId, queueId } ],
        [ "clinicId is missing", { queueId, patientId } ],
        [ "queueId is missing", { patientId, clinicId } ],
      ])("should return bad request when (%s) from request body", async (testName: string, reqParams: any) => {
        await request(app).post(ticketsPath)
          .send(reqParams)
          .expect(StatusCodes.BAD_REQUEST);
      });
    });
  });
});
