import { TabBlock } from './tabBlock.model';
import { TabBlockWriteInstruction } from './tabBlockWriteInstruction.model';
import { TabBlockWriteResult } from './tabBlockWriteResult.model';
import { InvalidArgumentError } from './../errors/invalidArgumentError';

interface TabConfig {
  rowsQuantity?: number;
  rowsFiller?: string;
  rowsSpacing?: number;
  sectionSymbol?: string;
  sectionFiller?: string;
}

export class Tab {
  public static readonly DEFAULT_ROWS_QUANTITY = 6;
  public static readonly DEFAULT_ROWS_FILLER = '-';
  public static readonly DEFAULT_ROWS_SPACING = 3;
  public static readonly DEFAULT_SECTION_SYMBOL = '|';
  public static readonly DEFAULT_SECTION_FILLER = ' ';

  private readonly currentRowsQuantity: number;
  public get rowsQuantity(): number {
    return this.currentRowsQuantity;
  }

  private readonly currentRowsFiller: string;
  public get rowsFiller(): string {
    return this.currentRowsFiller;
  }

  private currentRowsSpacing: number;
  public get rowsSpacing(): number {
    return this.currentRowsSpacing;
  }
  public set rowsSpacing(value: number) {
    if (value < 1) throw new InvalidArgumentError('rowsSpacing must be a positive number');

    const spaceDiff = value - this.currentRowsSpacing;
    if (spaceDiff === 0) return;
    else if (spaceDiff > 0) this.currentTabBlock.addSpacing(spaceDiff);
    else this.currentTabBlock.removeSpacing(-spaceDiff);

    this.currentRowsSpacing = value;
  }

  private currentSectionSymbol: string;
  public get sectionSymbol(): string {
    return this.currentSectionSymbol;
  }
  public set sectionSymbol(value: string) {
    if (value.length !== 1) throw new InvalidArgumentError('sectionSymbol must be a single character string');
    this.currentSectionSymbol = value;
  }

  private readonly currentSectionFiller: string;
  public get sectionFiller(): string {
    return this.currentSectionFiller;
  }

  private readonly tabBlocks: TabBlock[] = [];
  private get currentTabBlock(): TabBlock {
    return this.tabBlocks[this.tabBlocks.length - 1];
  }

  public get blocks(): string[][] {
    return this.tabBlocks.map(tabBlock => tabBlock.block);
  }

  constructor({ rowsQuantity, rowsFiller, rowsSpacing, sectionSymbol, sectionFiller }: TabConfig = {}) {
    if (rowsQuantity !== undefined && rowsQuantity < 1)
      throw new InvalidArgumentError('rowsQuantity must be a positive number');

    if (rowsFiller !== undefined && rowsFiller.length !== 1)
      throw new InvalidArgumentError('rowsFiller must be a single character string');

    if (rowsSpacing !== undefined && rowsSpacing < 1)
      throw new InvalidArgumentError('rowsSpacing must be a positive number');

    if (sectionSymbol !== undefined && sectionSymbol.length !== 1)
      throw new InvalidArgumentError('sectionSymbol must be a single character string');

    if (sectionFiller !== undefined && sectionFiller.length !== 1)
      throw new InvalidArgumentError('sectionFiller must be a single character string');

    this.currentRowsQuantity = rowsQuantity ? rowsQuantity : Tab.DEFAULT_ROWS_QUANTITY;
    this.currentRowsFiller = rowsFiller ? rowsFiller : Tab.DEFAULT_ROWS_FILLER;
    this.currentRowsSpacing = rowsSpacing ? rowsSpacing : Tab.DEFAULT_ROWS_SPACING;
    this.currentSectionSymbol = sectionSymbol ? sectionSymbol : Tab.DEFAULT_SECTION_SYMBOL;
    this.currentSectionFiller = sectionFiller ? sectionFiller : Tab.DEFAULT_SECTION_FILLER;

    this.addTabBlock();
  }

  public addTabBlock(): void {
    this.tabBlocks.push(new TabBlock(this));
  }

  public writeInstruction(instruction: TabBlockWriteInstruction): TabBlockWriteResult {
    return this.currentTabBlock.writeInstruction(instruction);
  }

  public writeInstructionsMerged(instructions: TabBlockWriteInstruction[]): TabBlockWriteResult {
    return this.currentTabBlock.writeInstructionsMerged(instructions);
  }

  public writeHeader(header: string): TabBlockWriteResult {
    return this.currentTabBlock.writeHeader(header);
  }

  public writeFooter(footer: string): TabBlockWriteResult {
    return this.currentTabBlock.writeFooter(footer);
  }
}
