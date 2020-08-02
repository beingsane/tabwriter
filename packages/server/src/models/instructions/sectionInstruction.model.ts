import { Instruction } from './instruction.model';
import { InstructionWriteResult } from './instructionWriteResult.model';
import { Tab } from '../tab/tab.model';

export class SectionInstruction extends Instruction {
  public name = 'instrução section';

  constructor(public sectionName: string) {
    super();
  }

  public writeOnTab(tab: Tab): InstructionWriteResult {
    return tab.writeHeader(this.sectionName);
  }
}
