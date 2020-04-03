import { Operation } from '../../enums/index.enum';
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

export class TabBlock {
  header = '';
  rows: string[];
  footer = '';

  constructor(private readonly tabConfig: TabConfig) {
    this.rows = Array(tabConfig.rowsQty).fill('');
    this.addSpacing();
  }

  public addSpacing(): void {
    const rowFiller = Array(this.tabConfig.rowsSpacing + 1).join(this.tabConfig.rowsFiller);
    this.rows.forEach((row, rowIdx) => (this.rows[rowIdx] = row + rowFiller));
  }

  public writeNoteOnChord(chord: number, note: string): TabBlockWriteResultDto {
    if (chord < 1 || chord > this.tabConfig.rowsQty) {
      return new TabBlockWriteResultDto(
        false,
        `A corda indicada < ${chord} > está fora da faixa disponível, de 1 a ${this.tabConfig.rowsQty}`,
      );
    }

    const nonChordFiller = Array(note.length + 1).join(this.tabConfig.rowsFiller);

    this.rows.forEach((row, rowIdx) => {
      this.rows[rowIdx] = row + (rowIdx !== chord - 1 ? nonChordFiller : note);
    });

    this.addSpacing();

    return new TabBlockWriteResultDto(true);
  }
}
