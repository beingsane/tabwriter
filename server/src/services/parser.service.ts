import { Instruction } from './../models/instructions/instruction.model';
import { InstructionParsingMetadata } from '../models/instructions/instructionMetadata.model';
import { BracketsHelper } from '../utils/brackets.helper';
import '../extensions/string.extensions';

export class ParserServiceConfig {
  public static readonly DEFAULT_INSTRUCTIONS_SEPARATOR = ' ';

  private _instructionsSeparator = ParserServiceConfig.DEFAULT_INSTRUCTIONS_SEPARATOR;
  get instructionsSeparator(): string {
    return this._instructionsSeparator;
  }
  set instructionsSeparator(value: string) {
    if (value.length !== 1)
      throw Error(`[${ParserServiceConfig.name}] A instructions separator must have only one character`);

    this._instructionsSeparator = value;
  }
}

export class ParserService {
  public instructionsStr: string;

  constructor(instructionsStr: string, public readonly config = new ParserServiceConfig()) {
    this.instructionsStr = instructionsStr.trim();
  }

  public parse(): Instruction[] {
    let startIndex = 0;
    const instructions: Instruction[] = [];

    while (true) {
      const instruction = this.extractInstruction(startIndex);

      if (instruction === null) break;

      if (instruction.parsingMetadata.endsAtIndex === null)
        throw Error(`[${ParserServiceConfig.name}] Unable to read the end position of the last extracted instruction`);

      instructions.push(instruction);
      startIndex = instruction.parsingMetadata.endsAtIndex + 1;
    }

    return instructions;
  }

  public async parseAsync(): Promise<Instruction[]> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.parse());
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public extractInstruction(fromIndex: number): Instruction | null {
    if (fromIndex > this.instructionsStr.length - 1) return null;

    const startInstrIndex = this.instructionsStr.indexOfDifferent(this.config.instructionsSeparator, fromIndex);

    const endInstrIndex = this.indexOfInstructionEnd(startInstrIndex);

    return new Instruction(
      this.instructionsStr.slice(startInstrIndex, endInstrIndex + 1),
      new InstructionParsingMetadata(startInstrIndex, endInstrIndex, this.config),
    );
  }

  private indexOfInstructionEnd(instrStartIndex: number): number {
    const nextSeparatorIndex = this.instructionsStr.indexOf(this.config.instructionsSeparator, instrStartIndex);
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

    const nextInstrStartIndex = this.instructionsStr.indexOfDifferent(
      this.config.instructionsSeparator,
      toCheckEndIndex + 1,
    );
    const nextInstrStartChar = this.instructionsStr[nextInstrStartIndex];
    if (!BracketsHelper.isOpeningBracket(nextInstrStartChar)) return toCheckEndIndex;

    const closingBracketIndex = BracketsHelper.indexOfMatchingClosingBracket(this.instructionsStr, nextInstrStartIndex);
    if (closingBracketIndex < 0) return this.instructionsStr.length - 1;

    return this.correctEndForOpeningBracketsAfter(instrStartIndex, closingBracketIndex);
  }
}
