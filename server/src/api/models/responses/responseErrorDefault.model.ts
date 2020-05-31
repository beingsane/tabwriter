import * as HttpStatus from 'http-status-codes';
import { ResponseError } from './responseError.model';
import { ErrorCode } from '../errors/errorCodes.enum';

export class ResponseErrorDefault extends ResponseError {
  public static readonly ERROR_CODE = ErrorCode.ERROR_DEFAULT;

  public get status(): number {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  constructor() {
    super('Erro inesperado');
  }
}
