import * as HttpStatus from 'http-status-codes';
import { ResponseError } from '../../models/responses/responseError.model';
import { InvalidInstructionError } from './invalidInstructionError.model';

export class ResponseErrorInvalidInstructions extends ResponseError {
  public get status(): number {
    return HttpStatus.UNPROCESSABLE_ENTITY;
  }

  public readonly errors: InvalidInstructionError[];

  constructor(invalidInstructionErrors: InvalidInstructionError[]) {
    super('Instruções inválidas');
    this.errors = invalidInstructionErrors;
  }
}
