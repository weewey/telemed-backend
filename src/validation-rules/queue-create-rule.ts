import { body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";
const CLINIC_ID = "clinicId";
const DOCTOR_ID = "doctorId";

const clinicIdRule: ValidationChain[] = [
  body(CLINIC_ID)
    .isNumeric()
    .withMessage("clinicId must be numeric")
    .toInt(),
];

const doctorIdRule: ValidationChain[] = [
  body(DOCTOR_ID)
    .exists()
    .bail()
    .isNumeric()
    .withMessage("doctorId must be numeric")
    .toInt(),
];

export const queueCreateRules = [
  ...clinicIdRule,
  ...doctorIdRule,
];
