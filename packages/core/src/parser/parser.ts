import { BracketsHelper } from '../helpers/brackets.helper';
import '../extensions/string.extensions';

export class ParseInstructionResult {
  constructor(
    public readonly method: string | null,
    public readonly args: string | null,
    public readonly targets: string | null
  ) {}
}

export class ReadInstructionResult {
  constructor(
    public readonly method: string | null,
    public readonly args: (string | number)[] | null,
    public readonly targets: ParserResult[] | null
  ) {}
}

export class ParserResult {
  constructor(
    public value: string,
    public readFromIdx: number,
    public readToIdx: number,
    public method: string | null,
    public args: (string | number)[] | null,
    public targets: ParserResult[] | null
  ) {}
}

export class Parser {
  public static readonly INSTRUCTIONS_SEPARATOR = ' ';
  public static readonly INSTRUCTIONS_ARGS_SEPARATOR = ',';
  public static readonly INSTRUCTIONS_ARGS_OPENING_BRACKET = '(';
  public static readonly INSTRUCTIONS_TARGETS_OPENING_BRACKET = '{';

  private static readonly INSTRUCTIONS_METHOD_REGEX_EXTRACTION = /^([a-z]+)(?!-)/gim;

  private static extractMethod(parsedInstruction: string): string | null {
    const methodRegexMatchResult = Parser.INSTRUCTIONS_METHOD_REGEX_EXTRACTION.exec(
      parsedInstruction
    );
    Parser.INSTRUCTIONS_METHOD_REGEX_EXTRACTION.lastIndex = 0;

    return methodRegexMatchResult ? methodRegexMatchResult[1] : null;
  }

  public parse(instructionsToParse: string): ParserResult[] {
    const result: ParserResult[] = [];

    let startIndex = 0;
    let instruction = null;
    do {
      instruction = this.parseNextInstruction(instructionsToParse, startIndex);

      if (instruction !== null) {
        result.push(instruction);
        startIndex = instruction.readToIdx + 1;
      }
    } while (instruction !== null);

    return result;
  }

  public async parseAsync(
    instructionsToParse: string
  ): Promise<ParserResult[]> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.parse(instructionsToParse));
      } catch (ex) {
        reject(ex);
      }
    });
  }

  private parseNextInstruction(
    instructionsToParse: string,
    fromIndex: number
  ): ParserResult | null {
    if (fromIndex > instructionsToParse.length - 1) return null;

    const instructionStartIndex = instructionsToParse.indexOfDifferent(
      Parser.INSTRUCTIONS_SEPARATOR,
      fromIndex
    );
    if (instructionStartIndex < 0) return null;

    const instructionEndIndex = this.indexOfInstructionEnd(
      instructionsToParse,
      instructionStartIndex
    );

    const parsedInstruction = instructionsToParse
      .slice(instructionStartIndex, instructionEndIndex + 1)
      .trim();
    const { method, args, targets } = this.readInstruction(
      parsedInstruction,
      instructionStartIndex
    );

    return new ParserResult(
      parsedInstruction,
      instructionStartIndex,
      instructionEndIndex,
      method,
      args,
      targets
    );
  }

  private indexOfInstructionEnd(
    instructionsToParse: string,
    instrStartIndex: number
  ): number {
    const nextSeparatorIndex = instructionsToParse.indexOf(
      Parser.INSTRUCTIONS_SEPARATOR,
      instrStartIndex
    );
    if (nextSeparatorIndex < 0) return instructionsToParse.length - 1;

    let endOfInstrIndex = this.correctEndForOpeningBracketsBefore(
      instructionsToParse,
      instrStartIndex,
      nextSeparatorIndex - 1
    );

    endOfInstrIndex = this.correctEndForOpeningBracketsAfter(
      instructionsToParse,
      instrStartIndex,
      endOfInstrIndex
    );

    return endOfInstrIndex;
  }

  private correctEndForOpeningBracketsBefore(
    instructionsToParse: string,
    instrStartIndex: number,
    toCheckInstrEndIndex: number
  ): number {
    const openingBracketsIndexes = BracketsHelper.openingBrackets
      .map((openingBracket) =>
        instructionsToParse.indexOf(openingBracket, instrStartIndex)
      )
      .filter((openingBracketIndex) => openingBracketIndex > 0);
    if (openingBracketsIndexes.length === 0) return toCheckInstrEndIndex;

    const firstOpeningBracketIndex = Math.min(...openingBracketsIndexes);
    if (firstOpeningBracketIndex > toCheckInstrEndIndex)
      return toCheckInstrEndIndex;

    const closingBracketIndex = BracketsHelper.indexOfMatchingClosingBracket(
      instructionsToParse,
      firstOpeningBracketIndex
    );
    if (closingBracketIndex < 0) return instructionsToParse.length - 1;

    return closingBracketIndex;
  }

  private correctEndForOpeningBracketsAfter(
    instructionsToParse: string,
    instrStartIndex: number,
    toCheckEndIndex: number
  ): number {
    if (toCheckEndIndex + 1 > instructionsToParse.length - 1)
      return toCheckEndIndex;

    const nextInstrStartIndex = instructionsToParse.indexOfDifferent(
      Parser.INSTRUCTIONS_SEPARATOR,
      toCheckEndIndex + 1
    );
    const nextInstrStartChar = instructionsToParse[nextInstrStartIndex];
    if (!BracketsHelper.isOpeningBracket(nextInstrStartChar))
      return toCheckEndIndex;

    const closingBracketIndex = BracketsHelper.indexOfMatchingClosingBracket(
      instructionsToParse,
      nextInstrStartIndex
    );
    if (closingBracketIndex < 0) return instructionsToParse.length - 1;

    return this.correctEndForOpeningBracketsAfter(
      instructionsToParse,
      instrStartIndex,
      closingBracketIndex
    );
  }

  private readInstruction(
    parsedInstruction: string,
    parsedInstructionStartIdx: number
  ): ReadInstructionResult {
    const { method, args, targets } = this.parseInstruction(parsedInstruction);

    const readArgs = args ? this.readInstructionArgs(args) : null;

    const readTargets = targets
      ? this.readInstructionTargets(
          targets,
          parsedInstruction,
          parsedInstructionStartIdx
        )
      : null;

    return new ReadInstructionResult(method, readArgs, readTargets);
  }

  private parseInstruction(parsedInstruction: string): ParseInstructionResult {
    const parsedMethod = Parser.extractMethod(parsedInstruction);
    const parsedArgs = BracketsHelper.getValueInsideBrackets(
      parsedInstruction,
      Parser.INSTRUCTIONS_ARGS_OPENING_BRACKET
    );

    const parsedTargets = BracketsHelper.getValueInsideBrackets(
      parsedInstruction,
      Parser.INSTRUCTIONS_TARGETS_OPENING_BRACKET
    );

    return new ParseInstructionResult(parsedMethod, parsedArgs, parsedTargets);
  }

  private readInstructionArgs(parsedArgs: string): (string | number)[] {
    return parsedArgs.split(Parser.INSTRUCTIONS_ARGS_SEPARATOR).map((arg) => {
      const argNumber = Number(arg);
      return isNaN(argNumber) ? arg.trim() : argNumber;
    });
  }

  private readInstructionTargets(
    parsedTargets: string,
    parsedInstruction: string,
    parsedInstructionStartIdx: number
  ): ParserResult[] {
    let readTargets = this.parse(parsedTargets);
    readTargets = this.updateInstructionTargetsIdxsReference(
      readTargets,
      parsedInstruction,
      parsedInstructionStartIdx
    );

    return readTargets;
  }

  private updateInstructionTargetsIdxsReference(
    targetsToUpdate: ParserResult[],
    parsedInstruction: string,
    parsedInstructionStartIdx: number
  ): ParserResult[] {
    return targetsToUpdate.map((target) => {
      target.readFromIdx =
        parsedInstructionStartIdx + parsedInstruction.indexOf(target.value);
      target.readToIdx = target.readFromIdx + target.value.length - 1;

      if (target.targets) {
        this.updateInstructionTargetsIdxsReference(
          target.targets,
          target.value,
          target.readFromIdx
        );
      }

      return target;
    });
  }
}
