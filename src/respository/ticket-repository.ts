import Ticket, {TicketAttributes} from "../models/ticket";
import { ForeignKeyConstraintError, ValidationError } from "sequelize";
import RepositoryError from "../errors/repository-error";
import {Errors} from "../errors/error-mappings";
import { mapSequelizeErrorsToErrorFieldsAndMessage } from "../utils/helpers";
import { Logger } from "../logger";

class TicketRepository {

    public static async create(ticketAttr: TicketAttributes): Promise<Ticket> {
        let ticket: Ticket;
        try {
            ticket = await Ticket.create(ticketAttr)
        } catch (error) {
            if (error instanceof ForeignKeyConstraintError) {
                const message = `Unable to create ticket ${error.fields} ${error.message}}`;
                Logger.error(message)

                throw new RepositoryError(Errors.ENTITY_NOT_FOUND.code, message);
            }
            if (error instanceof ValidationError){
                const { errorFields, errorMessage } = mapSequelizeErrorsToErrorFieldsAndMessage(error.errors)
                const message = `Unable to create ticket. Fields: [ ${errorFields}], message: [ ${errorMessage}]`;
                Logger.error(message)
                throw new RepositoryError(Errors.VALIDATION_ERROR.code, message);
            }
            throw error;
        }
        return ticket;
    }

}

export default TicketRepository;