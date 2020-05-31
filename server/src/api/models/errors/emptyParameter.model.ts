import { ErrorCode } from './errorCodes.enum';
import { InvalidInputError } from './invalidInputError.model';

export class EmptyParameter extends InvalidInputError {
  constructor(parameter: string) {
    super();
    this.message = `O campo ${parameter} não deve ser vazio`;
    this.code = ErrorCode.VALIDATION_REQUIRED_PARAMETER_EMPTY;
  }
}
