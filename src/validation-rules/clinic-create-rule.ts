import { body, ValidationChain } from "express-validator";
import { emailRule, stringRule } from "./common-rules";

const NAME = "name";
const IMAGEURL = "imageUrl";
const LAT = "lat";
const LONG = "long";
const ADDRESS = "address";
const POSTALCODE = "postalCode";
const EMAIL = "email";
const PHONENUMBER = "phoneNumber";

const imageUrlRule: ValidationChain = body(IMAGEURL)
  .if(body(IMAGEURL).exists())
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
  .withMessage("long must be between -90 and 90");

const postalCodeRule: ValidationChain = body(POSTALCODE)
  .exists()
  .withMessage("postal code must be present")
  .bail()
  .isPostalCode("any")
  .withMessage("postal code must be valid");

const phoneNumberRule: ValidationChain = body(PHONENUMBER)
  .exists()
  .withMessage("phone number must be present")
  .bail()
  .isNumeric()
  .withMessage("phone number must be valid");

export const clinicCreateRule = [
  ...stringRule([ NAME, ADDRESS ]),
  emailRule(EMAIL),
  imageUrlRule,
  latRule,
  longRule,
  postalCodeRule,
  phoneNumberRule,
];
