import { ErrorCode } from './errorCodes.enum';
import { InvalidInputError } from './invalidInputError.model';

describe(`[${InvalidInputError.name}]`, () => {
  it('should set the message', () => {
    const inputError = new InvalidInputError();

    expect(inputError.message).toBeDefined();
    expect(inputError.message.trim().length).toBeGreaterThan(0);
  });

  it('should set the error code to the default validation error code', () => {
    const inputError = new InvalidInputError();

    expect(inputError.code).toBe(ErrorCode.VALIDATION_DEFAULT);
  });
});
