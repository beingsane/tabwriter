import { EmptyParameter } from './emptyParameter.model';
import { ErrorCode } from './errorCodes.enum';
describe(`[${EmptyParameter.name}]`, () => {
  it('should set the message', () => {
    const parameter = 'testParameter';
    const inputError = new EmptyParameter(parameter);

    expect(inputError.message).toBeDefined();
    expect(inputError.message.trim().length).toBeGreaterThan(0);
  });

  it('should add the parameter name to the message', () => {
    const parameter = 'testParameter';
    const inputError = new EmptyParameter(parameter);

    expect(inputError.message).toContain(parameter);
  });

  it('should set the error code to the empty parameter validation error code', () => {
    const parameter = 'testParameter';
    const inputError = new EmptyParameter(parameter);

    expect(inputError.code).toBe(ErrorCode.VALIDATION_REQUIRED_PARAMETER_EMPTY);
  });
});
