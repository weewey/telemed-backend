import { NextFunction, Request, RequestHandler, Response } from "express";
import { Result, ValidationError as ValidationErrorType , validationResult} from "express-validator";
import { Logger } from "../logger";
import ValidationError from "../errors/validation-error";

type ErrorExtractor = (req: Request) => Result<ValidationErrorType>;

const validate = (errorExtractor: ErrorExtractor) => (rules: RequestHandler[]): RequestHandler[] => {
    const errorThrower = (req: Request, res: Response, next: NextFunction): any => {
      const errors = errorExtractor(req);
      if (!errors.isEmpty()) {
        Logger.error(`Error in payload params. Errors: ${errors}`);
        next(ValidationError.from({ expressValidatorErrors: errors.array() }));
      }
      next();
    };
    return [ ...rules, errorThrower ];
  };

 export const validateRequest = validate(validationResult);
