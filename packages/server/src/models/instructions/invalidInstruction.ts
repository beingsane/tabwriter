import { Instruction } from './instruction.model';
import { InstructionWriteResult } from './instructionWriteResult.model';

export class InvalidInstruction extends Instruction {
  public name = 'instrução';

  constructor(public readonly description: string) {
    super();
  }

  public writeOnTab(): InstructionWriteResult {
    return new InstructionWriteResult(false, this.description);
  }
}
