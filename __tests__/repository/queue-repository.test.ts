import Queue, { QueueAttributes } from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import { ForeignKeyConstraintError } from "sequelize";
import RepositoryError from "../../src/errors/repository-error";
import { Errors } from "../../src/errors/error-mappings";
import QueueRepository from "../../src/respository/queue-repository";
import Ticket from "../../src/models/ticket";
import Clinic from "../../src/models/clinic";
import Patient from "../../src/models/patient";
import Doctor from "../../src/models/doctor";
import objectContaining = jasmine.objectContaining;

describe("QueueRepository", () => {
  const queueAttr: QueueAttributes = {
    clinicId: 1,
    status: QueueStatus.INACTIVE,
  } as QueueAttributes;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("#create", () => {
    it("should call Queue#create", async () => {
      jest.spyOn(Queue, "create").mockResolvedValue();
      await QueueRepository.create(queueAttr);

      expect(Queue.create).toHaveBeenCalledTimes(1);
      expect(Queue.create).toBeCalledWith(queueAttr, undefined);
    });

    describe("Error scenarios", () => {
      it("should return CLINIC_NOT_FOUND error when there is no associated foreign key Clinic Id", async () => {
        jest.spyOn(Queue, "create").mockRejectedValue(new ForeignKeyConstraintError({}));

        await expect(QueueRepository.create(queueAttr)).rejects.toThrow(RepositoryError);

        await expect(QueueRepository.create(queueAttr)).rejects
          .toMatchObject(objectContaining({
            code: Errors.ENTITY_NOT_FOUND.code,
          }));
      });
    });
  });

  describe("#findAll", () => {
    const spy = jest.spyOn(Queue, "findAll").mockResolvedValue([]);

    it("should call Queue.findAll", async () => {
      await QueueRepository.findAll();
      expect(spy).toBeCalledTimes(1);
    });

    describe("when clinicId is passed in", () => {
      it("should call findAll with the right params", async () => {
        await QueueRepository.findAll({ clinicId: 1 });
        expect(spy).toBeCalledWith({ where: { clinicId: 1 } });
      });
    });

    describe("when clinicId and status is passed in", () => {
      it("should call findAll with the right params", async () => {
        const status = QueueStatus.ACTIVE;

        await QueueRepository.findAll({ clinicId: 1, status });
        expect(spy).toBeCalledWith({ where: { clinicId: 1, status } });
      });
    });
  });

  describe("#update", () => {
    const queueModelAttributes = {
      id: 1111,
      clinicId: 1112,
      status: QueueStatus.ACTIVE,
    };

    it("should return the updatedQueue", async () => {
      const queue = new Queue();
      const reloadedQueue = { status: QueueStatus.ACTIVE, currentTicket: {} } as Queue;
      const updatedQueue = { status: QueueStatus.ACTIVE,
        reload: ():Queue => {
          return reloadedQueue;
        } } as unknown as Queue;
      jest.spyOn(Queue, "findByPk").mockResolvedValue(queue);
      jest.spyOn(queue, "update").mockResolvedValue(updatedQueue);
      const response = await QueueRepository.update(queueModelAttributes);

      expect(response).toEqual(reloadedQueue);
    });
  });

  describe("#getByClinicIdAndStatus", () => {
    const mockQueue = { id: 1, status: QueueStatus.ACTIVE, clinicId: 1 } as Queue;

    describe("when status is passed in", () => {
      it("should call Queue#findAll with the right params", async () => {
        jest.spyOn(Queue, "findAll").mockResolvedValue([ mockQueue ]);

        await QueueRepository.getByClinicIdAndStatus(mockQueue.clinicId, mockQueue.status);

        expect(Queue.findAll).toHaveBeenCalledTimes(1);
        expect(Queue.findAll).toBeCalledWith({
          where: {
            clinicId: mockQueue.clinicId,
            status: mockQueue.status,
          },
        });
      });
    });
  });

  describe("#getById", () => {
    const queueId = 1;
    const mockQueue = { id: queueId, status: QueueStatus.ACTIVE, clinicId: 1 } as Queue;

    it("should call Queue#findByPk with the right params", async () => {
      const spy = jest.spyOn(Queue, "findByPk").mockResolvedValue(mockQueue);

      await QueueRepository.getById(queueId);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toBeCalledWith(queueId, { "include": [ { model: Ticket,
        as: "currentTicket",
        include: [ Patient ] },
      { model: Clinic }, { model: Doctor } ] });
    });
  });
});
