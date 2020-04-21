import { OperationResult } from '../operationResult.model';
import { Tab } from './../tab/tab.model';

export class InstructionWriteResult extends OperationResult {}

export abstract class Instruction {
  public abstract name: string;

  public abstract writeOnTab(tab: Tab): InstructionWriteResult;

  public isMergeableInstruction(): boolean {
    return false;
  }
}
