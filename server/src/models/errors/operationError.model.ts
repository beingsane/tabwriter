import { Operation, OperationContext } from '../../config/index.enum';

export abstract class OperationError {
  public static readonly mapOperation2Name: Record<Operation, string> = {
    [Operation.leitura]: 'ler',
    [Operation.escrita]: 'escrever',
  };

  public static readonly mapOperationContext2Name: Record<OperationContext, string> = {
    [OperationContext.instructionGeneral]: 'instrução',
    [OperationContext.instructionDefault]: 'instrução típica',
    [OperationContext.instructionBreak]: 'instrução break',
  };

  constructor(
    protected operation: Operation,
    protected operationContext: OperationContext,
    protected description: string,
  ) {}

  public abstract toString(): string;
}
