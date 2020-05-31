import { ValidationError } from 'express-validator';
import { InputValidationError } from './inputValidationError.model';
import { InvalidInputError } from './errors/invalidInputError.model';
import { ErrorCode } from './errors/errorCodes.enum';

describe(`[${InputValidationError.name}]`, () => {
  it('should set code and message based on msg if it is an invalid input error', () => {
    const invalidInputError = new InvalidInputError();
    const validationError = { msg: invalidInputError } as ValidationError;

    const inputValidationError = new InputValidationError(validationError);

    expect(inputValidationError.code).toBe(invalidInputError.code);
    expect(inputValidationError.message).toBe(invalidInputError.message);
  });

  it('should set code to the default validation error code if msg is not an error code', () => {
    const errorMessage = 'test error message';
    const validationError = { msg: errorMessage } as ValidationError;

    const inputValidationError = new InputValidationError(validationError);

    expect(inputValidationError.code).toBe(ErrorCode.VALIDATION_DEFAULT);
  });

  it('should set message to the msg value if it is not an error code', () => {
    const errorMessage = 'test error message';
    const validationError = { msg: errorMessage } as ValidationError;

    const inputValidationError = new InputValidationError(validationError);

    expect(inputValidationError.message).toBe(errorMessage);
  });

  it('should set value to null if it is undefined', () => {
    const validationError = { value: undefined } as ValidationError;

    const inputValidationError = new InputValidationError(validationError);

    expect(inputValidationError.value).toBe(null);
  });

  it('should set value to the value if it is defined', () => {
    const value = 'test value';
    const validationError = { value } as ValidationError;

    const inputValidationError = new InputValidationError(validationError);

    expect(inputValidationError.value).toBe(value);
  });

  it('should set location to null if it is undefined', () => {
    const validationError = { location: undefined } as ValidationError;

    const inputValidationError = new InputValidationError(validationError);

    expect(inputValidationError.location).toBe(null);
  });

  it('should set location to location if it is defined', () => {
    const location = 'body';
    const validationError = { location } as ValidationError;

    const inputValidationError = new InputValidationError(validationError);

    expect(inputValidationError.location).toBe(location);
  });
});
