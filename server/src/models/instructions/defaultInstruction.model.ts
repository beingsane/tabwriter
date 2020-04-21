import { Tab } from '../tab/tab.model';
import { TabBlockWriteInstruction } from '../tab/tabBlock.model';
import { MergeableInstruction } from './mergeableInstruction.model';
import { InstructionWriteResult } from './instruction.model';

export class DefaultInstruction extends MergeableInstruction {
  public name = 'instrução típica';

  constructor(chord: number, note: string) {
    super(chord, note);
  }

  public writeOnTab(tab: Tab): InstructionWriteResult {
    return tab.writeInstruction(new TabBlockWriteInstruction(this.chord, this.note));
  }
}
