import { ValidationChain } from "express-validator/src/chain/validation-chain";
import { query } from "express-validator";

const CLINIC_ID = "clinicId";

const clinicIdQueryParamsRule: ValidationChain[] = [
  query(CLINIC_ID)
    .optional()
    .isNumeric()
    .withMessage("clinicId must be numeric")
    .toInt(),
];

export const getAllQueuesRule = [
  ...clinicIdQueryParamsRule,
];
