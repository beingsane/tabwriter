import { OperationError } from './operationError.model';
import { InstructionOperationError } from './instructionOperationError.model';

export class OperationErrorManager {
  private errors: OperationError[] = [];

  get errorMessages(): string[] {
    return this.errors.map(e => e.toString());
  }

  addInstructionReadError(
    instructionSource: string,
    instructionName: string,
    instructionPosition: number,
    errorDescription: string,
  ): void {
    this.errors.push(
      new InstructionOperationError(instructionSource, instructionPosition, instructionName, errorDescription),
    );
  }
}
