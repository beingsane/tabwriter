import { Tab } from '../tab/tab.model';
import { TabBlockWriteResultDto } from './../tab/tabBlock.model';
import { Instruction } from './instruction.model';
import { Operation, OperationContext } from '../../config/index.enum';
import { OperationErrorManager } from '../errors/operationErrorManager.model';
import { InstructionOperationError } from '../errors/instructionOperationError.model';

export abstract class InstructionWriteBehavior {
  protected operation = Operation.leitura;

  protected abstract context: OperationContext;
  protected abstract isInstructionsToApplyRequired: boolean;
  protected abstract isChordAndNoteRequired: boolean;

  constructor(protected instruction: Instruction) {}

  public abstract writeToTab(tab: Tab, errorReporter?: OperationErrorManager): void;

  protected validateInstruction(errorReporter?: OperationErrorManager): boolean {
    return this.validateChordAndNote(errorReporter) && this.validateInstructionsToApply(errorReporter);
  }

  protected validateWriteResult(writeResult: TabBlockWriteResultDto, errorReporter?: OperationErrorManager): boolean {
    if (!writeResult.success && errorReporter) {
      errorReporter.addError(
        new InstructionOperationError(this.instruction, writeResult.operation, this.context, writeResult.description),
      );
    }

    return writeResult.success;
  }

  private validateChordAndNote(errorReporter?: OperationErrorManager): boolean {
    let isValid = true;

    if (
      this.isChordAndNoteRequired &&
      (this.instruction.metadata.chord === undefined || this.instruction.metadata.note === undefined)
    ) {
      isValid = false;

      if (errorReporter) {
        const errorDescription = 'Não foi possível identificar a corda ou a nota indicados';
        errorReporter.addError(
          new InstructionOperationError(this.instruction, this.operation, this.context, errorDescription),
        );
      }
    }

    return isValid;
  }

  private validateInstructionsToApply(errorReporter?: OperationErrorManager): boolean {
    let isValid = true;

    if (this.isInstructionsToApplyRequired && !this.instruction.metadata.methodInstructionsStrToApply) {
      isValid = false;
      if (errorReporter) {
        const errorDescription = 'Nenhuma instrução indicada para aplicação da operação';
        errorReporter.addError(
          new InstructionOperationError(this.instruction, this.operation, this.context, errorDescription),
        );
      }
    }

    return isValid;
  }
}
