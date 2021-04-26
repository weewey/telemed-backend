import { check } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";

const QUEUE_ID = "queueId";

export const queueIdRule: ValidationChain[] = [ check(QUEUE_ID)
    .exists()
    .withMessage("Queue Id is required.")
    .bail()
    .isLength({ max: 9 })
    .withMessage("Queue Id length should not be longer than 9.")
    .bail()
    .custom(value => /^[0-9]*$/.test(value))
    .withMessage("Queue Id must contain only numbers.")
    .toInt()
]
