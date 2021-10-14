import { ValidationChain } from "express-validator/src/chain/validation-chain";
import { check } from "express-validator";

const DOCTOR_ID = "doctorId";

export const doctorIdRule: ValidationChain[] = [
  check(DOCTOR_ID)
    .exists()
    .withMessage("DOctor Id is required.")
    .bail()
    .isNumeric()
    .withMessage("Doctor Id must contain only numbers.")
    .toInt(),
];
