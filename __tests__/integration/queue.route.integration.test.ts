import { Errors } from "../../src/errors/error-mappings";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../../src/app";
import QueueStatus from "../../src/queue_status";
import { createClinic, destroyClinicById } from "../helpers/clinic-helper";
import { createQueue,
  destroyQueueById, destroyQueuesByIds, getQueueById,
  getQueueIdsByClinicId } from "../helpers/queue-helpers";
import Queue from "../../src/models/queue";

describe("#Queues Component", () => {
  const QUEUES_PATH = "/api/v1/queues";

  describe("#POST /queues", () => {
    let clinicId: number;

    beforeAll(async () => {
      const clinicCreated = await createClinic();
      clinicId = clinicCreated.id;
    });
    afterAll(async () => {
      const queueIdsToDelete = await getQueueIdsByClinicId(clinicId);
      await destroyQueuesByIds(queueIdsToDelete);
      await destroyClinicById(clinicId);
    });
    it("should create queue successfully given clinic exists", async () => {
      const response = await request(app)
        .post(QUEUES_PATH)
        .send({ clinicId })
        .expect(StatusCodes.CREATED);

      expect(response.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        clinicId,
        status: QueueStatus.INACTIVE,
        startedAt: null,
        closedAt: null,
      }));
    });

    it("should throw error if existing clinic id does not exist", async () => {
      const clinicIdThatDoesNotExist = 777889;
      const response = await request(app)
        .post(QUEUES_PATH)
        .send({ clinicId: clinicIdThatDoesNotExist })
        .expect(StatusCodes.NOT_FOUND);

      expect(response.body).toMatchObject({
        error: {
          message: expect.anything(),
          code: Errors.ENTITY_NOT_FOUND.code,
        },
      });
    });
  });

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
        .put(`${QUEUES_PATH}/${queueId}`)
        .send({ status: QueueStatus.ACTIVE })
        .expect(StatusCodes.NO_CONTENT);

      const updatedQueue = await getQueueById(queueId);

      expect(updatedQueue?.status).toEqual(QueueStatus.ACTIVE);
    });

    it("should throw error if existing queue does not exist", async () => {
      const queueIdThatDoesNotExist = 98942809;
      const response = await request(app)
        .put(`${QUEUES_PATH}/${queueIdThatDoesNotExist}`)
        .send({ status: QueueStatus.ACTIVE })
        .expect(StatusCodes.NOT_FOUND);

      expect(response.body).toMatchObject({
        error: {
          message: Errors.QUEUE_NOT_FOUND.message,
          code: Errors.QUEUE_NOT_FOUND.code,
        },
      });
    });
  });

  describe("#GET /queues", () => {
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

    it("should get all queues successfully", async () => {
      const response = await request(app)
        .get(`${QUEUES_PATH}`)
        .expect(StatusCodes.OK);

      expect(response.body.length)
        .toBeGreaterThanOrEqual(1);
    });

    describe("when requesting with clinicId query params", () => {
      it("should get all queues for clinicId successfully", async () => {
        const response = await request(app)
          .get(`${QUEUES_PATH}?clinicId=${clinicId}`)
          .expect(StatusCodes.OK);

        const queueClinicIds = response.body.map((queue: Queue) => queue.clinicId);
        const uniqClinicIds = [ ...new Set(queueClinicIds) ];
        expect(uniqClinicIds).toEqual([ clinicId ]);
      });
    });
  });
});
