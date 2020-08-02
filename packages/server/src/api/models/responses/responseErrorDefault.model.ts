import * as HttpStatus from 'http-status-codes';
import { ResponseError } from './responseError.model';

export class ResponseErrorDefault extends ResponseError {
  public get status(): number {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  constructor() {
    super('Erro inesperado');
  }
}
