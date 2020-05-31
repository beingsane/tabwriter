import { ResponseErrorInvalidInstruction } from './responseErrorInvalidInstruction.model';
import { InstructionWriteResult } from '../../../services/tabWriter.service';
import { ErrorCode } from '../../models/errors/errorCodes.enum';

const getDefaultInvalidInstructionWriteResult = (): InstructionWriteResult => ({
  success: false,
  error: 'test error',
  instruction: 'test',
  readFromIdx: 0,
  readToIdx: 2,
  name: 'instrução test',
});

describe(`[${ResponseErrorInvalidInstruction.name}]`, () => {
  it('should be mapped to the unprocessable instruction error code', () => {
    const responseError = new ResponseErrorInvalidInstruction(getDefaultInvalidInstructionWriteResult());

    expect(responseError.code).toBe(ErrorCode.UNPROCESSABLE_TAB_INSTRUCTION);
  });

  it('should set the message to the write result error if not null', () => {
    const invalidInstructionWriteResult = getDefaultInvalidInstructionWriteResult();
    const responseError = new ResponseErrorInvalidInstruction(invalidInstructionWriteResult);

    expect(responseError.message).toBe(invalidInstructionWriteResult.error);
  });

  it('should set the message to an empty string if the write result error is null', () => {
    const invalidInstructionWriteResult = getDefaultInvalidInstructionWriteResult();
    invalidInstructionWriteResult.error = null;

    const responseError = new ResponseErrorInvalidInstruction(invalidInstructionWriteResult);

    expect(responseError.message).toBe('');
  });

  it('should set the instruction to the write result instruction', () => {
    const invalidInstructionWriteResult = getDefaultInvalidInstructionWriteResult();
    const responseError = new ResponseErrorInvalidInstruction(invalidInstructionWriteResult);

    expect(responseError.instruction).toBe(invalidInstructionWriteResult.instruction);
  });

  it('should set the readFrom to the write result readFromIdx', () => {
    const invalidInstructionWriteResult = getDefaultInvalidInstructionWriteResult();
    const responseError = new ResponseErrorInvalidInstruction(invalidInstructionWriteResult);

    expect(responseError.readFrom).toBe(invalidInstructionWriteResult.readFromIdx);
  });

  it('should set the readTo to the write result readToIdx', () => {
    const invalidInstructionWriteResult = getDefaultInvalidInstructionWriteResult();
    const responseError = new ResponseErrorInvalidInstruction(invalidInstructionWriteResult);

    expect(responseError.readTo).toBe(invalidInstructionWriteResult.readToIdx);
  });

  it('should set the context to the write result name', () => {
    const invalidInstructionWriteResult = getDefaultInvalidInstructionWriteResult();
    const responseError = new ResponseErrorInvalidInstruction(invalidInstructionWriteResult);

    expect(responseError.context).toBe(invalidInstructionWriteResult.name);
  });
});
