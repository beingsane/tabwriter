import * as HttpStatus from 'http-status-codes';
import { ResponseError } from './responseError.model';
import { ErrorCode } from '../errors/errorCodes.enum';

export class ResponseErrorResourceNotFound extends ResponseError {
  public static readonly ERROR_CODE = ErrorCode.RESOURCE_NOT_FOUND;

  public get status(): number {
    return HttpStatus.NOT_FOUND;
  }

  constructor(requestedResource: string) {
    super(`Não foi possível encontrar o recurso solicitado: ${requestedResource}`);
  }
}
