import QueueStatus from "../../src/queue_status";
import Queue from "../../src/models/queue";
import { DatabaseError, ForeignKeyConstraintError } from "sequelize";
import Clinic from "../../src/models/clinic";
import { clinicFactory } from "../factories/clinic";

describe("Queue", () => {
  let clinicId: number;
  let latestGeneratedTicketDisplayNumber: number;
  const toBeDeletedQueueIds: number[] = [];
  let queueAttributes: Partial<Queue>;

  beforeAll(async () => {
    const clinic = await clinicFactory.build();
    clinicId = clinic.id;
    latestGeneratedTicketDisplayNumber = 0;
    queueAttributes = {
      "clinicId": clinicId,
      "createdAt": new Date(Date.now()),
      "updatedAt": new Date(Date.now()),
      "status": QueueStatus.CLOSED,
      "latestGeneratedTicketDisplayNumber": latestGeneratedTicketDisplayNumber,
      "startedAt": new Date(Date.now()),
      "closedAt": new Date(Date.now()),
    };
  });

  afterAll(async () => {
    await Queue.destroy({ where: { id: toBeDeletedQueueIds } });
    await Clinic.destroy({ where: { id: clinicId } });
  });

  describe("valid", () => {
    it("should create when it has all valid attributes", async () => {
      const queue = await Queue.create(queueAttributes);
      expect(queue).toBeDefined();

      toBeDeletedQueueIds.push(queue.id);
    });

    it("should auto increment id", async () => {
      const queue1 = await Queue.create(queueAttributes);
      const queue2 = await Queue.create(queueAttributes);

      expect(queue1.id + 1).toEqual(queue2.id);

      toBeDeletedQueueIds.push(queue1.id, queue2.id);
    });
  });

  describe("invalid queue attributes", () => {
    describe("when status is not supported", () => {
      it("should throw an error", async () => {
        const queueAttributesWithInvalidStatus = { ...queueAttributes, status: "invalid-status" };
        await expect(Queue.create(queueAttributesWithInvalidStatus))
          .rejects.toThrowError(DatabaseError);
      });
    });

    describe("when clinic id is not found", () => {
      it("should throw an error with sequelize foreign key error", async () => {
        const queueAttributesWithClinicNotFound = { ...queueAttributes, clinicId: 888 };
        await expect(Queue.create(queueAttributesWithClinicNotFound))
          .rejects.toThrow(ForeignKeyConstraintError);
      });
    });
  });
});
