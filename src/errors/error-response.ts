import { ApiErrorType } from "./api-error-type";
import BusinessError from "./business-error";
import TechnicalError from "./technical-error";

export type BusinessErrorResponse = {
  id: string;
  type: ApiErrorType.business;
  code: string;
  message: string;
};

export type TechnicalErrorResponse = {
  id: string;
  type: ApiErrorType.technical;
  message: string;
};

export type ApiErrorResponse = BusinessErrorResponse | TechnicalErrorResponse;

export type ApiError = BusinessError | TechnicalError;
