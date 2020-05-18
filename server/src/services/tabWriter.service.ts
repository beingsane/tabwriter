import { ParserResult } from '../models/parser/parserResult.model';
import { InstructionFactory } from '../models/instructions/instructionFactory.model';
import { Parser } from '../models/parser/parser.model';
import { Tab } from '../models/tab/tab.model';

export interface TabWriterInstructions {
  instructions: string;
  rowsQuantity: number;
  rowsSpacing: number;
}

interface InstructionWriteResult {
  success: boolean;
  instruction: string;
  readFromIdx: number;
  readToIdx: number;
  name: string;
  error: null | string;
}

export interface TabWriterResult {
  success: boolean;
  tab: string[][];
  instructionsResults: InstructionWriteResult[];
}

export class TabWriterService {
  public static writeTab({ instructions, rowsQuantity, rowsSpacing }: TabWriterInstructions): TabWriterResult {
    let successBuild = true;

    const parser = new Parser();
    const parserResult = parser.parse(instructions);

    const tab = new Tab({ rowsQuantity, rowsSpacing });
    const instructionsResults: InstructionWriteResult[] = [];

    parserResult.forEach(parsedInstruction => {
      const tabWriterInstructionResult = TabWriterService.writeParsedInstructionToTab(parsedInstruction, tab);
      instructionsResults.push(tabWriterInstructionResult);

      if (successBuild && !tabWriterInstructionResult.success) successBuild = false;
    });

    return {
      success: successBuild,
      tab: tab.blocks,
      instructionsResults,
    };
  }

  public static writeParsedInstructionToTab(parsedInstruction: ParserResult, tab: Tab): InstructionWriteResult {
    const instruction = InstructionFactory.getInstruction(parsedInstruction);
    const instructionWriteResult = instruction.writeOnTab(tab);

    return {
      success: instructionWriteResult.success,
      instruction: parsedInstruction.value,
      readFromIdx: parsedInstruction.readFromIdx,
      readToIdx: parsedInstruction.readToIdx,
      name: instruction.name,
      error: instructionWriteResult.description ? instructionWriteResult.description : null,
    };
  }
}
