import { Instruction, InstructionWriteResult } from './instruction.model';
import { Tab } from '../tab/tab.model';

export class NoteInstruction extends Instruction {
  public name = 'instrução note';

  constructor(public note: string) {
    super();
  }

  public writeOnTab(tab: Tab): InstructionWriteResult {
    return tab.writeFooter(this.note);
  }
}
