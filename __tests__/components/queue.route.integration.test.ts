import { Errors } from "../../src/errors/error-mappings";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../../src/app";
import QueueStatus from "../../src/queue_status";
import { createClinic, destroyClinicById } from "../helpers/clinic-helper";
import { createQueue, destroyQueueById, getQueueById } from "../helpers/queue-helpers";

describe("#Queues Component", () => {
  const QUEUES_PATH = "/api/v1/queues";
  describe("#PUT /queues", () => {
    let queueId: number;
    let clinicId: number;

    beforeAll(async () => {
      const clinicCreated = await createClinic();
      clinicId = clinicCreated.id;

      const queueCreated = await createQueue(clinicId);
      queueId = queueCreated.id;
    });
    afterAll(async () => {
      await destroyQueueById(queueId);
      await destroyClinicById(clinicId);
    });
    it("should update existing queue successfully", async () => {
      await request(app)
        .put(QUEUES_PATH)
        .send({ id: queueId, status: QueueStatus.ACTIVE })
        .expect(StatusCodes.NO_CONTENT);

        const updatedQueue = await getQueueById(queueId);

      expect(updatedQueue?.status).toEqual(QueueStatus.ACTIVE);
    });

    it("should throw error if existing queue does not exist", async () => {
      const queueIdThatDoesNotExist = 989898;
      const response = await request(app)
        .put(QUEUES_PATH)
        .send({ id: queueIdThatDoesNotExist, status: QueueStatus.ACTIVE })
        .expect(StatusCodes.BAD_REQUEST);

        expect(response.body).toMatchObject({
          message: Errors.QUEUE_NOT_FOUND.message,
          type:"business",
          code: Errors.QUEUE_NOT_FOUND.code
        })
    });
  });
});
