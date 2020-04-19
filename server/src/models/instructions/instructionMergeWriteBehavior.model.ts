import { TabBlockWriteInstruction } from './../tab/tabBlock.model';
import { OperationErrorManager } from '../errors/operationErrorManager.model';
import { InstructionWriteBehavior } from './instructionWriteBehavior.model';
import { OperationContext } from '../../config/index.enum';
import { Tab } from '../tab/tab.model';
import { Instruction } from './instruction.model';
import { InstructionOperationError } from '../errors/instructionOperationError.model';
import { InstructionDefaultWriteBehavior } from './instructionDefaultWriteBehavior.model';

export class InstructionMergeWriteBehavior extends InstructionWriteBehavior {
  public static readonly MERGEABLE_INSTRUCTION_BEHAVIORS = [InstructionDefaultWriteBehavior];

  public static isInstructionMergeable(instruction: Instruction): boolean {
    let isMergeable = false;

    InstructionMergeWriteBehavior.MERGEABLE_INSTRUCTION_BEHAVIORS.forEach(mergeableType => {
      if (instruction.writeBehaviour instanceof mergeableType) {
        isMergeable = true;
      }
    });

    return isMergeable;
  }

  protected context = OperationContext.instructionMerge;
  protected isInstructionsToApplyRequired = true;
  protected isChordAndNoteRequired = false;

  public writeToTab(tab: Tab, errorReporter?: OperationErrorManager): void {
    if (!this.validateInstruction(errorReporter)) return;

    const instructionsToMerge = this.instruction.parseInstructionsToApply();
    if (!this.validateInstructionsToMerge(instructionsToMerge, errorReporter)) return;

    const writeInstructions = instructionsToMerge.map(
      instruction => new TabBlockWriteInstruction(instruction.metadata.chord, instruction.metadata.note),
    );
    const writeResult = tab.currentTabBlock.writeInstructionsMerged(writeInstructions);
    this.validateWriteResult(writeResult, errorReporter);
  }

  private validateInstructionsToMerge(instructions: Instruction[], errorReporter?: OperationErrorManager): boolean {
    let isValid = true;

    const unmergeableInstructions = instructions.filter(
      instruction => !InstructionMergeWriteBehavior.isInstructionMergeable(instruction),
    );

    if (unmergeableInstructions.length > 0) {
      isValid = false;
      if (errorReporter) {
        const unmergeableInstructionsList = `< ${unmergeableInstructions.map(instr => instr.source).join(' >, < ')} >`;
        const errorDescription = `As seguintes instruções são inválidas na instrução merge: ${unmergeableInstructionsList}`;
        errorReporter.addError(
          new InstructionOperationError(this.instruction, this.operation, this.context, errorDescription),
        );
      }
    }

    return isValid;
  }
}
