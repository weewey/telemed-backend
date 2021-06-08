import { body, ValidationChain } from "express-validator";
import { emailRule, stringRule } from "./common-rules";

const NAME = "name";
const IMAGE_URL = "imageUrl";
const LAT = "lat";
const LONG = "long";
const ADDRESS = "address";
const POSTAL_CODE = "postalCode";
const EMAIL = "email";
const PHONE_NUMBER = "phoneNumber";

const imageUrlRule: ValidationChain = body(IMAGE_URL)
  .optional()
  .isURL()
  .withMessage("image url must be a valid url");

const latRule: ValidationChain = body(LAT)
  .exists()
  .withMessage("lat must be present")
  .bail()
  .isFloat({ min: -90, max: 90 })
  .withMessage("lat must be between -90 and 90");

const longRule: ValidationChain = body(LONG)
  .exists()
  .withMessage("long must be present")
  .bail()
  .isFloat({ min: -180, max: 180 })
  .withMessage("long must be between -180 and 180");

const postalCodeRule: ValidationChain = body(POSTAL_CODE)
  .exists()
  .withMessage("postalCode must be present")
  .bail()
  .isPostalCode("any")
  .withMessage("postal code must be valid");

const phoneNumberRule: ValidationChain = body(PHONE_NUMBER)
  .exists()
  .withMessage("phoneNumber must be present")
  .bail()
  .isNumeric()
  .withMessage("phoneNumber must be valid");

export const clinicCreateRule = [
  ...stringRule([ NAME, ADDRESS ]),
  emailRule(EMAIL),
  imageUrlRule,
  latRule,
  longRule,
  postalCodeRule,
  phoneNumberRule,
];
