import { ValidationErrorItem } from "sequelize";

export const mapSequelizeErrorToErrorMessage =
    (errorMessagePrefix: string, errors: ValidationErrorItem[]): string => {
      let errorFields = "";
      let errorMessage = "";

      errors.forEach(({ message, path }) => {
        errorMessage = `${errorMessage}${message} `;
        errorFields = `${errorFields}${path} `;
      });

      return `${errorMessagePrefix}. Fields: [ ${errorFields}], message: [ ${errorMessage}]`;
    };
