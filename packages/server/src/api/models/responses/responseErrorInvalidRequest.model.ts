import * as HttpStatus from 'http-status-codes';
import { ResponseError } from './responseError.model';
import { InputValidationError } from '../inputValidationError.model';

export class ResponseErrorInvalidRequest extends ResponseError {
  public get status(): number {
    return HttpStatus.BAD_REQUEST;
  }

  public readonly errors: InputValidationError[];

  constructor(inputValidationErrors: InputValidationError[]) {
    super('Requisição inválida');
    this.errors = inputValidationErrors;
  }
}
