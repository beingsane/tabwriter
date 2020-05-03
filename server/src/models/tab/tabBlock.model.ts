import { OperationResult } from '../operationResult.model';
import { Tab } from './tab.model';
import '../../extensions/string.extensions';

export class TabBlockWriteResult extends OperationResult {}

export class TabBlockWriteInstruction {
  constructor(public readonly chord: number, public readonly note: string) {}
}

export class TabBlock {
  public readonly blockHeaderIdx = 0;
  public readonly blockFooterIdx = this.tab.rowsQuantity + 1;
  public readonly blockRowsStartIdx = this.blockHeaderIdx + 1;
  public readonly blockRowsEndIdx = this.blockFooterIdx - 1;

  public get header(): string {
    return this.block[this.blockHeaderIdx];
  }

  public get footer(): string {
    return this.block[this.blockFooterIdx];
  }

  public get rows(): string[] {
    return this.block.slice(this.blockRowsStartIdx, this.blockRowsEndIdx + 1);
  }

  public get block(): string[] {
    if (!this.isInternalBlockSet) this.setupInternalBlock();
    return this.internalBlock;
  }

  private internalHeader = '';
  private internalRows: string[];
  private internalFooter = '';
  private internalBlock: string[] = [];
  private isInternalBlockSet = false;

  private get rowsLength(): number {
    return this.internalRows[0].length;
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

    this.isInternalBlockSet = false;
  }

  public removeSpacing(spacing?: number): void {
    if (spacing !== undefined && spacing < 1) throw Error(`[${TabBlock.name}] spacing must be a positive number.`);

    const maxRemovableSpacing = this.getMaximumRemovableRowsSpacing();

    if (spacing !== undefined && spacing > maxRemovableSpacing)
      throw Error(`[${TabBlock.name}] can not remove content elements. Removable spacing < ${maxRemovableSpacing} >.`);

    const spacingToRemove = spacing ? spacing : maxRemovableSpacing;
    this.internalRows.forEach(
      (row, rowIdx) => (this.internalRows[rowIdx] = row.slice(0, row.length - spacingToRemove)),
    );

    this.isInternalBlockSet = false;
  }

  public getMaximumRemovableRowsSpacing(): number {
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

  public writeHeader(headerName: string): TabBlockWriteResult {
    if (headerName.trim().length === 0)
      return new TabBlockWriteResult(false, 'Ao criar uma seção um nome deve ser indicado.');

    this.setupForNewSection();
    const headerToAdd = this.tab.sectionSymbol + this.tab.sectionFiller + headerName;
    this.internalHeader += headerToAdd + this.getSectionsFiller(this.tab.rowsSpacing);

    this.internalRows.forEach((row, idx) => (this.internalRows[idx] = row + this.tab.sectionSymbol));
    this.addSpacing();

    this.internalFooter += this.tab.sectionSymbol + this.tab.sectionFiller;

    this.isInternalBlockSet = false;

    return new TabBlockWriteResult(true);
  }

  private setupForNewSection(): void {
    this.setupInternalBlock();

    this.internalHeader = this.block[this.blockHeaderIdx];
    this.internalFooter = this.block[this.blockFooterIdx];
    this.internalRows = this.block.slice(this.blockRowsStartIdx, this.blockRowsEndIdx + 1);
  }

  private setupInternalBlock(): void {
    const endBlockLength = Math.max(this.rowsLength, this.getMinimumHeaderLength(), this.getMinimumFooterLength());

    const header =
      this.internalHeader.length <= endBlockLength
        ? this.internalHeader + this.getSectionsFiller(endBlockLength - this.internalHeader.length)
        : this.internalHeader.slice(0, endBlockLength);

    const footer = this.internalFooter + this.getSectionsFiller(endBlockLength - this.internalFooter.length);
    /*
    const footer =
      this.internalFooter.length <= endBlockLength
        ? this.internalFooter + this.getSectionsFiller(endBlockLength - this.internalFooter.length)
        : this.internalFooter.slice(0, endBlockLength);
    */

    const rows = this.internalRows.map(row =>
      row.length < endBlockLength ? row + this.getRowFiller(endBlockLength - row.length) : row,
    );

    this.internalBlock = [header, ...rows, footer];
    this.isInternalBlockSet = true;
  }

  private getMinimumHeaderLength(): number {
    return this.getMinimumSectionLength(this.internalHeader);
  }

  private getMinimumFooterLength(): number {
    return this.getMinimumSectionLength(this.internalFooter);
  }

  private getMinimumSectionLength(section: string): number {
    const nonSectionFillerIdx = section.indexOfDifferent(this.tab.sectionFiller, section.length - 1, -1);
    const minimumSectionLenth = nonSectionFillerIdx > -1 ? nonSectionFillerIdx + this.tab.rowsSpacing + 1 : 0;

    return minimumSectionLenth;
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

    this.isInternalBlockSet = false;
  }

  private getSectionsFiller(fillerLength: number): string {
    return Array(fillerLength + 1).join(this.tab.sectionFiller);
  }

  private getRowFiller(fillerLength: number): string {
    return Array(fillerLength + 1).join(this.tab.rowsFiller);
  }

  private getInvalidChordsToWrite(instructions: TabBlockWriteInstruction[]): number[] {
    const invalidChords = instructions
      .map(instruction => instruction.chord)
      .filter(chord => !this.isChordValidToWrite(chord))
      .filter((chord, idx, chords) => chords.indexOf(chord) === idx);

    return invalidChords;
  }

  private isChordValidToWrite(chord: number): boolean {
    return chord > 0 && chord <= this.tab.rowsQuantity;
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

  private getInvalidChordsToWriteDescription(chords: number[]): string {
    const availableChordsDesc = `de 1 a ${this.tab.rowsQuantity}`;

    return chords.length === 1
      ? `A corda indicada < ${chords[0]} > está fora da faixa disponível, ${availableChordsDesc}`
      : `As cordas indicadas < ${chords.join(', ')} > estão fora da faixa disponível, ${availableChordsDesc}`;
  }

  private getChordsWithMultipleInstructionsDescription(chords: number[]): string {
    if (chords.length === 1) {
      return `Múltiplas notas encontradas para a corda ${chords[0]}`;
    } else {
      return `Múltiplas notas encontradas para as seguintes cordas: ${chords.join(', ')}`;
    }
  }
}
