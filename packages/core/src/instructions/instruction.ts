import { InstructionWriteResult } from './instructionWriteResult';
import { Tab } from '../tab/tab';

export abstract class Instruction {
  public abstract name: string;

  public abstract writeOnTab(tab: Tab): InstructionWriteResult;

  public isMergeableInstruction(): boolean {
    return false;
  }
}
