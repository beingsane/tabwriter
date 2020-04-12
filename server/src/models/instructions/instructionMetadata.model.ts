import { ParserServiceConfig } from './../../services/parser.service';

export class InstructionParsingMetadata {
  constructor(
    public readonly startsAtIndex: number | null = null,
    public readonly endsAtIndex: number | null = null,
    public readonly parserConfig: ParserServiceConfig | null = null,
  ) {}
}

export interface InstructionMetadata {
  isRead: boolean;
  readFailDescription: string;
  isMethod: boolean;
  methodName: string;
  methodParams: string[] | null;
  methodInstructionsToApply: string | null;
  chord: number;
  note: string;
}

class MethodInstructionMetadata implements InstructionMetadata {
  public static readonly METHOD_PARAMS_SEPARATOR = ',';

  public readonly isRead = true;
  public readonly isMethod = true;

  public readonly methodName: string;
  public readonly methodParams: string[] | null = null;
  public readonly methodInstructionsToApply: string | null;

  public readonly readFailDescription!: string;
  public readonly chord!: number;
  public readonly note!: string;

  constructor(methodName: string, methodParams: string | null = null, methodInstructionsToApply: string | null = null) {
    this.methodName = methodName.trim();
    this.methodParams = methodParams
      ? methodParams.split(MethodInstructionMetadata.METHOD_PARAMS_SEPARATOR).map(param => param.trim())
      : null;
    this.methodInstructionsToApply = methodInstructionsToApply ? methodInstructionsToApply.trim() : null;
  }
}

class NonMethodInstructionMetadata implements InstructionMetadata {
  public readonly isRead = true;
  public readonly isMethod = false;

  public readonly chord: number;
  public readonly note: string;

  public readonly readFailDescription!: string;
  public readonly methodName!: string;
  public readonly methodParams!: string[] | null;
  public readonly methodInstructionsToApply!: string | null;

  constructor(chord: string, note: string) {
    this.chord = parseInt(chord, 10);
    this.note = note.trim();
  }
}

class ReadFailInstructionMetadata implements InstructionMetadata {
  public readonly isRead = false;
  public readonly isMethod!: boolean;
  public readonly methodName!: string;
  public readonly methodParams!: string[] | null;
  public readonly methodInstructionsToApply!: string | null;
  public readonly chord!: number;
  public readonly note!: string;

  constructor(public readonly readFailDescription: string) {}
}

export abstract class InstructionMetadataFactory {
  private static readonly NON_METHOD_REGEX_EXTRACT_METADATA = /^(\d+)\-(.*)/gm;
  private static readonly METHOD_REGEX_EXTRACT_METADATA = /^([a-z]+)\s*(\((.*)\))?\s*(\{(.*)\})?/gim;

  public static getInstructionMetadata(instruction: string): InstructionMetadata {
    const trimedInstruction = instruction.trim();
    const methodRegexMatchResult = InstructionMetadataFactory.execMethodRegexExtractMetadata(trimedInstruction);
    if (methodRegexMatchResult !== null) {
      return InstructionMetadataFactory.getMethodInstructionMetadata(methodRegexMatchResult);
    }

    const nonMethodRegexMatchResult = InstructionMetadataFactory.execNonMethodRegexExtractMetadata(trimedInstruction);
    if (nonMethodRegexMatchResult !== null) {
      return InstructionMetadataFactory.getNonMethodInstructionMetadata(nonMethodRegexMatchResult);
    }

    return InstructionMetadataFactory.getFailedIntructionMetadataRead(
      'Nenhum padrão identificado para a leitura da instrução',
    );
  }

  private static execMethodRegexExtractMetadata(instructionStr: string): RegExpExecArray | null {
    const methodRegexMatchResult = InstructionMetadataFactory.METHOD_REGEX_EXTRACT_METADATA.exec(instructionStr);
    InstructionMetadataFactory.METHOD_REGEX_EXTRACT_METADATA.lastIndex = 0;

    return methodRegexMatchResult;
  }

  private static execNonMethodRegexExtractMetadata(instructionStr: string): RegExpExecArray | null {
    const nonMethodRegexMatchResult = InstructionMetadataFactory.NON_METHOD_REGEX_EXTRACT_METADATA.exec(instructionStr);
    InstructionMetadataFactory.NON_METHOD_REGEX_EXTRACT_METADATA.lastIndex = 0;

    return nonMethodRegexMatchResult;
  }

  private static getMethodInstructionMetadata(regexMatchResult: RegExpExecArray): MethodInstructionMetadata {
    return new MethodInstructionMetadata(regexMatchResult[1], regexMatchResult[3], regexMatchResult[5]);
  }

  private static getNonMethodInstructionMetadata(regexMatchResult: RegExpExecArray): NonMethodInstructionMetadata {
    return new NonMethodInstructionMetadata(regexMatchResult[1], regexMatchResult[2]);
  }

  private static getFailedIntructionMetadataRead(readFailDescription: string): ReadFailInstructionMetadata {
    return new ReadFailInstructionMetadata(readFailDescription);
  }
}
