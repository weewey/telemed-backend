import Ticket, { TicketAttributes } from "../models/ticket";
import { ForeignKeyConstraintError, Transaction, ValidationError } from "sequelize";
import RepositoryError from "../errors/repository-error";
import { Errors } from "../errors/error-mappings";
import { mapSequelizeErrorsToErrorFieldsAndMessage } from "../utils/helpers";
import { Logger } from "../logger";
import TicketStatus from "../ticket_status";

class TicketRepository {
  public static async create(ticketAttr: TicketAttributes, transaction?: Transaction): Promise<Ticket> {
    let ticket: Ticket;
    try {
      ticket = await Ticket.create(ticketAttr, transaction ? { transaction } : {});
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        const message = `Unable to create ticket ${error.fields} ${error.message}}`;
        Logger.error(message);

        throw new RepositoryError(Errors.ENTITY_NOT_FOUND.code, message);
      }
      if (error instanceof ValidationError) {
        const { errorFields, errorMessage } = mapSequelizeErrorsToErrorFieldsAndMessage(error.errors);
        const message = `Unable to create ticket. Fields: [ ${errorFields}], message: [ ${errorMessage}]`;
        Logger.error(message);
        throw new RepositoryError(Errors.VALIDATION_ERROR.code, message);
      }
      throw error;
    }
    return ticket;
  }

  public static async findByPatientIdAndStatus(patientId: number,
    status: TicketStatus): Promise<Ticket[]> {
    return Ticket.findAll({ where: { patientId, status } });
  }
}

export default TicketRepository;
