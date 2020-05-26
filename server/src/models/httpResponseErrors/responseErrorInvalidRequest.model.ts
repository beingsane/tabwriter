import * as HttpStatus from 'http-status-codes';
import { ResponseError } from './responseError.model';
import { ErrorCode } from './errorCodes.enum';
import { errorCodesToMessageMap } from './errorCodesToMessage.map';
import { InputValidationError } from './inputValidationError.model';

export class ResponseErrorInvalidRequest extends ResponseError {
  public static readonly ERROR_CODE = ErrorCode.INVALID_REQUEST;

  public get status(): number {
    return HttpStatus.BAD_REQUEST;
  }

  public readonly errors: InputValidationError[];

  constructor(inputValidationErrors: InputValidationError[]) {
    super(errorCodesToMessageMap[ResponseErrorInvalidRequest.ERROR_CODE]);
    this.errors = inputValidationErrors;
  }
}
