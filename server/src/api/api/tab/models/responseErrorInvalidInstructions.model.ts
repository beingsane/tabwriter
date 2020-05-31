import * as HttpStatus from 'http-status-codes';
import { ResponseError } from '../../../models/responses/responseError.model';
import { ResponseErrorInvalidInstruction } from './responseErrorInvalidInstruction.model';
import { ErrorCode } from '../../../models/errors/errorCodes.enum';

export class ResponseErrorInvalidInstructions extends ResponseError {
  public static readonly ERROR_CODE = ErrorCode.UNPROCESSABLE_TAB_INSTRUCTIONS;

  public get status(): number {
    return HttpStatus.UNPROCESSABLE_ENTITY;
  }

  public readonly errors: ResponseErrorInvalidInstruction[];

  constructor(invalidInstructionErrors: ResponseErrorInvalidInstruction[]) {
    super('Instruções inválidas');
    this.errors = invalidInstructionErrors;
  }
}
