export class InstructionMetadata {
  private static readonly NON_METHOD_REGEX_EXTRACT_METADATA = /^(\d+)\-(.*)/gm;
  private static readonly METHOD_REGEX_EXTRACT_METADATA = /^([a-z]+)\s*(\((.*)\))?\s*(\{(.*)\})?/gim;
  public static readonly METHOD_PARAMS_SEPARATOR = ',';

  public static getInstructionMetadata(instruction: string): InstructionMetadata {
    const trimedInstruction = instruction.trim();
    const methodRegexMatchResult = InstructionMetadata.execMethodRegexExtractMetadata(trimedInstruction);
    if (methodRegexMatchResult !== null) {
      return InstructionMetadata.getMethodInstructionMetadata(methodRegexMatchResult);
    }

    const nonMethodRegexMatchResult = InstructionMetadata.execNonMethodRegexExtractMetadata(trimedInstruction);
    if (nonMethodRegexMatchResult !== null) {
      return InstructionMetadata.getNonMethodInstructionMetadata(nonMethodRegexMatchResult);
    }

    return InstructionMetadata.getFailedIntructionMetadataRead(
      'Nenhum padrão identificado para a leitura da instrução',
    );
  }

  private static execMethodRegexExtractMetadata(instructionStr: string): RegExpExecArray | null {
    const methodRegexMatchResult = InstructionMetadata.METHOD_REGEX_EXTRACT_METADATA.exec(instructionStr);
    InstructionMetadata.METHOD_REGEX_EXTRACT_METADATA.lastIndex = 0;

    return methodRegexMatchResult;
  }

  private static execNonMethodRegexExtractMetadata(instructionStr: string): RegExpExecArray | null {
    const nonMethodRegexMatchResult = InstructionMetadata.NON_METHOD_REGEX_EXTRACT_METADATA.exec(instructionStr);
    InstructionMetadata.NON_METHOD_REGEX_EXTRACT_METADATA.lastIndex = 0;

    return nonMethodRegexMatchResult;
  }

  private static getMethodInstructionMetadata(regexMatchResult: RegExpExecArray): InstructionMetadata {
    const instructionMetadata = new InstructionMetadata();

    instructionMetadata.isMethod = true;
    instructionMetadata.methodName = regexMatchResult[1].trim();

    if (regexMatchResult[3]) {
      instructionMetadata.methodParams = regexMatchResult[3]
        .split(InstructionMetadata.METHOD_PARAMS_SEPARATOR)
        .map(param => param.trim());
    }

    if (regexMatchResult[5]) {
      instructionMetadata.methodInstructionsToApply = regexMatchResult[5].trim();
    }

    instructionMetadata.isRead = true;
    return instructionMetadata;
  }

  private static getNonMethodInstructionMetadata(regexMatchResult: RegExpExecArray): InstructionMetadata {
    const instructionMetadata = new InstructionMetadata();

    instructionMetadata.isMethod = false;
    instructionMetadata.chord = parseInt(regexMatchResult[1], 10);
    instructionMetadata.note = regexMatchResult[2].trim();
    instructionMetadata.isRead = true;

    return instructionMetadata;
  }

  private static getFailedIntructionMetadataRead(readFailDescription: string): InstructionMetadata {
    const instructionMetadata = new InstructionMetadata();

    instructionMetadata.isRead = false;
    instructionMetadata.readFailDescription = readFailDescription;

    return instructionMetadata;
  }

  private constructor() {}

  isRead = false;
  readFailDescription!: string;
  isMethod!: boolean;
  methodName!: string;
  methodParams!: string[];
  methodInstructionsToApply!: string;
  chord!: number;
  note!: string;
}
