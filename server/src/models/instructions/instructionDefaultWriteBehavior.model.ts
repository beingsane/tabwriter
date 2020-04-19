import { TabBlockWriteInstruction } from './../tab/tabBlock.model';
import { OperationErrorManager } from '../errors/operationErrorManager.model';
import { InstructionWriteBehavior } from './instructionWriteBehavior.model';
import { OperationContext } from '../../config/index.enum';
import { Tab } from '../tab/tab.model';

export class InstructionDefaultWriteBehavior extends InstructionWriteBehavior {
  protected context = OperationContext.instructionDefault;
  protected isInstructionsToApplyRequired = false;
  protected isChordAndNoteRequired = true;

  writeToTab(tab: Tab, errorReporter?: OperationErrorManager): void {
    if (!this.validateInstruction(errorReporter)) return;

    const chord = this.instruction.metadata.chord;
    const note = this.instruction.metadata.note;

    const writeInstruction = new TabBlockWriteInstruction(chord, note);
    const writeResult = tab.currentTabBlock.writeInstruction(writeInstruction);
    this.validateWriteResult(writeResult, errorReporter);
  }
}
