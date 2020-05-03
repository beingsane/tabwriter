import { Instruction } from './instruction.model';
import { InstructionWriteResult } from './instructionWriteResult.model';
import { Tab } from '../tab/tab.model';

export class SetSpacingInstruction extends Instruction {
  public name = 'instrução space';

  constructor(public space: number) {
    super();
  }

  public writeOnTab(tab: Tab): InstructionWriteResult {
    tab.rowsSpacing = this.space;
    return new InstructionWriteResult(true);
  }
}
