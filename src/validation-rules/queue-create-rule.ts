import { body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";
const CLINIC_ID = 'clinicId';

const clinicIdRule: ValidationChain[] = [
    body(CLINIC_ID)
    .isNumeric()
    .withMessage("clinicId must be numeric")
    .toInt()
]

export const queueCreateRules = [
    ...clinicIdRule
  ];
