import { check, body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";
import QueueStatus from "../queue_status";

const QUEUE_ID = "queueId";
const STATUS = "status";
const CLINIC_ID = "clinicId";
const CURRENT_TICKET_ID = "currentTicketId";

export const queueIdRule: ValidationChain[] = [
  check(QUEUE_ID)
    .exists()
    .withMessage("Queue Id is required.")
    .bail()
    .isNumeric()
    .withMessage("Queue Id must contain only numbers.")
    .toInt(),
];

export const currentTicketIdRule: ValidationChain[] = [
  check(CURRENT_TICKET_ID)
    .optional({ nullable: true })
    .isNumeric()
    .withMessage("Current Ticket Id must contain only numbers.")
    .toInt(),
];

const clinicIdRule: ValidationChain[] = [
  body(CLINIC_ID)
    .exists()
    .withMessage("Clinic Id is required")
    .bail()
    .isNumeric()
    .withMessage("clinicId must contain only numbers.")
    .toInt(),
];

const queueStatusRule: ValidationChain[] = [
  body(STATUS)
    .optional()
    .toUpperCase()
    .custom(value => [ QueueStatus.ACTIVE, QueueStatus.CLOSED, QueueStatus.INACTIVE ].includes(value))
    .withMessage(
      `Status should contain only either ${QueueStatus.ACTIVE} / ${QueueStatus.CLOSED} / ${QueueStatus.INACTIVE}`,
    ),
];

export const queueUpdateRules = [
  ...queueIdRule,
  ...queueStatusRule,
  ...clinicIdRule,
  ...currentTicketIdRule,
];
