import { check, body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";
import TicketStatus from "../ticket_status";

const TICKET_ID = "ticketId";
const STATUS = "status";

export const ticketIdRule: ValidationChain[] = [
  check(TICKET_ID)
    .exists()
    .withMessage("Ticket Id is required.")
    .bail()
    .isNumeric()
    .withMessage("Ticket Id must contain only numbers.")
    .toInt(),
];

const ticketStatusRule: ValidationChain[] = [
  body(STATUS)
    .toUpperCase()
    .custom(value => [ TicketStatus.WAITING, TicketStatus.SERVING, TicketStatus.CLOSED ].includes(value))
    .withMessage(
      `Status should contain only either ${TicketStatus.WAITING} / ${TicketStatus.SERVING} / ${TicketStatus.CLOSED}`,
    ),
];

export const ticketUpdateRules = [
  ...ticketIdRule,
  ...ticketStatusRule,
];
