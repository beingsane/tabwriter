import * as HttpStatus from 'http-status-codes';
import { ResponseError } from './responseError.model';
import { InputValidationError } from '../inputValidationError.model';
import { ErrorCode } from '../errors/errorCodes.enum';

export class ResponseErrorInvalidRequest extends ResponseError {
  public static readonly ERROR_CODE = ErrorCode.INVALID_REQUEST;

  public get status(): number {
    return HttpStatus.BAD_REQUEST;
  }

  public readonly errors: InputValidationError[];

  constructor(inputValidationErrors: InputValidationError[]) {
    super('Requisição inválida');
    this.errors = inputValidationErrors;
  }
}
