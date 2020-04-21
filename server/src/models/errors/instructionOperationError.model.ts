import { OperationError } from './operationError.model';

export class InstructionOperationError extends OperationError {
  constructor(
    public readonly source: string,
    public readonly position: number,
    public readonly name: string,
    description: string,
  ) {
    super(description);
  }

  public toString(): string {
    return `Erro ao ler ${this.name} < ${this.source} >, posição ${this.position}: ${this.description}.`;
  }
}
