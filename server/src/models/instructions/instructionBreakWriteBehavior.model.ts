import { OperationErrorManager } from '../errors/operationErrorManager.model';
import { InstructionWriteBehavior } from './instructionWriteBehavior.model';
import { OperationContext } from '../../config/index.enum';
import { Tab } from '../tab/tab.model';

export class InstructionBreakWriteBehavior extends InstructionWriteBehavior {
  protected context = OperationContext.instructionBreak;
  protected isInstructionsToApplyRequired = false;
  protected isChordAndNoteRequired = false;

  public writeToTab(tab: Tab, errorReporter?: OperationErrorManager): void {
    if (!this.validateInstruction(errorReporter)) return;
    tab.addTabBlock();
  }
}
