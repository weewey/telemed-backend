import TicketService, { CreateTicketRequest } from "../../src/services/ticket-service";
import QueueService from "../../src/services/queue-service";
import Queue from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import BusinessError from "../../src/errors/business-error";
import NotFoundError from "../../src/errors/not-found-error";
import { Errors } from "../../src/errors/error-mappings";
import { queueFactory } from "../factories";
import TicketRepository from "../../src/respository/ticket-repository";
import TicketStatus from "../../src/ticket_status";
import Ticket, { TicketAttributesWithId } from "../../src/models/ticket";
import TechnicalError from "../../src/errors/technical-error";

describe("TicketService", () => {
  beforeEach(jest.clearAllMocks);

  describe("#create", () => {
    const createTicketReq: CreateTicketRequest = {
      patientId: 1,
      queueId: 1,
      clinicId: 1,
    };
    const mockActiveQueue = queueFactory.instantiate({ id: createTicketReq.queueId,
      clinicId: createTicketReq.clinicId,
      status: QueueStatus.ACTIVE });
    const mockTicket = { id: 1, displayNumber: 1 } as Ticket;

    describe("success scenarios", () => {
      let createTicketSpy: jest.SpyInstance;
      const expectedTicketAttr = {
        displayNumber: mockActiveQueue.latestGeneratedTicketDisplayNumber + 1,
        status: TicketStatus.WAITING,
        patientId: createTicketReq.patientId,
        clinicId: createTicketReq.clinicId,
        queueId: createTicketReq.queueId,
      };

      beforeAll(() => {
        createTicketSpy = jest.spyOn(TicketRepository, "create").mockResolvedValue(mockTicket);
        jest.spyOn(QueueService, "getQueueById").mockResolvedValue(mockActiveQueue);
        jest.spyOn(mockActiveQueue, "update").mockResolvedValue(mockActiveQueue);
        jest.spyOn(TicketRepository, "findPatientActiveTickets").mockResolvedValue([]);
      });

      it("should call TicketRepository.create with the expected attributes", async () => {
        await TicketService.create(createTicketReq);
        expect(createTicketSpy).toBeCalledWith(expectedTicketAttr, expect.anything());
      });

      it("should return the created ticket", async () => {
        const ticket = await TicketService.create(createTicketReq);
        expect(ticket).toEqual(mockTicket);
      });

      it("should update Queue with the latest queue ticket info", async () => {
        const queueUpdateSpy = jest.spyOn(mockActiveQueue, "update").mockResolvedValue(mockActiveQueue);
        await TicketService.create(createTicketReq);
        expect(queueUpdateSpy).toBeCalledWith({
          latestGeneratedTicketDisplayNumber: expectedTicketAttr.displayNumber,
          waitingTicketsCount: mockActiveQueue.waitingTicketsCount + 1,
          waitingTicketsId: mockActiveQueue.waitingTicketsId.concat(mockTicket.id),
        }, { transaction: expect.anything() });
      });
    });

    describe("error scenarios", () => {
      describe("when queue is not active", () => {
        it("should throw BusinessError", async () => {
          const mockQueue = { id: 1, status: QueueStatus.INACTIVE } as Queue;
          jest.spyOn(QueueService, "getQueueById").mockResolvedValue(mockQueue);
          await expect(TicketService.create(createTicketReq))
            .rejects
            .toThrowError(BusinessError);
        });

        it("should throw Error with the expect message and code", async () => {
          const mockQueue = { id: 1, status: QueueStatus.INACTIVE } as Queue;
          jest.spyOn(QueueService, "getQueueById").mockResolvedValue(mockQueue);
          await expect(TicketService.create(createTicketReq))
            .rejects
            .toMatchObject({
              code: Errors.UNABLE_TO_CREATE_QUEUE_AS_QUEUE_IS_INACTIVE.code,
              message: Errors.UNABLE_TO_CREATE_QUEUE_AS_QUEUE_IS_INACTIVE.message,
            });
        });
      });

      describe("when queueService returns error", () => {
        it("should bubble the error up", async () => {
          jest.spyOn(QueueService, "getQueueById")
            .mockRejectedValue(new NotFoundError("test", "test"));
          await expect(TicketService.create(createTicketReq))
            .rejects
            .toThrowError(NotFoundError);
        });
      });

      describe("when updating queue failed", () => {
        beforeEach(() => {
          jest.spyOn(TicketRepository, "create").mockResolvedValue(mockTicket);
          jest.spyOn(QueueService, "getQueueById").mockResolvedValue(mockActiveQueue);
          jest.spyOn(TicketRepository, "findPatientActiveTickets").mockResolvedValueOnce([]);
        });
        it("should bubble the error up", async () => {
          jest.spyOn(mockActiveQueue, "update")
            .mockRejectedValue(new TechnicalError("failed"));
          await expect(TicketService.create(createTicketReq))
            .rejects
            .toThrowError(TechnicalError);
        });
      });

      describe("when patient already has an ACTIVE ticket", () => {
        beforeEach(() => {
          const mockQueue = { id: 1, status: QueueStatus.ACTIVE } as Queue;
          const mockActiveTicket = { status: TicketStatus.SERVING } as Ticket;
          jest.spyOn(QueueService, "getQueueById").mockResolvedValueOnce(mockQueue);
          jest.spyOn(TicketRepository, "findPatientActiveTickets").mockResolvedValueOnce([ mockActiveTicket ]);
        });

        it("should return a business error", async () => {
          await expect(TicketService.create(createTicketReq))
            .rejects
            .toThrowError(BusinessError);
        });

        it("should return the expected errorCode and errorMessage", async () => {
          await expect(TicketService.create(createTicketReq))
            .rejects
            .toMatchObject({
              code: Errors.UNABLE_TO_CREATE_TICKET_AS_PATIENT_ALREADY_HAS_AN_ACTIVE_TICKET.code,
              message: Errors.UNABLE_TO_CREATE_TICKET_AS_PATIENT_ALREADY_HAS_AN_ACTIVE_TICKET.message,
            });
        });
      });

      describe("when TicketRepository.findPatientActiveTickets errors", () => {
        beforeEach(() => {
          const mockQueue = { id: 1, status: QueueStatus.ACTIVE } as Queue;
          jest.spyOn(QueueService, "getQueueById").mockResolvedValueOnce(mockQueue);
          jest.spyOn(TicketRepository, "findPatientActiveTickets").mockRejectedValueOnce(new Error("random error"));
        });

        it("should return a Technical Error", async () => {
          await expect(TicketService.create(createTicketReq))
            .rejects
            .toThrowError(TechnicalError);
        });
      });
    });
  });

  describe("#update", () => {
    it.each([
      [ TicketStatus.WAITING, { updatedAt: expect.any(Date) } ],
      [ TicketStatus.CLOSED, { updatedAt: expect.any(Date) } ],
      [ TicketStatus.SERVING, { updatedAt: expect.any(Date) } ],
    ])("status is %s: should update successfully, including the correct values for updatedAt",
      async (status, fields) => {
        const ticketAttrActive: Partial<TicketAttributesWithId> = {
          id: 333,
          status,
        };

        jest.spyOn(TicketRepository, "update").mockResolvedValueOnce();
        await TicketService.update(ticketAttrActive);

        expect(TicketRepository.update).toHaveBeenCalledTimes(1);
        expect(TicketRepository.update).toHaveBeenCalledWith({ ...ticketAttrActive, ...fields });
      });
  });
});
