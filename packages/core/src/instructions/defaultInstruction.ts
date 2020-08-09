import { InstructionWriteResult } from './instructionWriteResult';
import { MergeableInstruction } from './mergeableInstruction';
import { Tab } from '../tab/tab';
import { TabBlockWriteInstruction } from '../tab/tabBlockWriteInstruction';

export class DefaultInstruction extends MergeableInstruction {
  public name = 'instrução típica';

  constructor(chord: number, note: string) {
    super(chord, note);
  }

  public writeOnTab(tab: Tab): InstructionWriteResult {
    return tab.writeInstruction(
      new TabBlockWriteInstruction(this.chord, this.note)
    );
  }
}
