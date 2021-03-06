import request from "supertest";
import app from "../../src/app";
import TicketService from "../../src/services/ticket-service";
import QueueService from "../../src/services/queue-service";
import Ticket from "../../src/models/ticket";
import TicketStatus from "../../src/ticket_status";
import { StatusCodes } from "http-status-codes";
import { Logger } from "../../src/logger";
import NotFoundError from "../../src/errors/not-found-error";
import TicketTypes from "../../src/ticket_types";
import Queue from "../../src/models/queue";
import Clinic from "../../src/models/clinic";
import Patient from "../../src/models/patient";
import Doctor from "../../src/models/doctor";

describe("Tickets Route", () => {
  const clinicId = 1;
  const patientId = 1;
  const queueId = 1;
  const displayNumber = 1;
  const type = TicketTypes.TELEMED;

  const ticketsPath = "/api/v1/tickets";

  const ticket = {
    "patientId": patientId,
    "status": TicketStatus.WAITING,
    "queueId": queueId,
    "displayNumber": displayNumber,
    "clinicId": clinicId,
    "type": type,
  } as Ticket;

  beforeEach(() => {
    jest.spyOn(Logger, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  describe("POST /tickets", () => {
    describe("Successful scenarios", () => {
      // eslint-disable-next-line jest/expect-expect
      it("should return 201 with the expected body", async () => {
        jest.spyOn(QueueService, "getQueuesByClinicAndStatus")
          .mockResolvedValue([ { id: queueId, latestGeneratedTicketDisplayNumber: displayNumber } as any ]);
        jest.spyOn(TicketService, "create").mockResolvedValue(ticket);
        await request(app).post(ticketsPath)
          .send({ patientId, queueId, clinicId, type })
          .expect(StatusCodes.CREATED)
          .expect(ticket);
      });

      it("calls TicketService #create with the expected params", async () => {
        const ticketServiceSpy = jest.spyOn(TicketService, "create").mockResolvedValue(ticket);
        const expectedTicketAttr = { clinicId, patientId, queueId, type };

        await request(app).post(ticketsPath)
          .send({ patientId, queueId, clinicId, type });

        expect(ticketServiceSpy).toHaveBeenCalledTimes(1);
        expect(ticketServiceSpy).toHaveBeenCalledWith(expectedTicketAttr);
      });
    });

    describe("Error scenarios", () => {
      beforeEach(() => {
        jest.spyOn(Logger, "error").mockImplementation(() => {});
      });

      it.each([
        [ "patientId is missing", { clinicId, queueId, type } ],
        [ "clinicId is missing", { queueId, patientId, type } ],
        [ "queueId is missing", { patientId, clinicId, type } ],
        [ "type is missing", { patientId, clinicId, queueId } ],
      ])("should return bad request when (%s) from request body", async (testName: string, reqParams: any) => {
        await request(app).post(ticketsPath)
          .send(reqParams)
          .expect(StatusCodes.BAD_REQUEST);
      });
    });
  });

  describe("PUT /tickets", () => {
    describe("Successful scenarios", () => {
      const ticketId = 123456;
      const TICKET_PUT_PATH = `${ticketsPath}/${ticketId}`;

      // eslint-disable-next-line jest/expect-expect
      it("should return 204 with the expected body", async () => {
        jest.spyOn(TicketService, "update").mockResolvedValue();
        await request(app).put(TICKET_PUT_PATH)
          .send({ status: TicketStatus.SERVING })
          .expect(StatusCodes.NO_CONTENT)
          .expect("");
      });

      it.each([
        [ 123, "SERVING" ],
        [ 1234567, "WAITING" ],
        [ 123456789, "CLOSED" ],
        [ 123, "serving" ],
        [ 4, "waiting" ],
        [ 9324, "Closed" ],
      ])("should call TicketService#update with the expected params for ticketId (%s) and status (%s)",
        async (ticketIdNo, status) => {
          const expectedTicketAttr = { id: ticketIdNo, status: status.toUpperCase() };

          await request(app).put(`${ticketsPath}/${ticketIdNo}`)
            .send({ status });

          expect(TicketService.update).toHaveBeenCalledTimes(1);
          expect(TicketService.update).toHaveBeenCalledWith(expectedTicketAttr);
        });
    });

    describe("Error scenarios", () => {
      const TicketIdCanOnlyContainNumbers = "Ticket Id must contain only numbers.";
      it.each([
        [ "234ggs24", TicketIdCanOnlyContainNumbers ],
        [ "abcfd", TicketIdCanOnlyContainNumbers ],
      ])("should return 400 when queueId in params has incorrect format (%s)", async (ticketId, errorReason) => {
        const TICKETS_PUT_PATH = `${ticketsPath}/${ticketId}`;
        jest.spyOn(TicketService, "update").mockResolvedValue();
        const response = await request(app).put(TICKETS_PUT_PATH)
          .send({ status: TicketStatus.SERVING })
          .expect(StatusCodes.BAD_REQUEST);

        expect(response.body).toMatchObject({
          error: {
            id: expect.anything(),
            invalidParams: [ { name: "ticketId", reason: errorReason } ],
            type: "validation",
          },
        });
      });

      const statusNotAllowed = "Status should contain only either WAITING / SERVING / CLOSED";
      it.each([
        [ "status", statusNotAllowed ],
        [ "OPEN", statusNotAllowed ],
        [ "STARTED", statusNotAllowed ],
      ])("should return 400 when status in ticket params is not supported (%s)",
        async (status, errorReason) => {
          const TICKETS_PUT_PATH = `${ticketsPath}/${123}`;
          jest.spyOn(TicketService, "update").mockResolvedValue();
          const response = await request(app).put(TICKETS_PUT_PATH)
            .send({ status })
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body).toMatchObject({
            error: {
              id: expect.anything(),
              invalidParams: [ { name: "status", reason: errorReason } ],
            },
          });
        });
    });
  });

  describe("GET /:ticketId", () => {
    const ticketId = 1;
    const TICKET_GET_PATH = `${ticketsPath}/${ticketId}`;

    // eslint-disable-next-line jest/expect-expect
    it("should return ticket", async () => {
      const mockTicket = { id: 1 } as Ticket;
      jest.spyOn(TicketService, "get").mockResolvedValue(mockTicket);
      await request(app).get(TICKET_GET_PATH)
        .expect(StatusCodes.OK, mockTicket);
    });

    it("should call TicketService with the expected params", async () => {
      const mockTicket = { id: 1 } as Ticket;
      const spy = jest.spyOn(TicketService, "get").mockResolvedValue(mockTicket);
      await request(app).get(TICKET_GET_PATH)
        .expect(StatusCodes.OK, mockTicket);

      expect(spy).toBeCalledWith(1, { include: [
        { model: Queue, include: [ { model: Doctor } ] },
        { model: Clinic },
        { model: Patient },
      ] });
    });

    describe("Error scenarios", () => {
      // eslint-disable-next-line jest/expect-expect
      it("should return 404 when ticket is not found", async () => {
        jest.spyOn(TicketService, "get").mockRejectedValue(new NotFoundError("test", "test"));
        await request(app).get(TICKET_GET_PATH)
          .expect(StatusCodes.NOT_FOUND);
      });

      // eslint-disable-next-line jest/expect-expect
      it("should return 400 when ticketId is not a number", async () => {
        jest.spyOn(TicketService, "get").mockRejectedValue(new NotFoundError("test", "test"));
        await request(app).get(`${ticketsPath}/asd`)
          .expect(StatusCodes.BAD_REQUEST);
      });
    });
  });

  describe("GET /", () => {
    const GET_ALL_TICKETS_PATH = `${ticketsPath}`;

    it("should call TicketService.findAll with the expected params", async () => {
      const mockTicket = { id: 1 } as Ticket;
      const spy = jest.spyOn(TicketService, "findAll").mockResolvedValue([ mockTicket ]);
      await request(app).get(`${GET_ALL_TICKETS_PATH}?queueId=1&clinicId=2&patientId=1&status=SERVING`);
      expect(spy).toBeCalledWith({
        queueId: 1, clinicId: 2, patientId: 1, status: "SERVING",
      });
    });

    describe("Error scenarios", () => {
      // eslint-disable-next-line jest/expect-expect
      it.each([
        "patientId",
        "queueId",
        "clinicId",
      ])("should return 400 when %s is not a number",
        async (queryParam) => {
          await request(app)
            .get(`${GET_ALL_TICKETS_PATH}?${queryParam}=asdf`)
            .expect(StatusCodes.BAD_REQUEST);
        });

      it("should return 400 when status is not in the list of supported status", async () => {
        await request(app)
          .get(`${GET_ALL_TICKETS_PATH}?status=asdf`)
          .expect(StatusCodes.BAD_REQUEST);
      });
    });
  });
});
