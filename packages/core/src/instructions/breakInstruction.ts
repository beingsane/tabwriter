import { Instruction } from './instruction';
import { InstructionWriteResult } from './instructionWriteResult';
import { Tab } from '../tab/tab';

export class BreakInstruction extends Instruction {
  public name = 'instrução break';

  public writeOnTab(tab: Tab): InstructionWriteResult {
    tab.addTabBlock();
    return new InstructionWriteResult(true);
  }
}
