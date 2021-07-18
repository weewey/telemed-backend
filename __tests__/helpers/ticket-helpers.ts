import Ticket from "../../src/models/ticket";

export const destroyTicketsByIds = async (ids: number[]): Promise<void> => {
  await Ticket.destroy({ where: { ids } });
};
