import { InstructionOperationError } from './instructionOperationError.model';
import { OperationErrorManager } from './operationErrorManager.model';

describe(`[${OperationErrorManager.name}]`, () => {
  it('should provide a method to add an instruction operation error to be visible in the errorMessages field', () => {
    const instructionSource = '1-2';
    const instructionName = 'test:instruction';
    const position = 123;
    const errorDescription = 'some random error description message';

    const expectedError = new InstructionOperationError(instructionSource, position, instructionName, errorDescription);
    const errorManager = new OperationErrorManager();
    errorManager.addInstructionReadError(instructionSource, instructionName, position, errorDescription);

    expect(errorManager.errorMessages[0]).toBe(expectedError.toString());
  });
});
