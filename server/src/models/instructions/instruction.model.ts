import { Operation, OperationContext } from './../../enums/index.enum';
import { InstructionMetadata } from './instructionMetadata.model';
import { InstructionWriteBehavior } from './instructionWriteBehavior.model';
import { InstructionDefaultWriteBehavior } from './instructionDefaultWriteBehavior.model';
import { OperationErrorManager } from '../errors/operationErrorManager.model';
import { InstructionOperationError } from '../errors/instructionOperationError.model';
import { Tab } from '../tab/tab.model';

export class Instruction {
  public readonly metadata: InstructionMetadata;
  public readonly source: string;
  public writeBehaviour!: InstructionWriteBehavior;

  constructor(source: string, public readonly startsAt: number, public readonly endsAt: number) {
    this.source = source.trim();
    this.metadata = InstructionMetadata.getInstructionMetadata(this.source);
    this.setWriteBehavior();
  }

  public writeToTab(tab: Tab, errorReporter?: OperationErrorManager): void {
    if (this.metadata.isRead) {
      this.writeBehaviour.writeToTab(tab, errorReporter);
    } else {
      if (errorReporter) {
        errorReporter.addError(
          new InstructionOperationError(
            this,
            Operation.leitura,
            OperationContext.instructionGeneral,
            this.metadata.readFailDescription,
          ),
        );
      }
    }
  }

  private setWriteBehavior(): void {
    if (this.metadata.isMethod) {
      switch (this.metadata.methodName.toUpperCase()) {
        default:
          this.writeBehaviour = new InstructionDefaultWriteBehavior(this);
      }
    } else {
      this.writeBehaviour = new InstructionDefaultWriteBehavior(this);
    }
  }
}
