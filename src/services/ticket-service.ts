import Ticket, { TicketAttributes } from "../models/ticket";
import TicketRepository from "../respository/ticket-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";
class TicketService {
  public static async create(ticketAttributes: TicketAttributes): Promise<Ticket> {
    return this.createTicket(ticketAttributes);
  }

  private static async createTicket(ticketAttributes: TicketAttributes): Promise<Ticket> {
    try {
      return await TicketRepository.create(ticketAttributes);
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }
}

export default TicketService;
