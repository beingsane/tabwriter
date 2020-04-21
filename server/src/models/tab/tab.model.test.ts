import { TabBlockWriteInstruction } from './tabBlock.model';
import { TabConfig, Tab } from './tab.model';

describe(`[${TabConfig.name}]`, () => {
  it('should start with the default rows quantity value', () => {
    const tabConfig = new TabConfig();

    expect(tabConfig.rowsQty).toBe(TabConfig.DEFAULT_ROWS_QTY);
  });

  it('should start with the default rows spacing', () => {
    const tabConfig = new TabConfig();

    expect(tabConfig.rowsSpacing).toBe(TabConfig.DEFAULT_ROWS_SPACING);
  });

  it('should start with the default rows character filler', () => {
    const tabConfig = new TabConfig();

    expect(tabConfig.rowsFiller).toBe(TabConfig.DEFAULT_ROWS_FILLER);
  });

  it('should start with the default section character symbol', () => {
    const tabConfig = new TabConfig();

    expect(tabConfig.sectionSymbol).toBe(TabConfig.DEFAULT_SECTION_SYMBOL);
  });

  it('should allow editing the rows quantity value', () => {
    const tabConfig = new TabConfig();
    const rowsQty = 10;

    tabConfig.rowsQty = rowsQty;

    expect(tabConfig.rowsQty).toBe(rowsQty);
  });

  it('should allow editing the rows spacing value', () => {
    const tabConfig = new TabConfig();
    const rowsSpacing = 10;

    tabConfig.rowsSpacing = rowsSpacing;

    expect(tabConfig.rowsSpacing).toBe(rowsSpacing);
  });

  it('should allow editing the rows character filler value', () => {
    const tabConfig = new TabConfig();
    const rowsFiller = '$';

    tabConfig.rowsFiller = rowsFiller;

    expect(tabConfig.rowsFiller).toBe(rowsFiller);
  });

  it('should throw an error when editing the rows character filler value with a non character string', () => {
    const tabConfig = new TabConfig();
    const rowsFiller = '$$';

    expect(() => (tabConfig.rowsFiller = rowsFiller)).toThrow();
  });

  it('should allow editing the section character symbol value', () => {
    const tabConfig = new TabConfig();
    const sectionSymbol = '$';

    tabConfig.sectionSymbol = sectionSymbol;

    expect(tabConfig.sectionSymbol).toBe(sectionSymbol);
  });

  it('should throw an error when editing the section character symbol value with a non character string', () => {
    const tabConfig = new TabConfig();
    const sectionSymbol = '$$';

    expect(() => (tabConfig.sectionSymbol = sectionSymbol)).toThrow();
  });
});

describe(`[${Tab.name}]`, () => {
  it('should use the default tab config when created if no custom config is provided', () => {
    const defaultTabConfig = new TabConfig();

    const tab = new Tab();

    expect(tab.config).toEqual(defaultTabConfig);
  });

  it('should use the given tabConfig when provided', () => {
    const tabConfig = new TabConfig();
    tabConfig.rowsFiller = '$';
    tabConfig.rowsQty = 10;
    tabConfig.rowsSpacing = 10;
    tabConfig.sectionSymbol = '$';

    const tab = new Tab(tabConfig);

    expect(tab.config).toEqual(tabConfig);
  });

  it('should be created with one tab block', () => {
    const tab = new Tab();

    expect(tab.blocks.length).toBe(1);
  });

  it('should provide a method to add a new tab block to the tab', () => {
    const tab = new Tab();

    tab.addTabBlock();

    expect(tab.blocks.length).toBe(2);
  });

  it('should provide a method to add a instruction to the last tab block', () => {
    const chord = 1;
    const note = '1/2';
    const instruction = new TabBlockWriteInstruction(chord, note);

    const tab = new Tab();
    tab.addTabBlock();
    tab.writeInstruction(instruction);

    expect(tab.blocks[1][chord]).toContain(note);
  });

  it('should provide a method to add merged instructions to the last tab block', () => {
    const chordNoteMap: Record<number, string> = { 1: '1/2', 2: '2' };
    const instructions = Object.keys(chordNoteMap).map(chordStr => {
      const chord = parseInt(chordStr, 10);
      return new TabBlockWriteInstruction(chord, chordNoteMap[chord]);
    });

    const tab = new Tab();
    tab.addTabBlock();
    tab.writeInstructionsMerged(instructions);

    Object.keys(chordNoteMap).map(chordStr => {
      const chord = parseInt(chordStr, 10);
      expect(tab.blocks[1][chord]).toContain(chordNoteMap[chord]);
    });
  });
});
