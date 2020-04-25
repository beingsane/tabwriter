import { TabBlock, TabBlockWriteInstruction, TabBlockWriteResult } from './tabBlock.model';

interface TabConfig {
  rowsQuantity?: number;
  rowsFiller?: string;
  rowsSpacing?: number;
  sectionSymbol?: string;
}

export class Tab {
  public static readonly DEFAULT_ROWS_QUANTITY = 6;
  public static readonly DEFAULT_ROWS_FILLER = '-';
  public static readonly DEFAULT_ROWS_SPACING = 3;
  public static readonly DEFAULT_SECTION_SYMBOL = '|';

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
    this.validateRowsSpacing(value);

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
    this.validateSectionSymbol(value);
    this.currentSectionSymbol = value;
  }

  private readonly tabBlocks: TabBlock[] = [];
  private get currentTabBlock(): TabBlock {
    return this.tabBlocks[this.tabBlocks.length - 1];
  }

  public get blocks(): string[][] {
    return this.tabBlocks.map(tabBlock => tabBlock.block);
  }

  constructor({ rowsQuantity, rowsFiller, rowsSpacing, sectionSymbol }: TabConfig = {}) {
    if (rowsQuantity !== undefined) this.validateRowsQuantity(rowsQuantity);
    if (rowsFiller !== undefined) this.validateRowsFiller(rowsFiller);
    if (rowsSpacing !== undefined) this.validateRowsSpacing(rowsSpacing);
    if (sectionSymbol !== undefined) this.validateSectionSymbol(sectionSymbol);

    this.currentRowsQuantity = rowsQuantity ? rowsQuantity : Tab.DEFAULT_ROWS_QUANTITY;
    this.currentRowsFiller = rowsFiller ? rowsFiller : Tab.DEFAULT_ROWS_FILLER;
    this.currentRowsSpacing = rowsSpacing ? rowsSpacing : Tab.DEFAULT_ROWS_SPACING;
    this.currentSectionSymbol = sectionSymbol ? sectionSymbol : Tab.DEFAULT_SECTION_SYMBOL;

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

  private validateRowsQuantity(rowsQuantity: number): void {
    if (rowsQuantity < 1) throw Error(`[${Tab.name}] rowsQuantity must be a positive number.`);
  }

  private validateRowsFiller(rowsFiller: string): void {
    if (rowsFiller.length > 1) throw Error(`[${Tab.name}] rowsFiller must be a single character.`);
  }

  private validateRowsSpacing(rowsSpacing: number): void {
    if (rowsSpacing < 1) throw Error(`[${Tab.name}] rowsSpacing must be a positive number.`);
  }

  private validateSectionSymbol(sectionSymbol: string): void {
    if (sectionSymbol.length > 1) throw Error(`[${Tab.name}] sectionSymbol must be a single character.`);
  }
}
