import * as HttpStatus from 'http-status-codes';
import { ResponseError } from './responseError.model';
import { ErrorCode } from './errorCodes.enum';
import { errorCodesToMessageMap } from './errorCodesToMessage.map';

export class ResponseErrorResourceNotFound extends ResponseError {
  public static readonly ERROR_CODE = ErrorCode.RESOURCE_NOT_FOUND;

  public get status(): number {
    return HttpStatus.NOT_FOUND;
  }

  constructor() {
    super(errorCodesToMessageMap[ResponseErrorResourceNotFound.ERROR_CODE]);
  }
}
