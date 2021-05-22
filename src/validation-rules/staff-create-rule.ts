import { body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";
import { emailRule, nameRules } from "./common-rules";

const FIRST_NAME = "firstName";
const LAST_NAME = "lastName";
const EMAIL = "email";
const AUTH_ID = "authId";

const authIdRule: ValidationChain =
    body(AUTH_ID)
      .exists()
      .withMessage("authId must be present")
      .bail();

export const staffCreateRule = [
  ...nameRules([ FIRST_NAME, LAST_NAME ]),
  emailRule(EMAIL), authIdRule,
];
