import Queue, { QueueAttributes, QueueAttributesWithId } from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import QueueService from "../../src/services/queue-service";
import BusinessError from "../../src/errors/business-error";
import { Errors } from "../../src/errors/error-mappings";
import QueueRepository from "../../src/respository/queue-repository";
import RepositoryError from "../../src/errors/repository-error";
import NotFoundError from "../../src/errors/not-found-error";
import TechnicalError from "../../src/errors/technical-error";

describe("QueueService", () => {
  beforeEach(jest.clearAllMocks);

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
          await expect(QueueService.create({ ...queueAttr, status: QueueStatus.CLOSED }))
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
          const mockActiveQueue = { id: 1, status: QueueStatus.ACTIVE, clinicId: 1 } as Queue;
          jest.spyOn(QueueRepository, "getByClinicIdAndStatus").mockResolvedValueOnce([ mockActiveQueue ]);
        });
        it("should throw business error UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS", async () => {
          await expect(QueueService.create(queueAttr))
            .rejects
            .toThrow(
              new BusinessError(Errors.UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.code,
                Errors.UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.message),
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
    const queueAttr: QueueAttributesWithId = {
      id: 333,
      clinicId: 1,
      status: QueueStatus.INACTIVE,
    };

    it("should update if there is an existing queue given queue id", async () => {
      jest.spyOn(QueueRepository, "update").mockResolvedValueOnce();
      await QueueService.update(queueAttr);

      expect(QueueRepository.update).toHaveBeenCalledTimes(1);
      expect(QueueRepository.update).toHaveBeenCalledWith(queueAttr);
    });

    it("should update including startedAt as current date if status is ACTIVE", async () => {
      const queueAttrActive: QueueAttributesWithId = {
        id: 333,
        clinicId: 1,
        status: QueueStatus.ACTIVE,
      };

      jest.spyOn(QueueRepository, "update").mockResolvedValueOnce();
      await QueueService.update(queueAttrActive);

      expect(QueueRepository.update).toHaveBeenCalledTimes(1);
      expect(QueueRepository.update).toHaveBeenCalledWith({ ...queueAttrActive, startedAt: expect.any(Date) });
    });
  });

  it("should update including closedAt as current date if status is CLOSED", async () => {
    const queueAttrActive: QueueAttributesWithId = {
      id: 333,
      clinicId: 1,
      status: QueueStatus.CLOSED,
    };

    jest.spyOn(QueueRepository, "update").mockResolvedValueOnce();
    await QueueService.update(queueAttrActive);

    expect(QueueRepository.update).toHaveBeenCalledTimes(1);
    expect(QueueRepository.update).toHaveBeenCalledWith({ ...queueAttrActive, closedAt: expect.any(Date) });
  });
});

describe("#getQueuesByClinicAndStatus", () => {
  const clinicId = 1;
  const queueStatus = QueueStatus.ACTIVE;

  it("should call QueueRespository#getByClinicIdAndStatus", async () => {
    jest.spyOn(QueueRepository, "getByClinicIdAndStatus").mockResolvedValueOnce([]);
    await QueueService.getQueuesByClinicAndStatus(clinicId, queueStatus);

    expect(QueueRepository.getByClinicIdAndStatus).toHaveBeenCalledTimes(1);
    expect(QueueRepository.getByClinicIdAndStatus).toHaveBeenCalledWith(clinicId, queueStatus);
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
});
