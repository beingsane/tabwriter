import { InvalidInputError } from './invalidInputError.model';
import { ErrorCode } from './errorCodes.enum';

export class InvalidIntRange extends InvalidInputError {
  constructor(parameter: string, options: { min?: number; max?: number }) {
    super();

    if (options.min === undefined && options.max === undefined) {
      throw Error('Must provide a min or max range value');
    } else if (options.min === undefined) {
      this.message = `O campo ${parameter} deve ser um inteiro menor ou igual a ${options.max}`;
    } else if (options.max === undefined) {
      this.message = `O campo ${parameter} deve ser um inteiro maior ou igual a ${options.min}`;
    } else {
      this.message = `O campo ${parameter} deve ser um inteiro maior ou igual a ${options.min} e maior ou igual ${options.max}`;
    }

    this.code = ErrorCode.VALIDATION_INVALID_INT_RANGE_VALUE;
  }
}
