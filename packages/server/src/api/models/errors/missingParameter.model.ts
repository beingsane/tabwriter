import { InvalidInputError } from './invalidInputError.model';
import { ErrorCode } from './errorCodes.enum';

export class MissingParameter extends InvalidInputError {
  constructor(parameter: string) {
    super();
    this.message = `O campo ${parameter} é obrigatório`;
    this.code = ErrorCode.VALIDATION_REQUIRED_PARAMETER_MISSING;
  }
}
