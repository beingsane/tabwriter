import * as HttpStatus from 'http-status-codes';
import { ResponseErrorInvalidInstructions } from './responseErrorInvalidInstructions.model';
import { ResponseErrorInvalidInstruction } from './responseErrorInvalidInstruction.model';
import { ErrorCode } from '../../../models/errors/errorCodes.enum';
import { InstructionWriteResult } from '../../../../services/tabWriter.service';

const getDefaultInvalidInstructionResponseErrors = (): ResponseErrorInvalidInstruction[] => {
  const invalidInstructionWriteResult: InstructionWriteResult = {
    success: false,
    error: 'test error',
    instruction: 'test',
    readFromIdx: 0,
    readToIdx: 2,
    name: 'instrução test',
  };
  return [new ResponseErrorInvalidInstruction(invalidInstructionWriteResult)];
};

describe(`[${ResponseErrorInvalidInstructions.name}]`, () => {
  it('should be mapped to the unprocessable instructions error code', () => {
    expect(ResponseErrorInvalidInstructions.ERROR_CODE).toBe(ErrorCode.UNPROCESSABLE_TAB_INSTRUCTIONS);
  });

  it('should set the message', () => {
    const responseError = new ResponseErrorInvalidInstructions(getDefaultInvalidInstructionResponseErrors());

    expect(responseError.message).toBeDefined();
    expect(responseError.message.trim().length).toBeGreaterThan(0);
  });

  it('should set the errors to the given invalid instruction errors', () => {
    const invalidInstructionsResponseErrors = getDefaultInvalidInstructionResponseErrors();
    const responseError = new ResponseErrorInvalidInstructions(invalidInstructionsResponseErrors);

    expect(responseError.errors).toEqual(invalidInstructionsResponseErrors);
  });

  it('should return an unprocessable entity status code', () => {
    const responseError = new ResponseErrorInvalidInstructions(getDefaultInvalidInstructionResponseErrors());

    expect(responseError.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
});
