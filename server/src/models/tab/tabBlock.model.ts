import { OperationResult } from '../operationResult.model';
import { Tab } from './tab.model';

export class TabBlockWriteResult extends OperationResult {}

export class TabBlockWriteInstruction {
  constructor(public readonly chord: number, public readonly note: string) {}
}

export class TabBlock {
  private _header = '';
  private _rows: string[];
  private _footer = '';

  public get header(): string {
    return this._header;
  }

  public get footer(): string {
    return this._footer;
  }

  public get rows(): string[] {
    return this._rows;
  }

  public get block(): string[] {
    return [this._header, ...this._rows, this._footer];
  }

  constructor(private readonly tab: Tab) {
    this._rows = Array(tab.config.rowsQty).fill('');
    this.addSpacing();
  }

  public addSpacing(): void {
    const rowFiller = this.getRowFiller(this.tab.config.rowsSpacing);
    this._rows.forEach((row, rowIdx) => (this._rows[rowIdx] = row + rowFiller));
  }

  public writeInstruction(instruction: TabBlockWriteInstruction): TabBlockWriteResult {
    return this.writeInstructionsMerged([instruction]);
  }

  public writeInstructionsMerged(instructions: TabBlockWriteInstruction[]): TabBlockWriteResult {
    const invalidChords = this.getInvalidChordsToWrite(instructions);
    if (invalidChords.length > 0)
      return new TabBlockWriteResult(false, this.getInvalidChordsToWriteDescription(invalidChords));

    const duplicatedChords = this.getChordsWithMultipleInstructions(instructions);
    if (duplicatedChords.length > 0)
      return new TabBlockWriteResult(false, this.getChordsWithMultipleInstructionsDescription(duplicatedChords));

    this.writeInstructionsToRows(instructions);
    this.addSpacing();

    return new TabBlockWriteResult(true);
  }

  private writeInstructionsToRows(instructions: TabBlockWriteInstruction[]): void {
    const maxNoteLength = instructions.reduce((maxNoteLength: number, instruction) => {
      return Math.max(maxNoteLength, instruction.note.length);
    }, 0);

    this._rows.forEach((row, idx) => {
      const instructionToWrite = instructions.find(instruction => instruction.chord === idx + 1);
      if (instructionToWrite) {
        const rowFillerLength = maxNoteLength - instructionToWrite.note.length;
        this._rows[idx] = row + instructionToWrite.note + this.getRowFiller(rowFillerLength);
      } else {
        this._rows[idx] = row + this.getRowFiller(maxNoteLength);
      }
    });
  }

  private getRowFiller(fillerLength: number): string {
    return Array(fillerLength + 1).join(this.tab.config.rowsFiller);
  }

  private isChordValidToWrite(chord: number): boolean {
    return chord > 0 && chord <= this.tab.config.rowsQty;
  }

  private getInvalidChordsToWrite(instructions: TabBlockWriteInstruction[]): number[] {
    const invalidChords = instructions
      .map(instruction => instruction.chord)
      .filter(chord => !this.isChordValidToWrite(chord))
      .filter((chord, idx, chords) => chords.indexOf(chord) === idx);

    return invalidChords;
  }

  private getInvalidChordsToWriteDescription(chords: number[]): string {
    const availableChordsDesc = `de 1 a ${this.tab.config.rowsQty}`;

    return chords.length === 1
      ? `A corda indicada < ${chords[0]} > está fora da faixa disponível, ${availableChordsDesc}`
      : `As cordas indicadas < ${chords.join(', ')} > estão fora da faixa disponível, ${availableChordsDesc}`;
  }

  private getChordsWithMultipleInstructions(instructions: TabBlockWriteInstruction[]): number[] {
    const chord2InstructionCountMap = instructions.reduce((store: Record<number, number>, instruction) => {
      store[instruction.chord] ? store[instruction.chord]++ : (store[instruction.chord] = 1);
      return store;
    }, {});

    const chordsWithMultipleInstructions = Object.keys(chord2InstructionCountMap)
      .map(chordStr => parseInt(chordStr, 10))
      .filter(chord => chord2InstructionCountMap[chord] > 1);

    return chordsWithMultipleInstructions;
  }

  private getChordsWithMultipleInstructionsDescription(chords: number[]): string {
    if (chords.length === 1) {
      return `Múltiplas notas encontradas para a corda ${chords[0]}`;
    } else {
      return `Múltiplas notas encontradas para as seguintes cordas: ${chords.join(', ')}`;
    }
  }
}
