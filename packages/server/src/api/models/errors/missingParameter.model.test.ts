import { MissingParameter } from './missingParameter.model';
import { ErrorCode } from './errorCodes.enum';

describe(`[${MissingParameter.name}]`, () => {
  it('should set the message', () => {
    const parameter = 'testParameter';
    const inputError = new MissingParameter(parameter);

    expect(inputError.message).toBeDefined();
    expect(inputError.message.trim().length).toBeGreaterThan(0);
  });

  it('should add the parameter to the message', () => {
    const parameter = 'testParameter';
    const inputError = new MissingParameter(parameter);

    expect(inputError.message).toContain(parameter);
  });

  it('should set the error code to the missing parameter error code', () => {
    const parameter = 'testParameter';
    const inputError = new MissingParameter(parameter);

    expect(inputError.code).toBe(
      ErrorCode.VALIDATION_REQUIRED_PARAMETER_MISSING
    );
  });
});
