import { query } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";
import TicketStatus from "../ticket_status";

const STATUS = "status";
const CLINIC_ID = "clinicId";
const QUEUE_ID = "queueId";
const PATIENT_ID = "patientId";
const SUPPORTED_TICKET_STATUS = [ TicketStatus.SERVING, TicketStatus.CLOSED, TicketStatus.WAITING ];

const clinicIdQueryParamsRule: ValidationChain[] = [
  query(CLINIC_ID)
    .optional()
    .isNumeric()
    .withMessage("clinicId must be numeric")
    .toInt(),
];

const patientIdQueryParamsRule: ValidationChain[] = [
  query(PATIENT_ID)
    .optional()
    .isNumeric()
    .withMessage("patientId must be numeric")
    .toInt(),
];

const queueIdQueryParamsRule: ValidationChain[] = [
  query(QUEUE_ID)
    .optional()
    .isNumeric()
    .withMessage("queueId must be numeric")
    .toInt(),
];

const ticketStatusQueryParamsRule: ValidationChain[] = [
  query(STATUS)
    .optional()
    .toUpperCase()
    .isIn(SUPPORTED_TICKET_STATUS)
    .withMessage(`Status should contain only either ${SUPPORTED_TICKET_STATUS.join(",")}`),
];

export const ticketGetRules = [
  ...clinicIdQueryParamsRule,
  ...patientIdQueryParamsRule,
  ...queueIdQueryParamsRule,
  ...ticketStatusQueryParamsRule,
];
