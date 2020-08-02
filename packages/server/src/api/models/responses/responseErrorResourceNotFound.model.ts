import * as HttpStatus from 'http-status-codes';
import { ResponseError } from './responseError.model';

export class ResponseErrorResourceNotFound extends ResponseError {
  public get status(): number {
    return HttpStatus.NOT_FOUND;
  }

  constructor(requestedResource: string) {
    super(
      `Não foi possível encontrar o recurso solicitado: ${requestedResource}`
    );
  }
}
