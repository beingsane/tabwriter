import { InstructionWriteBehavior } from './instructionWriteBehavior.model';
import { OperationContext } from '../../config/index.enum';
import { Tab } from '../tab/tab.model';

export class InstructionBreakWriteBehavior extends InstructionWriteBehavior {
  protected context = OperationContext.instructionBreak;

  public writeToTab(tab: Tab): void {
    tab.addTabBlock();
  }
}
