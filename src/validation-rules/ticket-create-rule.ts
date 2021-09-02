import { body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";
import TicketTypes from "../ticket_types";

const PATIENT_ID = "patientId";
const QUEUE_ID = "queueId";
const CLINIC_ID = "clinicId";
const TYPE = "type";

const patientIdRule: ValidationChain = body(PATIENT_ID)
  .exists()
  .withMessage("patientId must be present")
  .bail()
  .isNumeric()
  .withMessage("patientId must be numeric");

const typeRule: ValidationChain = body(TYPE)
  .exists()
  .withMessage("type must be present")
  .bail()
  .isIn([ TicketTypes.TELEMED, TicketTypes.PHYSICAL ])
  .withMessage("patientId must be numeric");

const queueIdRule: ValidationChain = body(QUEUE_ID)
  .exists()
  .withMessage("queueId must be present")
  .bail()
  .isNumeric()
  .withMessage("queueId must be numeric");

const clinicIDRule: ValidationChain = body(CLINIC_ID)
  .exists()
  .withMessage("clinicId must be present")
  .bail()
  .isNumeric()
  .withMessage("clinicId must be numeric");

export const ticketCreateRules = [
  patientIdRule,
  queueIdRule,
  clinicIDRule,
  typeRule,
];
