import { body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";

const FIRST_NAME = 'firstName';
const LAST_NAME = 'lastName';
const EMAIL = 'email';
const AUTH_ID = 'authId';
const MOBILE_NUMBER = 'mobileNumber';

const firstNameRule: ValidationChain = body(FIRST_NAME)
    .exists()
    .withMessage("firstName must be present")
    .isLength({ max: 50 })
    .withMessage("firstName must not be longer than 50 characters")

const lastNameRule: ValidationChain = body(LAST_NAME)
    .exists()
    .withMessage("lastName must be present")
    .bail()
    .isLength({ max: 50 })
    .withMessage("lastName must not be longer than 50 characters")

const emailRule: ValidationChain = body(EMAIL)
    .exists()
    .withMessage("email must be present")
    .bail()
    .isEmail()
    .withMessage("email must be a valid email")

const authIdRule: ValidationChain = body(AUTH_ID)
    .exists()
    .withMessage("authId must be present")

const mobileNumberRule: ValidationChain = body(MOBILE_NUMBER)
    .exists()
    .withMessage("mobileNumber must be present")
    .bail()
    .isLength({ min: 8 })
    .withMessage("mobileNumber must have min 8 characters")



export const patientCreateRules = [
    firstNameRule,
    lastNameRule,
    emailRule,
    authIdRule,
    mobileNumberRule
  ];
