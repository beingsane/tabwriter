import { Instruction } from './instruction';
import { InstructionWriteResult } from './instructionWriteResult';
import { Tab } from '../tab/tab';

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
