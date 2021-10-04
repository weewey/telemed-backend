import Queue, { QueueAttributes, QueueAttributesWithId } from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import QueueService from "../../src/services/queue-service";
import BusinessError from "../../src/errors/business-error";
import { Errors } from "../../src/errors/error-mappings";
import QueueRepository from "../../src/respository/queue-repository";
import RepositoryError from "../../src/errors/repository-error";
import NotFoundError from "../../src/errors/not-found-error";
import TechnicalError from "../../src/errors/technical-error";
import { Logger } from "../../src/logger";
import TicketRepository from "../../src/respository/ticket-repository";
import TicketStatus from "../../src/ticket_status";
import Ticket from "../../src/models/ticket";
import { Transaction } from "sequelize";
import DoctorService from "../../src/services/doctor-service";
import Doctor from "../../src/models/doctor";
import TicketService from "../../src/services/ticket-service";
import TicketTypes from "../../src/ticket_types";
import ZoomService from "../../src/services/zoom-service";
import { ZoomMeeting } from "../../src/clients/zoom-client";

describe("QueueService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Logger, "error").mockImplementation(() => {
    });
  });

  describe("#create", () => {
    const queueAttr: QueueAttributes = {
      clinicId: 1,
      status: QueueStatus.INACTIVE,
    };
    const mockQueue = { id: 1 } as Queue;

    it("should create and return a queue", async () => {
      jest.spyOn(QueueService, "getQueuesByClinicAndStatus").mockResolvedValueOnce([]);
      jest.spyOn(QueueRepository, "create").mockResolvedValue(
        mockQueue,
      );
      const queueResult = await QueueService.create(queueAttr);
      expect(queueResult).toEqual(mockQueue);
    });

    describe("Error scenarios", () => {
      describe("when the status in the create queue request is CLOSED", () => {
        it("should throw 400 business error QUEUE_CREATION_NO_CLOSED_STATUS", async () => {
          await expect(QueueService.create({
            ...queueAttr,
            status: QueueStatus.CLOSED,
          }))
            .rejects
            .toThrow(
              new BusinessError(Errors.QUEUE_CREATION_NO_CLOSED_STATUS.code,
                Errors.QUEUE_CREATION_NO_CLOSED_STATUS.message),
            );
        });
      });

      describe("when there is no associated clinic", () => {
        beforeEach(() => {
          jest.spyOn(QueueRepository, "getByClinicIdAndStatus").mockResolvedValueOnce([]);
          jest.spyOn(QueueRepository, "create")
            .mockRejectedValue(new RepositoryError(Errors.ENTITY_NOT_FOUND.code, "clinic id not found"));
        });

        it("should throw NotFound error CLINIC_NOT_FOUND", async () => {
          await expect(QueueService.create(queueAttr)).rejects.toThrow(new NotFoundError(
            Errors.ENTITY_NOT_FOUND.code, "clinic id not found",
          ));
        });
      });

      describe("when there is already an existing active queue for the clinic", () => {
        beforeEach(() => {
          const mockActiveQueue = {
            id: 1,
            status: QueueStatus.ACTIVE,
            clinicId: 1,
          } as Queue;
          jest.spyOn(QueueRepository, "getByClinicIdAndStatus").mockResolvedValueOnce([ mockActiveQueue ]);
        });
        it("should throw business error UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS", async () => {
          await expect(QueueService.create(queueAttr))
            .rejects
            .toThrow(
              new BusinessError(Errors.UNABLE_TO_CREATE_OR_UPDATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.code,
                Errors.UNABLE_TO_CREATE_OR_UPDATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.message),
            );
        });
      });

      describe("when QueueRepository.create fails, not due to known reasons", () => {
        beforeEach(() => {
          jest.spyOn(QueueRepository, "getByClinicIdAndStatus").mockResolvedValueOnce([]);
          jest.spyOn(QueueRepository, "create").mockRejectedValueOnce(new Error("some DB problem"));
        });
        it("should throw 500 Technical error UNABLE_TO_CREATE_QUEUE", async () => {
          await expect(QueueService.create(queueAttr)).rejects.toThrow(new TechnicalError("some DB problem"));
        });
      });

      describe("when QueueService.getQueuesByClinicAndStatus fails, due to unknown reasons", () => {
        beforeEach(() => {
          jest.spyOn(QueueRepository, "getByClinicIdAndStatus")
            .mockRejectedValueOnce(new Error("some problem getting queue"));
        });

        it("should throw 500 Technical error UNABLE_TO_CREATE_QUEUE", async () => {
          await expect(QueueService.create(queueAttr)).rejects
            .toThrow(new TechnicalError(Errors.UNABLE_TO_CREATE_QUEUE.message,
              Errors.UNABLE_TO_CREATE_QUEUE.code));
        });
      });
    });
  });

  describe("#update", () => {
    it.each([
      [ QueueStatus.ACTIVE, {
        startedAt: expect.any(Date),
        closedAt: null,
      } ],
      [ QueueStatus.CLOSED, { closedAt: expect.any(Date) } ],
      [ QueueStatus.INACTIVE, { closedAt: null } ],
    ])("status is %s: should update successfully, including the correct values for startedAt and closedAt",
      async (status, fields) => {
        const queueAttrActive: QueueAttributesWithId = {
          id: 333,
          clinicId: 1,
          status,
        };
        jest.spyOn(QueueRepository, "getByClinicIdAndStatus").mockResolvedValueOnce([]);

        jest.spyOn(QueueRepository, "update").mockResolvedValueOnce({} as Queue);
        await QueueService.update(queueAttrActive);

        expect(QueueRepository.update).toHaveBeenCalledTimes(1);
        expect(QueueRepository.update).toHaveBeenCalledWith({ ...queueAttrActive, ...fields });
      });

    it("should return the updated Queue", async () => {
      const updateQueueAttributes: QueueAttributesWithId = {
        id: 333,
        clinicId: 1,
        currentTicketId: null,
      };
      const updatedQueue = {} as Queue;
      jest.spyOn(QueueRepository, "update").mockResolvedValueOnce(updatedQueue);
      const response = await QueueService.update(updateQueueAttributes);
      expect(response).toEqual(updatedQueue);
    });
  });

  describe("#getQueuesByClinicAndStatus", () => {
    const clinicId = 1;
    const queueStatus = QueueStatus.ACTIVE;

    it("should call QueueRespository#getByClinicIdAndStatus", async () => {
      const spy = jest.spyOn(QueueRepository, "getByClinicIdAndStatus").mockResolvedValueOnce([]);
      await QueueService.getQueuesByClinicAndStatus(clinicId, queueStatus);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(clinicId, queueStatus);
    });
  });

  describe("getQueueById", () => {
    const queueId = 1;
    const mockQueue = { id: queueId } as Queue;

    it("should call queueRepository.getById", async () => {
      const spy = jest.spyOn(QueueRepository, "getById").mockResolvedValueOnce(mockQueue);
      await QueueService.getQueueById(queueId);
      expect(spy).toHaveBeenCalledWith(queueId);
    });

    describe("when queue is not found", () => {
      beforeEach(() => {
        jest.spyOn(QueueRepository, "getById").mockResolvedValueOnce(null);
      });

      it("should throw NotFoundError", async () => {
        await expect(QueueService.getQueueById(queueId))
          .rejects
          .toThrowError(NotFoundError);
      });
    });
  });

  describe("fetchAllQueues", () => {
    it("should call QueueRepository.findAll", async () => {
      const spy = jest.spyOn(QueueRepository, "findAll").mockResolvedValueOnce([]);
      await QueueService.fetchAllQueues();
      expect(spy).toBeCalledTimes(1);
    });

    it("should return technical error if QueueRepository errors", async () => {
      jest.spyOn(QueueRepository, "findAll").mockRejectedValueOnce(new Error("test"));
      await expect(QueueService.fetchAllQueues()).rejects.toThrowError(TechnicalError);
    });

    it("should return expected error message if QueueRepository errors", async () => {
      jest.spyOn(QueueRepository, "findAll").mockRejectedValueOnce(new Error("test"));
      await expect(QueueService.fetchAllQueues()).rejects.toThrowError("Failed to fetch all queues: test");
    });

    describe("when clinicId is passed in", () => {
      it("should call QueueRepository.findAll with the right params", async () => {
        const spy = jest.spyOn(QueueRepository, "findAll").mockResolvedValueOnce([]);
        const findAllParams = { clinicId: 1 };
        await QueueService.fetchAllQueues(findAllParams);
        expect(spy).toBeCalledWith(findAllParams);
      });
    });
  });

  describe("nextTicket", () => {
    const doctorId = 1;
    const doctorEmail = "doctor@email.com";
    beforeEach(() => {
      jest.spyOn(DoctorService, "get").mockResolvedValue({ id: doctorId, email: doctorEmail } as Doctor);
    });
    describe("when queueId is not found", () => {
      it("should return NotFoundError", async () => {
        const queueId = 1;
        jest.spyOn(QueueRepository, "getById").mockResolvedValue(null);
        await expect(QueueService.nextTicket(doctorId, queueId)).rejects.toThrowError(NotFoundError);
      });
    });
    describe("when queue is found", () => {
      const queueId = 1;

      describe("when queue status is not active", () => {
        const queue = {
          id: queueId,
          currentTicketId: null,
          pendingTicketIdsOrder: [ 2, 3 ],
          clinicId: 1,
          status: QueueStatus.CLOSED,
          update: () => {
          },
        } as unknown as Queue;

        beforeEach(() => {
          jest.spyOn(TicketRepository, "update").mockResolvedValue({} as Ticket);
          jest.spyOn(QueueRepository, "getById").mockResolvedValue(queue);
        });

        it("should return BusinessError", async () => {
          await expect(QueueService.nextTicket(doctorId, queueId)).rejects.toThrowError(BusinessError);
        });

        it("should return BusinessError with the expected code and message", async () => {
          await expect(QueueService.nextTicket(doctorId, queueId)).rejects.toMatchObject(
            { code: Errors.QUEUE_IS_NOT_ACTIVE.code, message: Errors.QUEUE_IS_NOT_ACTIVE.message },
          );
        });
      });
      describe("when currentTicketId on the Queue is not null", () => {
        const queue = {
          id: queueId,
          currentTicketId: 1,
          pendingTicketIdsOrder: [ 2, 3 ],
          clinicId: 1,
          status: QueueStatus.ACTIVE,
          update: () => {
          },
        } as unknown as Queue;
        beforeEach(() => {
          jest.spyOn(TicketRepository, "update").mockResolvedValue({} as Ticket);
          jest.spyOn(QueueRepository, "getById").mockResolvedValue(queue);
        });
        it("should return BusinessError", async () => {
          await expect(QueueService.nextTicket(doctorId, queueId)).rejects.toThrowError(BusinessError);
        });

        it("should return BusinessError with the expected code and message", async () => {
          await expect(QueueService.nextTicket(doctorId, queueId)).rejects.toMatchObject({
            code: Errors.UNABLE_TO_SET_NEXT_TICKET_AS_QUEUE_CURRENTLY_HAS_A_CURRENT_TICKET.code,
            message: Errors.UNABLE_TO_SET_NEXT_TICKET_AS_QUEUE_CURRENTLY_HAS_A_CURRENT_TICKET.message,
          });
        });
      });

      describe("when currentTicketId on the Queue is null", () => {
        describe("and the pendingTicketIdsOrder is not empty", () => {
          const queue = {
            id: queueId,
            currentTicketId: null,
            pendingTicketIdsOrder: [ 1, 2 ],
            clinicId: 1,
            status: QueueStatus.ACTIVE,
            update: () => {
            },
            reload: () => {
            },
          } as unknown as Queue;
          beforeEach(() => {
            jest.spyOn(TicketRepository, "update").mockResolvedValue({} as Ticket);
            jest.spyOn(QueueRepository, "getById").mockResolvedValue(queue);
            jest.spyOn(queue, "update").mockResolvedValue(queue);
          });
          describe("when the next ticket is a physical ticket", () => {
            beforeEach(() => {
              jest.spyOn(TicketService, "get").mockResolvedValue({ id: 1, type: TicketTypes.PHYSICAL } as Ticket);
            });

            it("should call QueueRepository with the expected updated queue attrs", async () => {
              const spy = jest.spyOn(queue, "update");
              await QueueService.nextTicket(doctorId, queueId);
              expect(spy).toBeCalledWith({
                currentTicketId: 1,
                pendingTicketIdsOrder: [ 2 ],
              },
              { transaction: expect.any(Transaction) });
            });

            it("should call TicketRepository.update with the expected params", async () => {
              const spy = jest.spyOn(TicketRepository, "update").mockResolvedValue({} as Ticket);

              await QueueService.nextTicket(doctorId, queueId);

              expect(spy).toBeCalledWith({
                id: 1,
                status: TicketStatus.SERVING,
              },
              expect.any(Transaction));
            });
          });

          describe("when the next ticket is a telemed ticket", () => {
            beforeEach(() => {
              jest.spyOn(TicketService, "get").mockResolvedValue({ id: 1, type: TicketTypes.TELEMED } as Ticket);
            });

            it("should call ZoomService.createMeeting", async () => {
              const spy = jest.spyOn(ZoomService, "createMeeting").mockResolvedValue({} as ZoomMeeting);
              await QueueService.nextTicket(doctorId, queueId);
              expect(spy).toBeCalledWith(doctorEmail);
            });

            it("should call TicketRepository.update with the expected params", async () => {
              jest.spyOn(ZoomService, "createMeeting").mockResolvedValue({ id: "1",
                uuid: "123",
                join_url: "join_url",
                start_url: "start_url" } as ZoomMeeting);
              const spy = jest.spyOn(TicketRepository, "update").mockResolvedValue({} as Ticket);
              await QueueService.nextTicket(doctorId, queueId);
              expect(spy).toBeCalledWith({
                id: 1,
                status: TicketStatus.SERVING,
                zoomJoinMeetingUrl: "join_url",
                zoomMeetingId: "1",
                zoomStartMeetingUrl: "start_url",
              },
              expect.any(Transaction));
            });
          });

          describe("and TicketRepository.update returns an error", () => {
            beforeEach(() => {
              jest.spyOn(TicketRepository, "update").mockRejectedValue(new Error("error"));
            });
          });
        });

        describe("and the pendingTicketIdsOrder is empty", () => {
          const queue = {
            id: queueId,
            currentTicketId: null,
            pendingTicketIdsOrder: [],
            clinicId: 1,
            status: QueueStatus.ACTIVE,
            update: () => {
            },
          } as unknown as Queue;
          beforeEach(() => {
            jest.spyOn(TicketRepository, "update").mockResolvedValue({} as Ticket);
            jest.spyOn(QueueRepository, "getById").mockResolvedValue(queue);
            jest.spyOn(queue, "update").mockResolvedValue(queue);
          });
          it("should not call queue.update", async () => {
            const spy = jest.spyOn(queue, "update");
            await QueueService.nextTicket(doctorId, queueId);
            expect(spy).not.toBeCalled();
          });
        });
      });
    });
  });
});
