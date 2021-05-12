import request from "supertest";
import app from "../../src/app";
import TicketService from "../../src/services/ticket-service";
import QueueService from "../../src/services/queue-service";
import Ticket from "../../src/models/ticket";
import TicketStatus from "../../src/ticket_status";
import { StatusCodes } from "http-status-codes";

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
        jest.spyOn(TicketService, "create").mockResolvedValue(ticket);
        const expectedTicketAttr = { clinicId, displayNumber: 2, patientId, queueId, status: TicketStatus.WAITING };

        await request(app).post(ticketsPath)
          .send({ patientId, queueId, clinicId });

        expect(QueueService.getQueuesByClinicAndStatus).toHaveBeenCalledTimes(1);
        expect(TicketService.create).toHaveBeenCalledTimes(1);
        expect(TicketService.create).toHaveBeenCalledWith(expectedTicketAttr);
      });
    });

    describe("Error scenarios", () => {
      it("should return 400 if queue not found", async () => {
        jest.spyOn(QueueService, "getQueuesByClinicAndStatus")
          .mockResolvedValue([ { id: 2, latestGeneratedTicketDisplayNumber: displayNumber } as any ]);
        jest.spyOn(TicketService, "create").mockResolvedValue(ticket);
        await request(app).post(ticketsPath)
          .send({ patientId, queueId, clinicId })
          .expect(StatusCodes.BAD_REQUEST);
      });

      it("should return 400 if displayNumber not found", async () => {
        jest.spyOn(QueueService, "getQueuesByClinicAndStatus").mockResolvedValue([ { id: queueId } as any ]);
        jest.spyOn(TicketService, "create").mockResolvedValue(ticket);
        await request(app).post(ticketsPath)
          .send({ patientId, queueId, clinicId })
          .expect(StatusCodes.BAD_REQUEST);
      });
    });
  });
});
