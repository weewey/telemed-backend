import Ticket, {TicketAttributes} from "../models/ticket";
import TicketRepository from "../respository/ticket-repository";
import {Errors} from "../errors/error-mappings";
import BusinessError from "../errors/business-error";
import TechnicalError from "../errors/technical-error";

class TicketService {
    public static async create(ticketAttributes: TicketAttributes): Promise<Ticket> {
        try {
            return await TicketRepository.create(ticketAttributes)
        } catch (e) {
            if (e.message === Errors.UNABLE_TO_CREATE_TICKET_AS_ID_NOT_FOUND.code) {
                throw new BusinessError(Errors.UNABLE_TO_CREATE_TICKET_AS_ID_NOT_FOUND.code,
                    Errors.UNABLE_TO_CREATE_TICKET_AS_ID_NOT_FOUND.message)
            }
            if (e.message === Errors.UNABLE_TO_CREATE_TICKET_AS_DISPLAY_NUM_IS_NULL.code) {
                throw new BusinessError(Errors.UNABLE_TO_CREATE_TICKET_AS_DISPLAY_NUM_IS_NULL.code,
                    Errors.UNABLE_TO_CREATE_TICKET_AS_DISPLAY_NUM_IS_NULL.message)
            }
            throw new TechnicalError(Errors.UNABLE_TO_CREATE_TICKET.message,
                Errors.UNABLE_TO_CREATE_TICKET.code)
        }
    }
}

export default TicketService;