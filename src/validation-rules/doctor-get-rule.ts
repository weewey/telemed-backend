import { ValidationChain } from "express-validator/src/chain/validation-chain";
import { check, query } from "express-validator";

const DOCTOR_ID = "doctorId";
const CLINIC_ID = "clinicId";
const QUEUE_ID = "queueId";
const ON_DUTY = "onDuty";

export const doctorIdRule: ValidationChain =
  check(DOCTOR_ID)
    .exists()
    .withMessage("Doctor Id is required.")
    .bail()
    .isNumeric()
    .withMessage("Doctor Id must contain only numbers.")
    .toInt();

export const clinicIdRule: ValidationChain =
  query(CLINIC_ID)
    .optional()
    .isNumeric()
    .withMessage("Clinic Id must contain only numbers.")
    .toInt();

export const queueIdRule: ValidationChain =
  query(QUEUE_ID)
    .optional()
    .isNumeric()
    .withMessage("Queue Id must contain only numbers.")
    .toInt();

export const onDutyRule: ValidationChain =
  query(ON_DUTY)
    .optional()
    .isBoolean()
    .withMessage("On Duty Id must contain only boolean.")
    .toBoolean();

export const doctorGetRule = [
  queueIdRule,
  clinicIdRule,
  onDutyRule,
];
