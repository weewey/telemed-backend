import { check } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";

const QUEUE_ID = "queueId";

export const queueIdRule: ValidationChain[] = [
  check(QUEUE_ID)
    .exists()
    .withMessage("Queue Id is required.")
    .bail()
    .isNumeric()
    .withMessage("Queue Id must contain only numbers.")
    .toInt(),
];

export const queueNextTicketRule = [
  ...queueIdRule,
];
