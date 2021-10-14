import { check } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";

const PATIENT_ID = "patientId";

export const patientIdRule: ValidationChain[] = [
  check(PATIENT_ID)
    .exists()
    .withMessage("Patient Id is required.")
    .bail()
    .isNumeric()
    .withMessage("Patient Id must contain only numbers.")
    .toInt(),
];
