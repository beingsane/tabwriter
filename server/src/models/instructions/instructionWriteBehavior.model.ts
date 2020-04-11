import { Tab } from '../tab/tab.model';
import { Instruction } from './instruction.model';
import { Operation, OperationContext } from '../../config/index.enum';
import { OperationErrorManager } from '../errors/operationErrorManager.model';

export abstract class InstructionWriteBehavior {
  protected operation = Operation.leitura;

  protected abstract context: OperationContext;

  constructor(protected instruction: Instruction) {}

  public abstract writeToTab(tab: Tab, errorReporter?: OperationErrorManager): void;
}
