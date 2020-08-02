import { ErrorCode } from './errorCodes.enum';

export class InvalidInputError {
  public message = 'Valor inválido';
  public code = ErrorCode.VALIDATION_DEFAULT;
}
