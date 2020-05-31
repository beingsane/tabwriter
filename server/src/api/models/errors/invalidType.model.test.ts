import { InvalidType } from './invalidType.model';
import { ErrorCode } from './errorCodes.enum';

describe(`${InvalidType.name}`, () => {
  it('should set the message', () => {
    const parameter = 'testParameter';
    const expectedType = 'testType';
    const inputError = new InvalidType(parameter, expectedType);

    expect(inputError.message).toBeDefined();
    expect(inputError.message.trim().length).toBeGreaterThan(0);
  });

  it('should add both the parameter and the expected type to the message', () => {
    const parameter = 'testParameter';
    const expectedType = 'testType';
    const inputError = new InvalidType(parameter, expectedType);

    expect(inputError.message).toContain(parameter);
    expect(inputError.message).toContain(expectedType);
  });

  it('should set the error code to the invalid type error code', () => {
    const parameter = 'testParameter';
    const expectedType = 'testType';
    const inputError = new InvalidType(parameter, expectedType);

    expect(inputError.code).toBe(ErrorCode.VALIDATION_INVALID_TYPE);
  });
});
