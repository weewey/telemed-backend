import { ApiError, ApiErrorResponse, TechnicalErrorResponse } from "./error-response";
import BusinessError from "./business-error";
import TechnicalError from "./technical-error";
import { ApiErrorType } from "./api-error-type";

export const deserializeError = (json: ApiErrorResponse): ApiError => {
  if (json.type === ApiErrorType.business) {
    return new BusinessError(json.code, json.message, json.id);
  }

  const technicalErrorJson = json as TechnicalErrorResponse;
  return new TechnicalError(technicalErrorJson.message, technicalErrorJson.id);
};

export const serializeError = (err: ApiError): any => {
  return err;
};
