import { OperationErrorManager } from './operationErrorManager.model';
import { Instruction } from '../instructions/instruction.model';
import { InstructionOperationError } from './instructionOperationError.model';
import { Operation, OperationContext } from '../../config/index.enum';

describe(`[${OperationErrorManager.name}]`, () => {
  it('should provide a method to add an operation error to be visible in the errorMessages field', () => {
    const instructionStr = '1-2';
    const instruction = new Instruction(instructionStr, 0, instructionStr.length);

    const operationError = new InstructionOperationError(
      instruction,
      Operation.leitura,
      OperationContext.instructionDefault,
      'some error description',
    );

    const errorManager = new OperationErrorManager();
    errorManager.addError(operationError);

    expect(errorManager.errorMessages.length).toBe(1);
    expect(errorManager.errorMessages).toEqual(expect.arrayContaining([operationError.toString()]));
  });

  it('should provide a method to add multiple operation errors to be visible in the errorMessages field', () => {
    const instructionStr = '1-2';
    const instruction = new Instruction(instructionStr, 0, instructionStr.length);
    const description = 'some error description';

    const operationErrors = [
      new InstructionOperationError(instruction, Operation.leitura, OperationContext.instructionDefault, description),
      new InstructionOperationError(instruction, Operation.escrita, OperationContext.instructionDefault, description),
    ];

    const errorManager = new OperationErrorManager();
    errorManager.addErrors(operationErrors);

    const expectedErrorMessages = operationErrors.map(oe => oe.toString());

    expect(errorManager.errorMessages.length).toBe(operationErrors.length);
    expect(errorManager.errorMessages).toEqual(expect.arrayContaining(expectedErrorMessages));
  });
});
