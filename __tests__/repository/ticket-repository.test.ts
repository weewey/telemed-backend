import Ticket, { TicketAttributes } from "../../src/models/ticket";
import TicketStatus from "../../src/ticket_status";
import { ForeignKeyConstraintError, ValidationError } from "sequelize";
import RepositoryError from "../../src/errors/repository-error";
import { Errors } from "../../src/errors/error-mappings";
import TicketRepository from "../../src/respository/ticket-repository";
import objectContaining = jasmine.objectContaining;

describe("TicketRepository", () => {
  const ticketAttr: TicketAttributes = {
    patientId: 1,
    displayNumber: 1,
    status: TicketStatus.WAITING,
    clinicId: 1,
    queueId: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("#create", () => {
    it("should call Ticket#create", async () => {
      const spy = jest.spyOn(Ticket, "create").mockResolvedValue();
      await TicketRepository.create(ticketAttr);

      expect(spy).toBeCalledWith(ticketAttr, expect.anything());
    });

    describe("Error scenarios", () => {
      it("should return ASSOCIATED_ENTITY_NOT_PRESENT error when there is no associated foreign key", async () => {
        jest.spyOn(Ticket, "create").mockRejectedValue(new ForeignKeyConstraintError({}));

        await expect(TicketRepository.create(ticketAttr)).rejects.toThrow(RepositoryError);
        await expect(TicketRepository.create(ticketAttr)).rejects
          .toMatchObject(objectContaining({
            code: Errors.ENTITY_NOT_FOUND.code,
          }));
      });

      it("should return VALIDATION_ERROR error when displayNumber is null", async () => {
        jest.spyOn(Ticket, "create").mockRejectedValue(new ValidationError("error"));

        await expect(TicketRepository.create(ticketAttr)).rejects.toThrow(RepositoryError);
        await expect(TicketRepository.create(ticketAttr)).rejects
          .toMatchObject(objectContaining({
            code: Errors.VALIDATION_ERROR.code,
          }));
      });
    });
  });

  describe("findByPatientIdAndStatus", () => {
    const patientId = 1;
    it("should call findAll with the right params", async () => {
      const spy = jest.spyOn(Ticket, "findAll").mockResolvedValue([]);
      await TicketRepository.findByPatientIdAndStatus(patientId, TicketStatus.SERVING);
      expect(spy).toBeCalledWith({ where: { patientId, status: TicketStatus.SERVING } });
    });
  });
});
