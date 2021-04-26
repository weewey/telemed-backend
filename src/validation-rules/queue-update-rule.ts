import { check, body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";
import QueueStatus from "../queue_status";

const QUEUE_ID = "queueId";
const STATUS = "status";

const queueIdRule: ValidationChain[] = [
    check(QUEUE_ID)
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

const queueStatusRule: ValidationChain[] = [
    body(STATUS)
    .exists()
    .withMessage("Status is required.")
    .bail()
    .toUpperCase()
    .custom(value => [ QueueStatus.ACTIVE, QueueStatus.CLOSED, QueueStatus.INACTIVE ].includes(value))
    .withMessage(`Status should contain only either ${QueueStatus.ACTIVE} / ${QueueStatus.CLOSED} / ${QueueStatus.INACTIVE}`)
]

export const queueUpdateRules = [
    ...queueIdRule,
    ...queueStatusRule
  ];
