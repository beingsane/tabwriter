import { Instruction } from './instruction';
import { InstructionWriteResult } from './instructionWriteResult';

export class InvalidInstruction extends Instruction {
  public name = 'instrução';

  constructor(public readonly description: string) {
    super();
  }

  public writeOnTab(): InstructionWriteResult {
    return new InstructionWriteResult(false, this.description);
  }
}
