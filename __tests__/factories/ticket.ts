import { Factory } from "rosie";
import Ticket from "../../src/models/ticket";
import { randomInt } from "crypto";
import TicketStatus from "../../src/ticket_status";
import { buildWrapper } from "./index";

const ticket = Factory.define<Ticket>("ticket", Ticket)
  .attr("displayNumber", () => randomInt(1, 1000))
  .attr("status", () => TicketStatus.WAITING)
  .attr("patientId", () => randomInt(1, 1000))
  .attr("queueId", () => randomInt(1, 1000))
  .attr("clinicId", () => randomInt(1, 1000))
  .attr("createdAt", () => new Date(Date.now()))
  .attr("updatedAt", () => new Date(Date.now()));

export const ticketFactory = buildWrapper<Ticket>(ticket);
