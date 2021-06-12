import { body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";
import { emailRule, nameRules } from "./common-rules";

const FIRST_NAME = "firstName";
const LAST_NAME = "lastName";
const EMAIL = "email";
const AUTH_ID = "authId";
const MOBILE_NUMBER = "mobileNumber";

const authIdRule: ValidationChain =
    body(AUTH_ID)
      .exists()
      .withMessage("authId must be present")
      .bail();

const mobileNumberRule: ValidationChain = body(MOBILE_NUMBER)
  .exists()
  .withMessage("mobileNumber must be present")
  .bail()
  .isLength({ min: 8 })
  .withMessage("mobileNumber must have min 8 characters");

export const usersCreateRule = [
  ...nameRules([ FIRST_NAME, LAST_NAME ]),
  emailRule(EMAIL), authIdRule, mobileNumberRule,
];
