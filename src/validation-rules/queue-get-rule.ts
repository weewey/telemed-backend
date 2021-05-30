import { ValidationChain } from "express-validator/src/chain/validation-chain";
import { query } from "express-validator";
import QueueStatus from "../queue_status";

const CLINIC_ID = "clinicId";
const STATUS = "status";

const clinicIdQueryParamsRule: ValidationChain[] = [
  query(CLINIC_ID)
    .optional()
    .isNumeric()
    .withMessage("clinicId must be numeric")
    .toInt(),
];

const statusQueryParamsRule: ValidationChain[] = [
  query(STATUS)
    .optional()
    .toUpperCase()
    .custom(value => [ QueueStatus.ACTIVE, QueueStatus.CLOSED, QueueStatus.INACTIVE ].includes(value))
    .withMessage(
      `Status should contain only either ${QueueStatus.ACTIVE} / ${QueueStatus.CLOSED} / ${QueueStatus.INACTIVE}`,
    ),
];

export const getAllQueuesRule = [
  ...clinicIdQueryParamsRule, ...statusQueryParamsRule,
];
