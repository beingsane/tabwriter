import { OperationError } from './operationError.model';

export class OperationErrorManager {
  protected errors: OperationError[] = [];

  get errorMessages(): string[] {
    return this.errors.map(e => e.toString());
  }

  addError(error: OperationError): void {
    this.errors.push(error);
  }

  addErrors(errors: OperationError[]): void {
    this.errors = this.errors.concat(errors);
  }
}
