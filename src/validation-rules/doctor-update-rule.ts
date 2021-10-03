import { body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";
import { optionalNameRules } from "./common-rules";

const FIRST_NAME = "firstName";
const LAST_NAME = "lastName";
const EMAIL = "email";
const ON_DUTY = "onDuty";
const MOBILE_NUMBER = "mobileNumber";
const CLINIC_ID = "clinicId";
const QUEUE_ID = "queueId";

const mobileNumberRule: ValidationChain = body(MOBILE_NUMBER)
  .optional()
  .isLength({ min: 8 })
  .withMessage("mobileNumber must have min 8 characters");

export const emailRule: ValidationChain = body(EMAIL)
  .optional()
  .isEmail()
  .withMessage("email must be a valid email")
  .normalizeEmail();

const onDutyRule: ValidationChain = body(ON_DUTY)
  .optional()
  .isBoolean()
  .withMessage("onDuty must be of boolean type");

const clinicIdRule: ValidationChain = body(CLINIC_ID)
  .optional()
  .toInt()
  .isNumeric()
  .withMessage("clinicId must be an integer");

const queueIdRule: ValidationChain = body(QUEUE_ID)
  .optional()
  .toInt()
  .isNumeric()
  .withMessage("queueId must be an integer");

export const doctorUpdateRule = [
  ...optionalNameRules([ FIRST_NAME, LAST_NAME ]),
  emailRule, queueIdRule, mobileNumberRule, onDutyRule, clinicIdRule,
];
