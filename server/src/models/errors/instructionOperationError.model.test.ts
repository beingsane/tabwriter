import { InstructionOperationError } from './instructionOperationError.model';

describe(`[${InstructionOperationError.name}]`, () => {
  describe(`[toString]`, () => {
    it('should contain the description', () => {
      const errorDescription = 'some random error description for a specific operation';
      const error = new InstructionOperationError('1-2', 0, 'instruction', errorDescription);

      expect(error.toString()).toContain(errorDescription);
    });

    it('should contain the instruction source', () => {
      const instructionStr = '1-2';
      const error = new InstructionOperationError(instructionStr, 0, 'instruction', 'some random error description');

      expect(error.toString()).toContain(instructionStr);
    });

    it('should contain the position reference', () => {
      const position = 21;
      const error = new InstructionOperationError('1-2', position, 'instruction', 'some random error description');

      expect(error.toString()).toContain(position);
    });

    it('should contain the instruction name', () => {
      const name = 'test:instruction';
      const error = new InstructionOperationError('1-2', 0, name, 'some random error description');

      expect(error.toString()).toContain(name);
    });
  });
});
