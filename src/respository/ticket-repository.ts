import Ticket, { TicketAttributes, TicketAttributesWithId } from "../models/ticket";
import { ForeignKeyConstraintError, Op, Transaction, ValidationError } from "sequelize";
import RepositoryError from "../errors/repository-error";
import { Errors } from "../errors/error-mappings";
import { mapSequelizeErrorToErrorMessage } from "../utils/helpers";
import { Logger } from "../logger";
import TicketStatus from "../ticket_status";
import NotFoundError from "../errors/not-found-error";
import Queue from "../models/queue";

export interface FindAllTicketAttributes {
  patientId?: number,
  clinicId?: number,
  status?: TicketStatus,
  queueId?: number
}

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
        const message = mapSequelizeErrorToErrorMessage("Unable to create ticket.", error.errors);
        Logger.error(message);
        throw new RepositoryError(Errors.VALIDATION_ERROR.code, message);
      }
      throw error;
    }
    return ticket;
  }

  public static async findAll(findAllTicketAttributes: FindAllTicketAttributes):Promise<Ticket[]> {
    return Ticket.findAll({ where: { ...findAllTicketAttributes }, include: Queue });
  }

  public static async findByPatientIdAndStatus(patientId: number,
    status: TicketStatus): Promise<Ticket[]> {
    return Ticket.findAll({ where: { patientId, status } });
  }

  public static async findPatientActiveTickets(patientId: number): Promise<Ticket[]> {
    return Ticket.findAll({ where: {
      patientId,
      [Op.not]: { status: TicketStatus.CLOSED },
    } });
  }

  public static async update(ticketModelAttributes: Partial<TicketAttributesWithId>,
    transaction?: Transaction): Promise<Ticket> {
    const { id, ...updateAttributes } = ticketModelAttributes;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      throw new NotFoundError(Errors.ENTITY_NOT_FOUND.code, Errors.ENTITY_NOT_FOUND.message);
    }
    if (transaction) {
      return ticket.update(updateAttributes, { transaction });
    }
    return ticket.update(updateAttributes);
  }

  public static async get(ticketId: number): Promise<Ticket|null> {
    return Ticket.findByPk(ticketId, { include: Queue });
  }
}

export default TicketRepository;
