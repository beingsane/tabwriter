import { OperationError } from './operationError.model';
import { Instruction } from '../instructions/instruction.model';
import { Operation, OperationContext } from '../../enums/index.enum';

export class InstructionOperationError extends OperationError {
  constructor(
    public instruction: Instruction,
    operation: Operation,
    operationContext: OperationContext,
    description: string,
  ) {
    super(operation, operationContext, description);
  }

  public toString(): string {
    const operationName = OperationError.mapOperation2Name[this.operation];
    const operationContextName = OperationError.mapOperationContext2Name[this.operationContext];
    return `Erro ao ${operationName} ${operationContextName}, posição ${this.instruction.startsAt}: < ${this.instruction.instructionStr} >. ${this.description}.`;
  }
}
