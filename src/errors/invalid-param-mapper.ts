import { InvalidParam } from "./invalid-param";

const fromValidateJSError = (
  validateJSErrors: ValidateJsErrorFormat,
): InvalidParam[] => {
  const invalidParams: InvalidParam[] = [];

  Object.keys(validateJSErrors).forEach(name => {
    const errorList = validateJSErrors[name];
    if (errorList !== undefined) {
      errorList.forEach((reason: string) => {
        invalidParams.push({ name, reason });
      });
    }
  });
  return invalidParams;
};

const toValidateJSError = (
  invalidParams: InvalidParam[],
): { [key: string]: string[] } => {
  const validateJSErrors: { [keys: string]: string[] } = {};

  invalidParams.forEach(invalidParam => {
    if (!validateJSErrors[invalidParam.name]) {
      validateJSErrors[invalidParam.name] = [];
    }
    validateJSErrors[invalidParam.name].push(invalidParam.reason);
  });
  return validateJSErrors;
};

const fromExpressValidatorFormat = (
  errors: ExpressValidatorErrors,
): InvalidParam[] => {
  return errors.map(error => {
    return { name: error.param, reason: error.msg };
  });
};
const toExpressValidatorFormat = (
  invalidParms: InvalidParam[],
): ExpressValidatorErrors => {
  return invalidParms.map(invalidParam => {
    return { param: invalidParam.name, msg: invalidParam.reason };
  });
};

export const invalidParamMapper = {
  fromValidateJSError,
  toValidateJSError,
  fromExpressValidatorFormat,
  toExpressValidatorFormat,
};

export type ValidateJsErrorFormat = { [key: string]: string[] | undefined };
export type ExpressValidatorErrors = {
  msg: string;
  param: string;
}[];
