import { body } from "express-validator";
import { ValidationChain } from "express-validator/src/chain/validation-chain";

const identity = "identity";
const room = "room";

const identityRule: ValidationChain = body(identity)
  .exists()
  .withMessage("identity must be present")
  .bail();

const roomRule: ValidationChain = body(room)
  .exists()
  .withMessage("room must be present")
  .bail();

export const videoTokenCreateRules = [
  identityRule,
  roomRule,
];
