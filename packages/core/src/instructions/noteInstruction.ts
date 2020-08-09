import { Instruction } from './instruction';
import { InstructionWriteResult } from './instructionWriteResult';
import { Tab } from '../tab/tab';

export class NoteInstruction extends Instruction {
  public name = 'instrução note';

  constructor(public note: string) {
    super();
  }

  public writeOnTab(tab: Tab): InstructionWriteResult {
    return tab.writeFooter(this.note);
  }
}
