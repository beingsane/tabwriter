import { Instruction } from './instruction.model';
import { InstructionWriteResult } from './instructionWriteResult.model';
import { Tab } from '../tab/tab.model';

export class BreakInstruction extends Instruction {
  public name = 'instrução break';

  public writeOnTab(tab: Tab): InstructionWriteResult {
    tab.addTabBlock();
    return new InstructionWriteResult(true);
  }
}
