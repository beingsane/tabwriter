import { Instruction } from './../models/instructions/instruction.model';
import { BracketsHelper } from '../utils/brackets.helper';
import '../extensions/string.extensions';

interface ParserServiceConfig {
  instructionsSeparator: string;
}

export class ParserService {
  public static DEFAULT_INSTRUCTIONS_SEPARATOR = ' ';

  private _instructionsSeparator = ParserService.DEFAULT_INSTRUCTIONS_SEPARATOR;
  get instructionsSeparator(): string {
    return this._instructionsSeparator;
  }
  set instructionsSeparator(value: string) {
    if (value.length !== 1) throw Error(`A instructions separator must have only one character`);
    this._instructionsSeparator = value;
  }

  public instructionsStr: string;
  public instructions: Instruction[] = [];

  constructor(instructionsStr: string, parserConfig?: ParserServiceConfig) {
    this.instructionsStr = instructionsStr.trim();

    if (parserConfig?.instructionsSeparator) this.instructionsSeparator = parserConfig.instructionsSeparator;
  }

  public parse(): void {
    let startIndex = 0;
    const instructions: Instruction[] = [];

    while (true) {
      const instruction = this.extractInstruction(startIndex);
      if (instruction === null) break;

      instructions.push(instruction);
      startIndex = instruction.endsAt + 1;
    }

    this.instructions = instructions;
  }

  public async parseAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.parse());
      } catch (ex) {
        reject(ex);
      }
    });
  }

  private extractInstruction(fromIndex: number): Instruction | null {
    if (fromIndex > this.instructionsStr.length - 1) return null;

    const startInstrIndex = this.instructionsStr.indexOfDifferent(this.instructionsSeparator, fromIndex);

    const endInstrIndex = this.indexOfInstructionEnd(startInstrIndex);

    return new Instruction(
      this.instructionsStr.slice(startInstrIndex, endInstrIndex + 1),
      startInstrIndex,
      endInstrIndex,
    );
  }

  private indexOfInstructionEnd(instrStartIndex: number): number {
    const nextSeparatorIndex = this.instructionsStr.indexOf(this.instructionsSeparator, instrStartIndex);
    if (nextSeparatorIndex < 0) return this.instructionsStr.length - 1;

    let endOfInstrIndex = this.correctEndForOpeningBracketsBefore(instrStartIndex, nextSeparatorIndex - 1);
    endOfInstrIndex = this.correctEndForOpeningBracketsAfter(instrStartIndex, endOfInstrIndex);

    return endOfInstrIndex;
  }

  private correctEndForOpeningBracketsBefore(instrStartIndex: number, toCheckInstrEndIndex: number): number {
    const openingBracketsIndexes = BracketsHelper.openingBrackets
      .map(openingBracket => this.instructionsStr.indexOf(openingBracket, instrStartIndex))
      .filter(openingBracketIndex => openingBracketIndex > 0);
    if (openingBracketsIndexes.length === 0) return toCheckInstrEndIndex;

    const firstOpeningBracketIndex = Math.min(...openingBracketsIndexes);
    if (firstOpeningBracketIndex > toCheckInstrEndIndex) return toCheckInstrEndIndex;

    return BracketsHelper.indexOfMatchingClosingBracket(this.instructionsStr, firstOpeningBracketIndex);
  }

  private correctEndForOpeningBracketsAfter(instrStartIndex: number, toCheckEndIndex: number): number {
    if (toCheckEndIndex + 1 > this.instructionsStr.length - 1) return toCheckEndIndex;

    const nextInstrStartIndex = this.instructionsStr.indexOfDifferent(this.instructionsSeparator, toCheckEndIndex + 1);
    const nextInstrStartChar = this.instructionsStr[nextInstrStartIndex];
    if (!BracketsHelper.isOpeningBracket(nextInstrStartChar)) return toCheckEndIndex;

    const closingBracketIndex = BracketsHelper.indexOfMatchingClosingBracket(this.instructionsStr, nextInstrStartIndex);
    if (closingBracketIndex < 0) return this.instructionsStr.length - 1;

    return this.correctEndForOpeningBracketsAfter(instrStartIndex, closingBracketIndex);
  }
}
