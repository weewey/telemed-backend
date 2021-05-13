import Queue, { QueueAttributes } from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import { ForeignKeyConstraintError } from "sequelize";
import RepositoryError from "../../src/errors/repository-error";
import { Errors } from "../../src/errors/error-mappings";
import QueueRepository from "../../src/respository/queue-repository";
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
      expect(Queue.create).toBeCalledWith(queueAttr);
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

  describe("#fetchAll", () => {
    it("should call Queue.findAll", async () => {
      const spy = jest.spyOn(Queue, "findAll").mockResolvedValue([]);
      await QueueRepository.findAll();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe("#update", () => {
    const queueModelAttributes = {
      id: 1111,
      clinicId: 1112,
      status: QueueStatus.ACTIVE,
    };
    const { id, ...updateAttributes } = queueModelAttributes;
    it("should call Queue#update", async () => {
      const queue = new Queue();
      jest.spyOn(Queue, "findByPk").mockResolvedValue(queue);
      jest.spyOn(queue, "update").mockResolvedValue({} as Queue);
      await QueueRepository.update(queueModelAttributes);

      expect(queue.update).toHaveBeenCalledTimes(1);
      expect(queue.update).toHaveBeenCalledWith(updateAttributes);
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

    describe("when no status is passed in", () => {
      it("should get all queues by clinic id", async () => {
        jest.spyOn(Queue, "findAll").mockResolvedValue([ mockQueue ]);

        await QueueRepository.getByClinicIdAndStatus(mockQueue.clinicId);

        expect(Queue.findAll).toHaveBeenCalledTimes(1);
        expect(Queue.findAll).toBeCalledWith(
          {
            where: {
              clinicId: mockQueue.clinicId,
            },
          },
        );
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
      expect(spy).toBeCalledWith(queueId);
    });
  });
});
