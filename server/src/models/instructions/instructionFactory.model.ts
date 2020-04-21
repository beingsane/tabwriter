import { MergeableInstruction } from './mergeableInstruction.model';
import { MergeInstruction } from './mergeInstruction.model';
import { BreakInstruction } from './breakInstruction.model';
import { DefaultInstruction } from './defaultInstruction.model';
import { ParserResult } from '../../services/parser.service';
import { Instruction } from './instruction.model';
import { InvalidInstruction } from './invalidInstruction';

interface ChordAndNoteExtractionResult {
  chord: number | null;
  note: string | null;
}

export class InstructionFactory {
  private static readonly CHORD_AND_NOTE_REGEX_EXTRACTION = /^(\d+)\-(.*)/gm;

  private static extractChordAndNote(instructionSource: string): ChordAndNoteExtractionResult {
    const chordAndNoteRegexMatchResult = InstructionFactory.CHORD_AND_NOTE_REGEX_EXTRACTION.exec(instructionSource);
    InstructionFactory.CHORD_AND_NOTE_REGEX_EXTRACTION.lastIndex = 0;

    let chord = null,
      note = null;
    if (chordAndNoteRegexMatchResult) {
      const chordResult = chordAndNoteRegexMatchResult[1];
      chord = Number(chordResult);

      const noteResult = chordAndNoteRegexMatchResult[2];
      note = noteResult || null;
    }

    return { chord, note };
  }

  public static getInstruction(parsedInstructionResult: ParserResult): Instruction {
    switch (parsedInstructionResult.method?.toUpperCase()) {
      case 'BREAK':
        return new BreakInstruction();
      case 'M':
      case 'MERGE':
        return InstructionFactory.getMergeInstruction(parsedInstructionResult);
      default:
        return InstructionFactory.getDefaultInstruction(parsedInstructionResult);
    }
  }

  private static getDefaultInstruction(parsedInstructionResult: ParserResult): Instruction {
    const { chord, note } = InstructionFactory.extractChordAndNote(parsedInstructionResult.value);
    if (chord !== null && note !== null) {
      return new DefaultInstruction(chord, note);
    } else {
      return new InvalidInstruction('Instrução inválida');
    }
  }

  private static getMergeInstruction(parsedInstructionResult: ParserResult): Instruction {
    if (!parsedInstructionResult.targets || parsedInstructionResult.targets.length === 0)
      return new InvalidInstruction('Nenhuma instrução indicada para aplicação da instrução merge');

    const unmergeableTargets: ParserResult[] = [];
    const mergeableInstructions: MergeableInstruction[] = [];
    parsedInstructionResult.targets.forEach(target => {
      const instruction = InstructionFactory.getInstruction(target);
      instruction.isMergeableInstruction()
        ? mergeableInstructions.push(instruction as MergeableInstruction)
        : unmergeableTargets.push(target);
    });

    if (unmergeableTargets.length > 0) {
      const unmergeableTargetsDesc = `< ${unmergeableTargets.map(target => target.value).join(' >, < ')} >`;
      return new InvalidInstruction(`As seguintes instruções são inválidas para merge: ${unmergeableTargetsDesc}`);
    }

    return new MergeInstruction(mergeableInstructions);
  }
}
