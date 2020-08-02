import { InvalidIntRange } from './invalidIntRange.model';
import { ErrorCode } from './errorCodes.enum';
describe(`[${InvalidIntRange.name}]`, () => {
  it('should throw if neither min nor max options are set', () => {
    const parameter = 'testParameter';
    const options = {};

    expect(() => new InvalidIntRange(parameter, options)).toThrow();
  });

  it('should set the message when the min option is set', () => {
    const parameter = 'testParameter';
    const options = { min: 0 };
    const inputError = new InvalidIntRange(parameter, options);

    expect(inputError.message).toBeDefined();
    expect(inputError.message.trim().length).toBeGreaterThan(0);
  });

  it('should add the parameter name to the message when the min option is set', () => {
    const parameter = 'testParameter';
    const options = { min: 0 };
    const inputError = new InvalidIntRange(parameter, options);

    expect(inputError.message).toContain(parameter);
  });

  it('should set the message when the max option is set', () => {
    const parameter = 'testParameter';
    const options = { max: 0 };
    const inputError = new InvalidIntRange(parameter, options);

    expect(inputError.message).toBeDefined();
    expect(inputError.message.trim().length).toBeGreaterThan(0);
  });

  it('should add the parameter name to the message when the max option is set', () => {
    const parameter = 'testParameter';
    const options = { max: 0 };
    const inputError = new InvalidIntRange(parameter, options);

    expect(inputError.message).toContain(parameter);
  });

  it('should set the message when both the min and the max options are set', () => {
    const parameter = 'testParameter';
    const options = { min: 0, max: 10 };
    const inputError = new InvalidIntRange(parameter, options);

    expect(inputError.message).toBeDefined();
    expect(inputError.message.trim().length).toBeGreaterThan(0);
  });

  it('should add the parameter name to the message when both the min and the max options are set', () => {
    const parameter = 'testParameter';
    const options = { min: 0, max: 10 };
    const inputError = new InvalidIntRange(parameter, options);

    expect(inputError.message).toContain(parameter);
  });

  it('should set the error code to the invalid integer range error code', () => {
    const parameter = 'testParameter';
    const options = { min: 0 };
    const inputError = new InvalidIntRange(parameter, options);

    expect(inputError.code).toBe(ErrorCode.VALIDATION_INVALID_INT_RANGE_VALUE);
  });
});
