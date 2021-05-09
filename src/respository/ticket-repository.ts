import Ticket, {TicketAttributes} from "../models/ticket";
import {ForeignKeyConstraintError, ValidationErrorItem} from "sequelize";
import RepositoryError from "../errors/repository-error";
import {Errors} from "../errors/error-mappings";
class TicketRepository {

    public static async create(ticketAttr: TicketAttributes): Promise<Ticket> {
        let ticket: Ticket;
        try {
            ticket = await Ticket.create(ticketAttr)
        } catch (error) {
            if (error instanceof ForeignKeyConstraintError) {
                throw new RepositoryError(Errors.UNABLE_TO_CREATE_TICKET_AS_ID_NOT_FOUND.code);
            }
            if (error instanceof ValidationErrorItem){
                throw new RepositoryError(Errors.UNABLE_TO_CREATE_TICKET_AS_DISPLAY_NUM_IS_NULL.code);
            }
            throw error;
        }
        return ticket;
    }

}

export default TicketRepository;