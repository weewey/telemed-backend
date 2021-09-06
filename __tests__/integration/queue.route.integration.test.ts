import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../../src/app";
import { Errors } from "../../src/errors/error-mappings";
import Queue from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import { destroyClinicById } from "../helpers/clinic-helpers";
import { createQueue, destroyQueueById, destroyQueuesByIds, getQueueIdsByClinicId } from "../helpers/queue-helpers";
import { clinicFactory } from "../factories/clinic";
import { patientFactory } from "../factories/patient";
import { ticketFactory } from "../factories/ticket";
import { queueFactory } from "../factories/queue";
import { destroyTicketsByIds } from "../helpers/ticket-helpers";
import { destroyPatientsByIds } from "../helpers/patient-helpers";
import TicketRepository from "../../src/respository/ticket-repository";
import TicketStatus from "../../src/ticket_status";

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

  describe("#POST /queues/:queueId/next-ticket", () => {
    let clinicId: number;
    let queueId: number;
    let patientId: number;
    let ticketId: number;

    beforeAll(async () => {
      const clinicCreated = await clinicFactory.build();
      clinicId = clinicCreated.id;
      const queueCreated = await queueFactory.build({ clinicId,
        status: QueueStatus.ACTIVE,
        latestGeneratedTicketDisplayNumber: 1 });
      queueId = queueCreated.id;
      const patientCreated = await patientFactory.build();
      patientId = patientCreated.id;
      const ticketCreated = await ticketFactory.build({ displayNumber: 1,
        queueId,
        clinicId,
        patientId });
      ticketId = ticketCreated.id;
      await queueCreated.update({ pendingTicketIdsOrder: [ ticketCreated.id ] });
    });

    afterAll(async () => {
      await destroyQueuesByIds([ queueId ]);
      await destroyClinicById([ clinicId ]);
      await destroyTicketsByIds([ ticketId ]);
      await destroyPatientsByIds([ patientId ]);
    });

    it("should set currentTicketId to the first element from the pendingTicketIdsOrder", async () => {
      const response = await request(app)
        .post(`${QUEUES_PATH}/${queueId}/next-ticket`)
        .expect(StatusCodes.OK);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          currentTicketId: ticketId,
          status: QueueStatus.ACTIVE,
          pendingTicketIdsOrder: [],
        }),
      );

      const ticket = await TicketRepository.get(ticketId);
      expect(ticket!.status).toEqual(TicketStatus.SERVING);
    });
  });

  describe("#PUT /queues", () => {
    let queueId: number;
    let queueCreated: Queue;
    let otherClinicQueueId: number;
    let clinicId: number;

    beforeEach(async () => {
      const clinicCreated = await clinicFactory.build();
      clinicId = clinicCreated.id;

      queueCreated = await createQueue(clinicId);
      queueId = queueCreated.id;

      const otherClinicQueueCreated = await createQueue(clinicId);
      otherClinicQueueId = otherClinicQueueCreated.id;
    });
    afterEach(async () => {
      await destroyQueuesByIds([ queueId, otherClinicQueueId ]);
      await destroyClinicById([ clinicId ]);
    });
    it("should update existing queue successfully", async () => {
      const response = await request(app)
        .put(`${QUEUES_PATH}/${queueId}`)
        .send({ clinicId, status: QueueStatus.ACTIVE })
        .expect(StatusCodes.OK);

      expect(response.body).toEqual(expect.objectContaining({ id: queueId, status: QueueStatus.ACTIVE }));
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

    it("should throw 400 error if existing active queue for clinic exists", async () => {
      // setup to update queue with ACTIVE status
      await request(app).put(`${QUEUES_PATH}/${queueId}`)
        .send({ clinicId, status: QueueStatus.ACTIVE });

      const response = await request(app).put(`${QUEUES_PATH}/${otherClinicQueueId}`)
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
