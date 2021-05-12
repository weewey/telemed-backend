import { body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";
import { booleanRule, emailRule, nameRules } from "./common-rules";

const FIRST_NAME = "firstName";
const LAST_NAME = "lastName";
const EMAIL = "email";
const ON_DUTY = "onDuty";
const AUTH_ID = "authId";

const authIdRule: ValidationChain =
    body(AUTH_ID)
      .exists()
      .withMessage("authId must be present")
      .bail();

export const doctorCreateRule = [
  ...nameRules([ FIRST_NAME, LAST_NAME ]),
  emailRule(EMAIL), ...booleanRule([ ON_DUTY ]), authIdRule,
];
