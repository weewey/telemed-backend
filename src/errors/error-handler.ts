import { ApiError } from "./error-response";
import { Request, Response, NextFunction } from "express";
import TechnicalError from "./technical-error";
import { serializeError } from "./error-serializer";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  next: NextFunction
): void => {
  const apiError: ApiError = isTechnicalOrUnknowError(err)
    ? new TechnicalError()
    : (err as ApiError);

  res.status(apiError.status);
  res.json(serializeError(apiError));
};

const isTechnicalOrUnknowError = (err: Error): boolean => {
  const status = (err as ApiError).status || 500;
  return status >= 500;
};
