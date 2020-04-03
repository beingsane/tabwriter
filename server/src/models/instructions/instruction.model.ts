import { InstructionWriteBehavior } from './instructionWriteBehavior.model';
import { InstructionDefaultWriteBehavior } from './instructionDefaultWriteBehavior.model';
import { OperationErrorManager } from '../errors/operationErrorManager.model';
import { Tab } from '../tab/tab.model';

export class Instruction {
  /**
   * Regex para extração de dados:
   * ^([a-z]+)\s*(\((.*)\))?\s*(\{(.*)\})? [gim] -> intruções método
   * ^(\d+)\-(.*) [gim] -> instrução padrão
   */
  private static readonly REGEX_METHOD_EXTRACTION = /^(\w*)(?=\s*(\(|\{|\[))/gm;

  private static extractMethodMetadata(instructionStr: string): RegExpExecArray | null {
    const methodMetadata = Instruction.REGEX_METHOD_EXTRACTION.exec(instructionStr);
    Instruction.REGEX_METHOD_EXTRACTION.lastIndex = 0;

    return methodMetadata;
  }

  writeBehaviour!: InstructionWriteBehavior;

  constructor(
    public readonly instructionStr: string,
    public readonly startsAt: number,
    public readonly endsAt: number,
  ) {
    this.setWriteBehavior();
  }

  public writeToTab(tab: Tab, errorReporter?: OperationErrorManager): void {
    this.writeBehaviour.writeToTab(tab, errorReporter);
  }

  private setWriteBehavior(): void {
    const instructionMethodMetadata = Instruction.extractMethodMetadata(this.instructionStr);
    if (instructionMethodMetadata !== null) {
      const methodName = instructionMethodMetadata[1].toUpperCase();
      switch (methodName) {
        default:
          this.writeBehaviour = new InstructionDefaultWriteBehavior(this);
      }
    } else {
      this.writeBehaviour = new InstructionDefaultWriteBehavior(this);
    }
  }
}
