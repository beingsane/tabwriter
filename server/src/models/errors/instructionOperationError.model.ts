import { OperationError } from './operationError.model';
import { Instruction } from '../instructions/instruction.model';
import { Operation, OperationContext } from '../../config/index.enum';

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

    const instructionStartIndex = this.instruction.parsingMetadata.startsAtIndex;
    const positionDescription = instructionStartIndex !== null ? `, posição ${instructionStartIndex}` : '';

    return `Erro ao ${operationName} ${operationContextName}${positionDescription}: < ${this.instruction.source} >. ${this.description}.`;
  }
}
