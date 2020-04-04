import { OperationErrorManager } from '../errors/operationErrorManager.model';
import { InstructionWriteBehavior } from './instructionWriteBehavior.model';
import { OperationContext } from '../../enums/index.enum';
import { InstructionOperationError } from '../errors/instructionOperationError.model';
import { Tab } from '../tab/tab.model';

export class InstructionDefaultWriteBehavior extends InstructionWriteBehavior {
  protected context = OperationContext.instructionDefault;

  writeToTab(tab: Tab, errorReporter?: OperationErrorManager): void {
    if (!this.validateChordAndNote(errorReporter)) return;

    const chord = this.instruction.metadata.chord;
    const note = this.instruction.metadata.note;
    const writeResult = tab.currentTabBlock.writeNoteOnChord(chord, note);

    if (!writeResult.success && errorReporter) {
      errorReporter.addError(
        new InstructionOperationError(this.instruction, writeResult.operation, this.context, writeResult.description),
      );
    }
  }

  private validateChordAndNote(errorReporter?: OperationErrorManager): boolean {
    let isValid = true;

    if (!this.instruction.metadata.chord || !this.instruction.metadata.note) {
      isValid = false;

      if (errorReporter) {
        const errorDescription = 'Não foi possível identificar a corda ou a nota indicados';
        errorReporter.addError(
          new InstructionOperationError(this.instruction, this.operation, this.context, errorDescription),
        );
      }
    }

    return isValid;
  }
}
