import { Errors } from "../../errors/error-mappings";
import BusinessError from "../../errors/business-error";
import NotFoundError from "../../errors/not-found-error";
import TechnicalError from "../../errors/technical-error";

const REPO_BUSINESS_ERRORS = [
  Errors.FIELD_ALREADY_EXISTS.code,
  Errors.VALIDATION_ERROR.code,
];

const REPO_NOT_FOUND_ERRORS = [
  Errors.ENTITY_NOT_FOUND.code,
];

interface ErrorInterface extends Error {
  code?: string;
  message: string;
}

export const mapRepositoryErrors = (error: ErrorInterface): Error => {
  if (error.code && REPO_BUSINESS_ERRORS.includes(error.code)) {
    return new BusinessError(error.code, error.message);
  }
  if (error.code && REPO_NOT_FOUND_ERRORS.includes(error.code)) {
    return new NotFoundError(error.code, error.message);
  }
  return new TechnicalError(error.message);
};
