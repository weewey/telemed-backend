import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../../src/app";
import { Errors } from "../../src/errors/error-mappings";
import Queue from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import { clinicFactory } from "../factories";
import { destroyClinicById } from "../helpers/clinic-helpers";
import {
  createQueue,
  destroyQueueById,
  destroyQueuesByIds,
  getQueueById,
  // eslint-disable-next-line
  getQueueIdsByClinicId
} from "../helpers/queue-helpers";

describe("#Queues Component", () => {
  const QUEUES_PATH = "/api/v1/queues";

  describe("#POST /queues", () => {
    let clinicId: number;

    beforeAll(async () => {
      const clinicCreated = await clinicFactory.build();
      clinicId = clinicCreated.id;
    });

    afterAll(async () => {
      const queueIdsToDelete = await getQueueIdsByClinicId(clinicId);
      await destroyQueuesByIds(queueIdsToDelete);
      await destroyClinicById([ clinicId ]);
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

    beforeEach(async () => {
      const clinicCreated = await clinicFactory.build();
      clinicId = clinicCreated.id;

      const queueCreated = await createQueue(clinicId);
      queueId = queueCreated.id;
    });
    afterEach(async () => {
      await destroyQueueById(queueId);
      await destroyClinicById([ clinicId ]);
    });
    it("should update existing queue successfully", async () => {
      await request(app)
        .put(`${QUEUES_PATH}/${queueId}`)
        .send({ clinicId, status: QueueStatus.ACTIVE })
        .expect(StatusCodes.NO_CONTENT);

      const updatedQueue = await getQueueById(queueId);

      expect(updatedQueue?.status).toEqual(QueueStatus.ACTIVE);
    });

    it("should throw 404 error if existing queue does not exist", async () => {
      const queueIdThatDoesNotExist = 98942809;
      const response = await request(app)
        .put(`${QUEUES_PATH}/${queueIdThatDoesNotExist}`)
        .send({ clinicId, status: QueueStatus.INACTIVE })
        .expect(StatusCodes.NOT_FOUND);

      expect(response.body).toMatchObject({
        error: {
          message: Errors.QUEUE_NOT_FOUND.message,
          code: Errors.QUEUE_NOT_FOUND.code,
        },
      });
    });

    it("should throw 400 error if existing active queue exists", async () => {
      // setup to update queue with ACTIVE status
      await request(app).put(`${QUEUES_PATH}/${queueId}`)
        .send({ clinicId, status: QueueStatus.ACTIVE });

      const response = await request(app).put(`${QUEUES_PATH}/${queueId}`)
        .send({ clinicId, status: QueueStatus.ACTIVE });

      expect(response.body).toMatchObject(
        { error: { code: Errors.UNABLE_TO_CREATE_OR_UPDATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.code,
          message: Errors.UNABLE_TO_CREATE_OR_UPDATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.message,
          type: "business" } },
      );
    });
  });

  describe("#GET /queues", () => {
    let queueId: number;
    let clinicId: number;
    let queueCreated: Queue;

    beforeAll(async () => {
      const clinicCreated = await clinicFactory.build();
      clinicId = clinicCreated.id;

      queueCreated = await createQueue(clinicId);
      queueId = queueCreated.id;
    });

    afterAll(async () => {
      await destroyQueueById(queueId);
      await destroyClinicById([ clinicId ]);
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

    describe("when requesting with clinicId and status query params", () => {
      it("should get all queues for clinicId and status successfully", async () => {
        const response = await request(app)
          .get(`${QUEUES_PATH}?clinicId=${clinicId}&status=INACTIVE`)
          .expect(StatusCodes.OK);

        // one queue created with INACTIVE status
        expect(response.body.length).toEqual(1);
      });

      it("should return empty array if there is no queue with associated status", async () => {
        const response = await request(app)
          .get(`${QUEUES_PATH}?clinicId=${clinicId}&status=ACTIVE`)
          .expect(StatusCodes.OK);

        expect(response.body).toEqual([]);
      });
    });
  });
});
