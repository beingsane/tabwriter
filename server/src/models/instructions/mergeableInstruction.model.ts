import { Instruction } from './instruction.model';

export abstract class MergeableInstruction extends Instruction {
  constructor(public readonly chord: number, public readonly note: string) {
    super();
  }

  public isMergeableInstruction(): boolean {
    return true;
  }
}
