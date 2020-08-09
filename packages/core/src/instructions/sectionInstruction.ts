import { Instruction } from './instruction';
import { InstructionWriteResult } from './instructionWriteResult';
import { Tab } from '../tab/tab';

export class SectionInstruction extends Instruction {
  public name = 'instrução section';

  constructor(public sectionName: string) {
    super();
  }

  public writeOnTab(tab: Tab): InstructionWriteResult {
    return tab.writeHeader(this.sectionName);
  }
}
