import { Instruction } from './instruction.model';
import { InstructionWriteResult } from './instructionWriteResult.model';
import { Tab } from '../tab/tab.model';

export class RepeatInstruction extends Instruction {
  public name = 'instrução repeat';

  constructor(public repetitions: number, public instructionsToRepeat: Instruction[]) {
    super();
  }

  public writeOnTab(tab: Tab): InstructionWriteResult {
    const writeErrors: InstructionWriteResult[] = [];

    for (let i = 0; i < this.repetitions; i++) {
      this.instructionsToRepeat.forEach((instruction) => {
        const result = instruction.writeOnTab(tab);

        if (!result.success && i === 0) {
          writeErrors.push(result);
        }
      });
    }

    return writeErrors.length > 0
      ? new InstructionWriteResult(false, writeErrors.map((err) => err.description).join('. '))
      : new InstructionWriteResult(true);
  }
}
