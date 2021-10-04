import { check, body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";

const QUEUE_ID = "queueId";
const DOCTOR_ID = "doctorId";

const queueIdRule: ValidationChain[] = [
  check(QUEUE_ID)
    .exists()
    .withMessage("Queue Id is required.")
    .bail()
    .isNumeric()
    .withMessage("Queue Id must contain only numbers.")
    .toInt(),
];

const doctorIdRule: ValidationChain[] = [
  body(DOCTOR_ID)
    .exists()
    .withMessage("Doctor Id is required")
    .bail()
    .isNumeric()
    .withMessage("Doctor Id must contain only numbers")
    .toInt(),
];

export const queueNextTicketRule = [
  ...queueIdRule,
  ...doctorIdRule,
];
