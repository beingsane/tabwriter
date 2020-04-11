import { Instruction } from './../instructions/instruction.model';
import { InstructionOperationError } from './instructionOperationError.model';
import { OperationError } from './operationError.model';
import { Operation, OperationContext } from '../../config/index.enum';

describe(`[${InstructionOperationError.name}]`, () => {
  describe(`[${InstructionOperationError.prototype.toString.name}]`, () => {
    it('should contain the description', () => {
      const errorDescription = 'some random error description for a specific operation';
      const instructionStr = '1-2';
      const instruction = new Instruction(instructionStr, 0, instructionStr.length);

      const instructionOperationError = new InstructionOperationError(
        instruction,
        Operation.leitura,
        OperationContext.instructionDefault,
        errorDescription,
      );

      expect(instructionOperationError.toString()).toContain(errorDescription);
    });

    it('should contain the instruction string', () => {
      const errorDescription = 'some random error description for a specific operation';
      const instructionStr = '1-2';
      const instruction = new Instruction(instructionStr, 0, instructionStr.length);

      const instructionOperationError = new InstructionOperationError(
        instruction,
        Operation.leitura,
        OperationContext.instructionDefault,
        errorDescription,
      );

      expect(instructionOperationError.toString()).toContain(instructionStr);
    });

    it('should contain the start position of the instruction string', () => {
      const errorDescription = 'some random error description for a specific operation';
      const instructionStr = '1-2';
      const instruction = new Instruction(instructionStr, 0, instructionStr.length);

      const instructionOperationError = new InstructionOperationError(
        instruction,
        Operation.leitura,
        OperationContext.instructionDefault,
        errorDescription,
      );

      expect(instructionOperationError.toString()).toContain(0);
    });

    it('should contain the operation context', () => {
      const errorDescription = 'some random error description for a specific operation';
      const instructionStr = '1-2';
      const instruction = new Instruction(instructionStr, 0, instructionStr.length);
      const operationContext = OperationContext.instructionDefault;

      const instructionOperationError = new InstructionOperationError(
        instruction,
        Operation.leitura,
        operationContext,
        errorDescription,
      );

      expect(instructionOperationError.toString()).toContain(OperationError.mapOperationContext2Name[operationContext]);
    });

    it('should contain the operation name', () => {
      const errorDescription = 'some random error description for a specific operation';
      const instructionStr = '1-2';
      const instruction = new Instruction(instructionStr, 0, instructionStr.length);
      const operation = Operation.leitura;

      const instructionOperationError = new InstructionOperationError(
        instruction,
        operation,
        OperationContext.instructionDefault,
        errorDescription,
      );

      expect(instructionOperationError.toString()).toContain(OperationError.mapOperation2Name[operation]);
    });
  });
});
