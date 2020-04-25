import { OperationResult } from '../operationResult.model';
import { Tab } from './tab.model';
import '../../extensions/string.extensions';

export class TabBlockWriteResult extends OperationResult {}

export class TabBlockWriteInstruction {
  constructor(public readonly chord: number, public readonly note: string) {}
}

export class TabBlock {
  private internalHeader = '';
  private internalRows: string[];
  private internalFooter = '';

  public get header(): string {
    return this.internalHeader;
  }

  public get footer(): string {
    return this.internalFooter;
  }

  public get rows(): string[] {
    return this.internalRows;
  }

  public get block(): string[] {
    return [this.internalHeader, ...this.internalRows, this.internalFooter];
  }

  constructor(private readonly tab: Tab) {
    this.internalRows = Array(tab.rowsQuantity).fill('');
    this.addSpacing();
  }

  public addSpacing(spacing?: number): void {
    if (spacing !== undefined && spacing < 1) throw Error(`[${TabBlock.name}] spacing must be a positive number.`);

    const spacingToAdd = spacing ? spacing : this.tab.rowsSpacing;
    const rowFiller = this.getRowFiller(spacingToAdd);
    this.internalRows.forEach((row, rowIdx) => (this.internalRows[rowIdx] = row + rowFiller));
  }

  public removeSpacing(spacing?: number): void {
    if (spacing !== undefined && spacing < 1) throw Error(`[${TabBlock.name}] spacing must be a positive number.`);

    const maxRemovableSpacing = this.maximumRemovableSpacing();

    if (spacing !== undefined && spacing > maxRemovableSpacing)
      throw Error(`[${TabBlock.name}] can not remove content elements. Removable spacing < ${maxRemovableSpacing} >.`);

    const spacingToRemove = spacing ? spacing : maxRemovableSpacing;
    this.internalRows.forEach(
      (row, rowIdx) => (this.internalRows[rowIdx] = row.slice(0, row.length - spacingToRemove)),
    );
  }

  public maximumRemovableSpacing(): number {
    return this.internalRows.reduce((store: number, row) => {
      const nonFillerLastIdx = row.indexOfDifferent(this.tab.rowsFiller, row.length - 1, -1);
      const removableSpacing = nonFillerLastIdx < 0 ? row.length : row.length - (nonFillerLastIdx + 1);

      return store < 0 ? removableSpacing : Math.min(removableSpacing, store);
    }, -1);
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

    this.internalRows.forEach((row, idx) => {
      const instructionToWrite = instructions.find(instruction => instruction.chord === idx + 1);
      if (instructionToWrite) {
        const rowFillerLength = maxNoteLength - instructionToWrite.note.length;
        this.internalRows[idx] = row + instructionToWrite.note + this.getRowFiller(rowFillerLength);
      } else {
        this.internalRows[idx] = row + this.getRowFiller(maxNoteLength);
      }
    });
  }

  private getRowFiller(fillerLength: number): string {
    return Array(fillerLength + 1).join(this.tab.rowsFiller);
  }

  private isChordValidToWrite(chord: number): boolean {
    return chord > 0 && chord <= this.tab.rowsQuantity;
  }

  private getInvalidChordsToWrite(instructions: TabBlockWriteInstruction[]): number[] {
    const invalidChords = instructions
      .map(instruction => instruction.chord)
      .filter(chord => !this.isChordValidToWrite(chord))
      .filter((chord, idx, chords) => chords.indexOf(chord) === idx);

    return invalidChords;
  }

  private getInvalidChordsToWriteDescription(chords: number[]): string {
    const availableChordsDesc = `de 1 a ${this.tab.rowsQuantity}`;

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
