import { Instruction, InstructionWriteResult } from './instruction.model';
import { Tab } from '../tab/tab.model';
import { TabBlockWriteInstruction } from '../tab/tabBlock.model';
import { MergeableInstruction } from './mergeableInstruction.model';

export class MergeInstruction extends Instruction {
  public name = 'instrução merge';

  constructor(public instructionsToMerge: MergeableInstruction[]) {
    super();
  }

  public writeOnTab(tab: Tab): InstructionWriteResult {
    const writeInstructions = this.instructionsToMerge.map(
      instruction => new TabBlockWriteInstruction(instruction.chord, instruction.note),
    );

    return tab.writeInstructionsMerged(writeInstructions);
  }
}
