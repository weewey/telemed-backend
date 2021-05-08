import {ValidationErrorItem} from "sequelize";

interface ErrorFieldsAndMessageInterface {
    errorFields: string,
    errorMessage: string
}

export const mapSequelizeErrorsToErrorFieldsAndMessage = (errors: ValidationErrorItem[]): ErrorFieldsAndMessageInterface => {
    let errorFields = "";
    let errorMessage = ""
    errors.map(({message, path}) => {
        errorMessage = errorMessage + `${message} `
        errorFields = errorFields + `${path} `
    })
    return {errorFields, errorMessage}
}
