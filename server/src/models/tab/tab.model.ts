import { TabBlock, TabBlockWriteInstruction, TabBlockWriteResult } from './tabBlock.model';

export class TabConfig {
  public static readonly DEFAULT_ROWS_QTY = 6;
  public static readonly DEFAULT_ROWS_FILLER = '-';
  public static readonly DEFAULT_ROWS_SPACING = 3;
  public static readonly DEFAULT_SECTION_SYMBOL = '|';

  private _rowsFiller: string = TabConfig.DEFAULT_ROWS_FILLER;
  get rowsFiller(): string {
    return this._rowsFiller;
  }
  set rowsFiller(value: string) {
    if (value.length !== 1) {
      throw Error(`[${TabConfig.name}] rowsFiller must be a single character string.`);
    }

    this._rowsFiller = value;
  }

  private _sectionSymbol: string = TabConfig.DEFAULT_SECTION_SYMBOL;
  get sectionSymbol(): string {
    return this._sectionSymbol;
  }
  set sectionSymbol(value: string) {
    if (value.length !== 1) {
      throw Error(`[${TabConfig.name}] sectionSymbol must be a single character string.`);
    }

    this._sectionSymbol = value;
  }

  rowsQty = TabConfig.DEFAULT_ROWS_QTY;
  rowsSpacing = TabConfig.DEFAULT_ROWS_SPACING;
}

export class Tab {
  private readonly tabBlocks: TabBlock[] = [];

  private get currentTabBlock(): TabBlock {
    return this.tabBlocks[this.tabBlocks.length - 1];
  }

  public get blocks(): string[][] {
    return this.tabBlocks.map(tabBlock => tabBlock.block);
  }

  constructor(public readonly config: TabConfig = new TabConfig()) {
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
}
