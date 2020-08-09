import { Instruction } from './instruction';
import { InstructionWriteResult } from './instructionWriteResult';
import { MergeableInstruction } from './mergeableInstruction';
import { Tab } from '../tab/tab';
import { TabBlockWriteInstruction } from '../tab/tabBlockWriteInstruction';

export class MergeInstruction extends Instruction {
  public name = 'instrução merge';

  constructor(public instructionsToMerge: MergeableInstruction[]) {
    super();
  }

  public writeOnTab(tab: Tab): InstructionWriteResult {
    const writeInstructions = this.instructionsToMerge.map(
      (instruction) =>
        new TabBlockWriteInstruction(instruction.chord, instruction.note)
    );

    return tab.writeInstructionsMerged(writeInstructions);
  }
}
