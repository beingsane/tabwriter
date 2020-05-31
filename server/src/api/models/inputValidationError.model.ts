import { Location, ValidationError } from 'express-validator';
import { ErrorCode } from './errors/errorCodes.enum';
import { InvalidInputError } from './errors/invalidInputError.model';

export class InputValidationError {
  public readonly code: ErrorCode;
  public readonly message: string;
  public readonly field: string;
  public readonly location: Location | null;
  public readonly value: unknown;

  constructor(validationError: ValidationError) {
    if (validationError.msg instanceof InvalidInputError) {
      this.code = validationError.msg.code;
      this.message = validationError.msg.message;
    } else {
      this.code = ErrorCode.VALIDATION_DEFAULT;
      this.message = validationError.msg;
    }

    this.value = validationError.value !== undefined ? validationError.value : null;
    this.location = validationError.location !== undefined ? validationError.location : null;
    this.field = validationError.param;
  }
}
