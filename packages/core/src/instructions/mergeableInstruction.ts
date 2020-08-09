import { Instruction } from './instruction';

export abstract class MergeableInstruction extends Instruction {
  constructor(public readonly chord: number, public readonly note: string) {
    super();
  }

  public isMergeableInstruction(): boolean {
    return true;
  }
}
