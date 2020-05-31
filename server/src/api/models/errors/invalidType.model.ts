import { ErrorCode } from './errorCodes.enum';
import { InvalidInputError } from './invalidInputError.model';

export class InvalidType extends InvalidInputError {
  constructor(parameter: string, expectedType: string) {
    super();
    this.message = `O campo ${parameter} deve ser do tipo ${expectedType}`;
    this.code = ErrorCode.VALIDATION_INVALID_TYPE;
  }
}
