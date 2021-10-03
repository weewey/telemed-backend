import { body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";

export const nameRules = (fields: string[]): ValidationChain[] => {
  return fields.map((field) =>
    body(field)
      .exists()
      .withMessage(`${field} must be present`)
      .bail()
      .isAlpha("en-US", { ignore: " " })
      .withMessage(`${field} should only contain alphabets`)
      .trim() as ValidationChain);
};

export const optionalNameRules = (fields: string[]): ValidationChain[] => {
  return fields.map((field) =>
    body(field)
      .optional()
      .isAlpha("en-US", { ignore: " " })
      .withMessage(`${field} should only contain alphabets`)
      .trim() as ValidationChain);
};

export const emailRule = (field: string): ValidationChain => {
  return body(field)
    .exists()
    .withMessage("email must be present")
    .bail()
    .isEmail()
    .withMessage("email must be a valid email")
    .normalizeEmail();
};

export const booleanRule = (fields: string[]): ValidationChain[] => {
  return fields.map((field) =>
    body(field)
      .exists()
      .withMessage(`${field} must be present`)
      .bail()
      .isBoolean()
      .withMessage(`${field} must be of boolean type`)
      .toBoolean());
};

export const stringRule = (fields: string[]): ValidationChain[] => {
  return fields.map((field) =>
    body(field)
      .exists()
      .withMessage(`${field} must be present`)
      .bail()
      .isString()
      .withMessage(`${field} must be of string`));
};
