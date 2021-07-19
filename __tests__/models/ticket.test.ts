import Ticket, { TicketAttributes } from "../../src/models/ticket";
import Patient from "../../src/models/patient";
import QueueStatus from "../../src/queue_status";
import TicketStatus from "../../src/ticket_status";
import Queue from "../../src/models/queue";
import { v4 as generateUUID } from "uuid";
import { ForeignKeyConstraintError } from "sequelize";
import { clinicFactory } from "../factories/clinic";

describe("Ticket", () => {
  const ticketIdsToBeDeleted: Array<number> = [];
  let clinicId: number;
  let queueId: number;
  let patientId: number;
  const getTicketAttrs = (overrideAttrs?: Partial<TicketAttributes>): TicketAttributes => {
    return {
      patientId,
      status: TicketStatus.WAITING,
      queueId,
      clinicId,
      ...overrideAttrs,
    } as TicketAttributes;
  };

  beforeEach(async () => {
    const clinic = await clinicFactory.build();
    clinicId = clinic.id;
    const queueAttributes = {
      "clinicId": clinicId,
      "createdAt": new Date(Date.now()),
      "updatedAt": new Date(Date.now()),
      "status": QueueStatus.CLOSED,
      "startedAt": new Date(Date.now()),
      "closedAt": new Date(Date.now()),
    };
    const queue = await Queue.create(queueAttributes);
    queueId = queue.id;

    const patientDetails = {
      firstName: "patientModelTest",
      lastName: "patientLastName",
      email: `${generateUUID()}@gmail.com`,
      authId: generateUUID(),
      mobileNumber: generateUUID(),
    };
    const patient = await Patient.create(patientDetails);
    patientId = patient.id;
  });

  afterAll(async () => {
    await Ticket.destroy({ where: { id: ticketIdsToBeDeleted } });
  });

  describe("valid", () => {
    it("should create when it has all valid attributes", async () => {
      const ticket = await Ticket.create(getTicketAttrs({ displayNumber: 1 }));
      expect(ticket).toBeDefined();
      ticketIdsToBeDeleted.push(ticket.id);
    });

    it("should auto increment id", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ticket1 = await Ticket.create(getTicketAttrs({ displayNumber: 99 }));
      const ticket2 = await Ticket.create(getTicketAttrs({ displayNumber: 88 }));

      expect(ticket1.id + 1).toEqual(ticket2.id);

      ticketIdsToBeDeleted.push(ticket1.id, ticket2.id);
    });
  });
  describe("invalid", () => {
    it("should fail when displayNumber is null", async () => {
      await expect(Ticket.create(getTicketAttrs()))
        .rejects.toThrowError("notNull Violation: Ticket.displayNumber cannot be null");
    });

    describe("when patient id is not found", () => {
      it("should throw an error", async () => {
        const ticketAttributesWithPatientNotFound = { ...getTicketAttrs(), patientId: 777, displayNumber: 1 };
        await expect(Ticket.create(ticketAttributesWithPatientNotFound))
          .rejects.toThrow(ForeignKeyConstraintError);
      });
    });

    describe("when clinic id is not found", () => {
      it("should throw an error", async () => {
        const ticketAttributesWithClinicNotFound = { ...getTicketAttrs(), clinicId: 888, displayNumber: 1 };
        await expect(Ticket.create(ticketAttributesWithClinicNotFound))
          .rejects
          .toThrow(ForeignKeyConstraintError);
      });
    });

    describe("when queue id is not found", () => {
      it("should throw an error", async () => {
        const ticketAttributesWithQueueNotFound = { ...getTicketAttrs(), queueId: 999, displayNumber: 1 };
        await expect(Ticket.create(ticketAttributesWithQueueNotFound))
          .rejects.toThrow(ForeignKeyConstraintError);
      });
    });
  });
});
