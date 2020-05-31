import { ErrorCode } from './errorCodes.enum';
import * as HttpStatus from 'http-status-codes';
import { ResponseError } from './responseError.model';
import { InputValidationError } from './inputValidationError.model';
import { errorCodesToMessageMap } from './errorCodesToMessage.map';

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
