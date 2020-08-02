import { Tab } from './../tab/tab.model';
import { InstructionWriteResult } from './instructionWriteResult.model';

export abstract class Instruction {
  public abstract name: string;

  public abstract writeOnTab(tab: Tab): InstructionWriteResult;

  public isMergeableInstruction(): boolean {
    return false;
  }
}
