import { Operation } from '../../config/index.enum';
import { TabConfig } from './tab.model';

export class TabBlockWriteResultDto {
  success: boolean;
  description: string;
  operation = Operation.escrita;

  constructor(success: boolean, description = '') {
    this.success = success;
    this.description = description;
  }
}

export class TabBlockWriteInstruction {
  constructor(public readonly chord: number, public readonly note: string) {}
}

export class TabBlock {
  header = '';
  rows: string[];
  footer = '';

  constructor(private readonly tabConfig: TabConfig) {
    this.rows = Array(tabConfig.rowsQty).fill('');
    this.addSpacing();
  }

  public addSpacing(): void {
    const rowFiller = this.getRowFiller(this.tabConfig.rowsSpacing);
    this.rows.forEach((row, rowIdx) => (this.rows[rowIdx] = row + rowFiller));
  }

  public writeInstruction(instruction: TabBlockWriteInstruction): TabBlockWriteResultDto {
    return this.writeInstructionsMerged([instruction]);
  }

  public writeInstructionsMerged(instructions: TabBlockWriteInstruction[]): TabBlockWriteResultDto {
    const invalidChords = this.getInvalidChordsToWrite(instructions);
    if (invalidChords.length > 0)
      return new TabBlockWriteResultDto(false, this.getInvalidChordsToWriteDescription(invalidChords));

    const chordsWithMultipleInstructions = this.getChordsWithMultipleInstructions(instructions);
    if (chordsWithMultipleInstructions.length > 0)
      return new TabBlockWriteResultDto(
        false,
        this.getChordsWithMultipleInstructionsDescription(chordsWithMultipleInstructions),
      );

    this.writeInstructionsToRows(instructions);
    this.addSpacing();

    return new TabBlockWriteResultDto(true);
  }

  private writeInstructionsToRows(instructions: TabBlockWriteInstruction[]): void {
    const maxNoteLength = instructions.reduce((maxNoteLength: number, instruction) => {
      return Math.max(maxNoteLength, instruction.note.length);
    }, 0);

    this.rows.forEach((row, idx) => {
      const instructionToWrite = instructions.find(instruction => instruction.chord === idx + 1);
      if (instructionToWrite) {
        const rowFillerLength = maxNoteLength - instructionToWrite.note.length;
        this.rows[idx] = row + instructionToWrite.note + this.getRowFiller(rowFillerLength);
      } else {
        this.rows[idx] = row + this.getRowFiller(maxNoteLength);
      }
    });
  }

  private getRowFiller(fillerLength: number): string {
    return Array(fillerLength + 1).join(this.tabConfig.rowsFiller);
  }

  private isChordValidToWrite(chord: number): boolean {
    return chord > 0 && chord <= this.tabConfig.rowsQty;
  }

  private getInvalidChordsToWrite(instructions: TabBlockWriteInstruction[]): number[] {
    const invalidChords = instructions
      .map(instruction => instruction.chord)
      .filter(chord => !this.isChordValidToWrite(chord))
      .filter((chord, idx, chords) => chords.indexOf(chord) === idx);

    return invalidChords;
  }

  private getInvalidChordsToWriteDescription(chords: number[]): string {
    if (chords.length === 1) {
      return `A corda indicada < ${chords[0]} > está fora da faixa disponível, de 1 a ${this.tabConfig.rowsQty}`;
    } else {
      return `As cordas indicadas < ${chords.join(', ')} > estão fora da faixa disponível, de 1 a ${
        this.tabConfig.rowsQty
      }`;
    }
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
      return `Múltiplas notas encontradas para a seguinte corda: ${chords.join(', ')}`;
    } else {
      return `Múltiplas notas encontradas para as seguintes cordas: ${chords.join(', ')}`;
    }
  }
}
