import { OperationErrorManager } from '../errors/operationErrorManager.model';
import { InstructionWriteBehavior } from './instructionWriteBehavior.model';
import { OperationContext } from '../../enums/index.enum';
import { InstructionOperationError } from '../errors/instructionOperationError.model';
import { Tab } from '../tab/tab.model';

export class InstructionDefaultWriteBehavior extends InstructionWriteBehavior {
  private static readonly REGEX_EXTRACT_CHORD_AND_FRET = /^(\d+)\-(.*)/gm;

  protected context = OperationContext.instructionDefault;

  private chord = -1;
  private note = '';

  writeToTab(tab: Tab, errorReporter?: OperationErrorManager): void {
    if (!this.parseChordAndNote()) {
      if (errorReporter) {
        const errorDescription = 'Não foi possível identificar a corda ou a nota indicados';
        errorReporter.addError(
          new InstructionOperationError(this.instruction, this.operation, this.context, errorDescription),
        );
      }
      return;
    }

    const writeResult = tab.currentTabBlock.writeNoteOnChord(this.chord, this.note);

    if (!writeResult.success && errorReporter) {
      errorReporter.addError(
        new InstructionOperationError(this.instruction, writeResult.operation, this.context, writeResult.description),
      );
    }
  }

  private parseChordAndNote(): boolean {
    const chordAndNoteData = InstructionDefaultWriteBehavior.REGEX_EXTRACT_CHORD_AND_FRET.exec(
      this.instruction.instructionStr,
    );
    InstructionDefaultWriteBehavior.REGEX_EXTRACT_CHORD_AND_FRET.lastIndex = 0;

    if (chordAndNoteData === null) {
      return false;
    }

    this.chord = parseInt(chordAndNoteData[1], 10);
    this.note = chordAndNoteData[2].trim();

    return true;
  }
}
