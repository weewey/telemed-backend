import {ValidationChain} from "express-validator/src/chain/validation-chain";
import {body} from "express-validator";

export const nameRules = (fields: string[]): ValidationChain[] => {
    return fields.map((field) => {
        return body(field)
            .exists()
            .withMessage(`${field} must be present`)
            .bail()
            .isAlpha("en-US", {ignore: " "})
            .withMessage(`${field} should only contain alphabets`)
            .trim()
    })
}

export const emailRule = (field: string): ValidationChain => {
    return body(field)
        .exists()
        .withMessage("email must be present")
        .bail()
        .isEmail()
        .withMessage("email must be a valid email")
        .normalizeEmail()
}