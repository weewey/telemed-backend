import request from "supertest";
import app from "../../src/app";
import QueueService from "../../src/services/queue-service";
import Queue from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import BusinessError from "../../src/errors/business-error";
import { Errors } from "../../src/errors/error-mappings";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../../src/errors/not-found-error";
import { Logger } from "../../src/logger";

describe("Queues Route", () => {
  const queuesPath = "/api/v1/queues";
  const clinicId = 1;
  const queue = { id: 1, clinicId, status: QueueStatus.INACTIVE } as Queue;

  beforeAll(() => {
    jest.spyOn(Logger, "error").mockImplementation(() => {});
  });

  beforeEach(jest.clearAllMocks);

  describe("POST /queues", () => {
    describe("Successful scenarios", () => {
      it("should return 201 with the expected body", async () => {
        jest.spyOn(QueueService, "create").mockResolvedValue(queue);
        await request(app).post(queuesPath)
          .send({ clinicId })
          .expect(StatusCodes.CREATED)
          .expect(queue);
      });

      it("calls QueueService#create with the expected params", async () => {
        jest.spyOn(QueueService, "create").mockResolvedValue(queue);
        const expectedQueueAttr = { clinicId, status: QueueStatus.INACTIVE };

        await request(app).post(queuesPath)
          .send({ clinicId });

        expect(QueueService.create).toHaveBeenCalledTimes(1);
        expect(QueueService.create).toHaveBeenCalledWith(expectedQueueAttr);
      });

      describe("when the clinicId is numeric string", () => {
        it("should call QueueService with the clinicId in numeric", async () => {
          jest.spyOn(QueueService, "create").mockResolvedValue(queue);
          await request(app).post(queuesPath)
            .send({ clinicId: "1" });
          const expectedQueueAttr = { clinicId, status: QueueStatus.INACTIVE };
          expect(QueueService.create).toHaveBeenCalledTimes(1);
          expect(QueueService.create).toHaveBeenCalledWith(expectedQueueAttr);
        });
      });
    });

    describe("Error scenarios", () => {
      describe("when the clinicId is not a valid number", () => {
        it("should return BAD_REQUEST with the expected body", async () => {
          const response = await request(app).post(queuesPath)
            .send({ clinicId: "asd" })
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body).toEqual({ error: {
            id: expect.anything(),
            invalidParams: [ { name: "clinicId", reason: "clinicId must be numeric" } ],
            type: "validation",
          } });
        });
      });

      describe("when the clinicId is not found in the DB", () => {
        it("should return NOT_FOUND with the expected body", async () => {
          jest.spyOn(QueueService, "create")
            .mockRejectedValue(new NotFoundError(Errors.CLINIC_NOT_FOUND.code, Errors.CLINIC_NOT_FOUND.message));

          const response = await request(app).post(queuesPath)
            .send({ clinicId: 2 })
            .expect(StatusCodes.NOT_FOUND);

          expect(response.body).toEqual({
            error: {
              message: "Clinic not found.",
              id: expect.anything(),
              code: "QDOC-002",
              type: "notFound",
            },
          });
        });
      });

      describe("when the queue is not created due to DB error", () => {
        it("should return BAD_REQUEST with the expected body", async () => {
          jest.spyOn(QueueService, "create")
            .mockRejectedValue(new BusinessError(Errors.UNABLE_TO_CREATE_QUEUE.code,
              Errors.UNABLE_TO_CREATE_QUEUE.message));
          const response = await request(app).post(queuesPath)
            .send({ clinicId: 2 })
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body).toEqual({
            error: {
              message: "Unable to create queue.",
              id: expect.anything(),
              code: "QDOC-003",
              type: "business",
            },
          });
        });
      });
    });
  });

  describe("PUT /queues", () => {
    describe("Successful scenarios", () => {
      const queueId = 4560956;
      const QUEUES_PUT_PATH = `${queuesPath}/${queueId}`;

      // eslint-disable-next-line jest/expect-expect
      it("should return 204 with the expected body", async () => {
        jest.spyOn(QueueService, "update").mockResolvedValue();
        await request(app).put(QUEUES_PUT_PATH)
          .send({ status: QueueStatus.ACTIVE, clinicId: "1" })
          .expect(StatusCodes.NO_CONTENT)
          .expect("");
      });

      it.each([
        [ 123, "ACTIVE" ],
        [ 1234567, "INACTIVE" ],
        [ 123456789, "CLOSED" ],
        [ 123, "active" ],
        [ 4, "InActive" ],
        [ 9324, "Closed" ],
      ])("should call QueueService#update with the expected params for queueId (%s) and status (%s)",
        async (queueIdNo, status) => {
          jest.spyOn(QueueService, "update").mockResolvedValue();
          const expectedQueueAttr = { id: queueIdNo, status: status.toUpperCase(), clinicId: 1 };

          await request(app).put(`${queuesPath}/${queueIdNo}`)
            .send({ status, clinicId: 1 });

          expect(QueueService.update).toHaveBeenCalledTimes(1);
          expect(QueueService.update).toHaveBeenCalledWith(expectedQueueAttr);
        });
    });

    describe("Error scenarios", () => {
      const queueIdCanOnlyContainNumbers = "Queue Id must contain only numbers.";
      it.each([
        [ "234ggs24", queueIdCanOnlyContainNumbers ],
        [ "abcfd", queueIdCanOnlyContainNumbers ],
      ])("should return 400 when queueId in params has incorrect format (%s)", async (queueId, errorReason) => {
        const QUEUES_PUT_PATH = `${queuesPath}/${queueId}`;
        jest.spyOn(QueueService, "update").mockResolvedValue();
        const response = await request(app).put(QUEUES_PUT_PATH)
          .send({ status: QueueStatus.ACTIVE, clinicId: 1 })
          .expect(StatusCodes.BAD_REQUEST);

        expect(response.body).toMatchObject({
          error: {
            id: expect.anything(),
            invalidParams: [ { name: "queueId", reason: errorReason } ],
            type: "validation",
          },
        });
      });

      const statusNotAllowed = "Status should contain only either ACTIVE / CLOSED / INACTIVE";
      it.each([
        [ "status", statusNotAllowed ],
        [ "OPEN", statusNotAllowed ],
        [ "STARTED", statusNotAllowed ],
      ])("should return 400 when status in queue params is not supported (%s)",
        async (status, errorReason) => {
          const QUEUES_PUT_PATH = `${queuesPath}/${144}`;
          jest.spyOn(QueueService, "update").mockResolvedValue();
          const response = await request(app).put(QUEUES_PUT_PATH)
            .send({ status, clinicId: 1 })
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body).toMatchObject({
            error: {
              id: expect.anything(),
              invalidParams: [ { name: "status", reason: errorReason } ],
            },
          });
        });
    });

    it("should return 400 if clinicId does not exist", async () => {
      const QUEUES_PUT_PATH = `${queuesPath}/1`;
      const response = await request(app).put(QUEUES_PUT_PATH)
        .send({ status: QueueStatus.ACTIVE })
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body).toMatchObject({
        error: {
          id: expect.anything(),
          invalidParams: [ { name: "clinicId", reason: "Clinic Id is required" } ],
          type: "validation",
        },
      });
    });

    it("should return 400 if clinicId is not a number", async () => {
      const QUEUES_PUT_PATH = `${queuesPath}/1`;
      const response = await request(app).put(QUEUES_PUT_PATH)
        .send({ status: QueueStatus.ACTIVE, clinicId: "a" })
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body).toMatchObject({
        error: {
          id: expect.anything(),
          invalidParams: [ { name: "clinicId", reason: "clinicId must contain only numbers." } ],
          type: "validation",
        },
      });
    });
  });

  describe("GET /queues", () => {
    describe("success scenarios", () => {
      it("should call QueueService.fetchAll", async () => {
        const spy = jest.spyOn(QueueService, "fetchAllQueues").mockResolvedValue([]);
        await request(app)
          .get(queuesPath)
          .expect(StatusCodes.OK);
        expect(spy).toBeCalledTimes(1);
      });

      // eslint-disable-next-line jest/expect-expect
      it("should return the queues", async () => {
        const mockQueue = { id: 1 } as Queue;
        jest.spyOn(QueueService, "fetchAllQueues").mockResolvedValue([ mockQueue ]);
        await request(app)
          .get(queuesPath)
          .expect(StatusCodes.OK, [ mockQueue ]);
      });

      describe("when the clinicId query param is passed in", () => {
        it("should call fetchAllQueues with the clinicId", async () => {
          const mockQueue = { id: 1 } as Queue;
          const spy = jest.spyOn(QueueService, "fetchAllQueues").mockResolvedValue([ mockQueue ]);
          await request(app)
            .get(`${queuesPath}?clinicId=1`)
            .expect(StatusCodes.OK, [ mockQueue ]);
          expect(spy).toBeCalledWith({ clinicId: 1 });
        });
      });

      describe("when the status query param is passed in", () => {
        it.each([
          [ "ACTIVE" ],
          [ "actiVE" ],
          [ "closed" ],
          [ "INactive" ],
        ])("should call fetchAllQueues with the associated status (%s)", async (status) => {
          const mockQueue = { id: 1 } as Queue;
          const spy = jest.spyOn(QueueService, "fetchAllQueues").mockResolvedValue([ mockQueue ]);
          await request(app)
            .get(`${queuesPath}?status=${status}`)
            .expect(StatusCodes.OK, [ mockQueue ]);
          expect(spy).toBeCalledWith({ status: status.toUpperCase() });
        });
      });
    });

    describe("error scenarios", () => {
      describe("when the clinicId is not numeric", () => {
        it("should return badRequest", async () => {
          const response = await request(app)
            .get(`${queuesPath}?clinicId=asd`).expect(StatusCodes.BAD_REQUEST);

          expect(response.body).toMatchObject({
            error: {
              id: expect.anything(),
              invalidParams: [ { name: "clinicId", reason: "clinicId must be numeric" } ],
              type: "validation",
            },
          });
        });
      });

      describe("when the status is not one of the allowed queue status", () => {
        it.each([
          [ "activeee" ],
          [ "started" ],
          [ "closing" ],
        ])("should return badRequest is status is (%s)", async (status) => {
          const response = await request(app)
            .get(`${queuesPath}?status=${status}`).expect(StatusCodes.BAD_REQUEST);

          expect(response.body).toMatchObject({
            error: {
              id: expect.anything(),
              invalidParams: [ { name: "status",
                reason: "Status should contain only either ACTIVE / CLOSED / INACTIVE" } ],
              type: "validation",
            },
          });
        });
      });
    });
  });

  describe("GET /queues/:queueId", () => {
    describe("Successful scenario", () => {
      const queueId = 1337;
      const QUEUES_GET_PATH = `${queuesPath}/${queueId}`;
      const mockQueue = { id: queueId } as Queue;
      it("should call QueueService.getQueueById", async () => {
        const spy = jest.spyOn(QueueService, "getQueueById").mockResolvedValue(mockQueue);
        await request(app)
          .get(QUEUES_GET_PATH)
          .expect(StatusCodes.OK);
        expect(spy).toBeCalledTimes(1);
        expect(QueueService.getQueueById).toHaveBeenCalledWith(queueId);
      });

      // eslint-disable-next-line jest/expect-expect
      it("should return the queue", async () => {
        jest.spyOn(QueueService, "getQueueById").mockResolvedValue(mockQueue);
        await request(app)
          .get(QUEUES_GET_PATH)
          .expect(StatusCodes.OK, mockQueue);
      });

      // eslint-disable-next-line jest/expect-expect
      it("should return the queue if queue is a numeric string", async () => {
        const queueIdString = "1337";
        jest.spyOn(QueueService, "getQueueById").mockResolvedValue(mockQueue);
        await request(app)
          .get(`${queuesPath}/${queueIdString}`)
          .expect(StatusCodes.OK, mockQueue);
      });
    });
    describe("Error Scenarios", () => {
      const queueIdCanOnlyContainNumbers = "Queue Id must contain only numbers.";
      it.each([
        [ "1234abcd", queueIdCanOnlyContainNumbers ],
        [ "notanumber", queueIdCanOnlyContainNumbers ],
      ])("should return 400 when queueId in params has incorrect format (%s)", async (queueId, errorReason) => {
        const QUEUES_GET_PATH = `${queuesPath}/${queueId}`;
        const response = await request(app).get(QUEUES_GET_PATH)
          .expect(StatusCodes.BAD_REQUEST);

        expect(response.body).toMatchObject({
          error: {
            id: expect.anything(),
            invalidParams: [ { name: "queueId", reason: errorReason } ],
            type: "validation",
          },
        });
      });
    });
  });
});
