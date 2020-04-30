import { TabBlockWriteInstruction, TabBlock } from './tabBlock.model';
import { Tab } from './tab.model';

describe(`[${Tab.name}]`, () => {
  describe('[rowsQuantity]', () => {
    it('should be created with the default rows quantity if none is provided', () => {
      const tab = new Tab();

      expect(tab.rowsQuantity).toBe(Tab.DEFAULT_ROWS_QUANTITY);
    });

    it('should be created with the given rows quantity if one is provided and valid', () => {
      const rowsQuantity = 2;
      const tab = new Tab({ rowsQuantity });

      expect(tab.rowsQuantity).toBe(rowsQuantity);
    });

    it('should throw if the given rows quantity is not positive', () => {
      const rowsQuantity = 0;

      expect(() => new Tab({ rowsQuantity })).toThrow();
    });
  });

  describe('[rowsFiller]', () => {
    it('should be created with the default rows filler if none is provided', () => {
      const tab = new Tab();

      expect(tab.rowsFiller).toBe(Tab.DEFAULT_ROWS_FILLER);
    });

    it('should be created with the given rows filler if one is provided and valid', () => {
      const rowsFiller = '$';
      const tab = new Tab({ rowsFiller });

      expect(tab.rowsFiller).toBe(rowsFiller);
    });

    it('should throw if the given rows filler is not single character', () => {
      const rowsFiller = '$$';

      expect(() => new Tab({ rowsFiller })).toThrow();
    });
  });

  describe('[rowsSpacing]', () => {
    it('should be created with the default rows spacing if none is provided', () => {
      const tab = new Tab();

      expect(tab.rowsSpacing).toBe(Tab.DEFAULT_ROWS_SPACING);
    });

    it('should be created with the given rows spacing if one is provided and valid', () => {
      const rowsSpacing = 10;
      const tab = new Tab({ rowsSpacing });

      expect(tab.rowsSpacing).toBe(rowsSpacing);
    });

    it('should throw if the given rows spacing is not positive', () => {
      const rowsSpacing = 0;

      expect(() => new Tab({ rowsSpacing })).toThrow();
    });

    it('should set the rowsSpacing property for a valid value and add missing spacing to current block', () => {
      const tab = new Tab();
      const additionalSpacing = 10;
      const rowsSpacing = tab.rowsSpacing + additionalSpacing;

      const addSpacingSpy = jest.spyOn(TabBlock.prototype, 'addSpacing');
      tab.rowsSpacing = rowsSpacing;

      expect(addSpacingSpy).toHaveBeenCalledWith(additionalSpacing);
      addSpacingSpy.mockRestore();
    });

    it('should set the rowsSpacing property for a valid value and remove extra spacing from current block', () => {
      const tab = new Tab();
      const spacingToRemove = 1;
      const rowsSpacing = tab.rowsSpacing - spacingToRemove;

      const removeSpacingSpy = jest.spyOn(TabBlock.prototype, 'removeSpacing');
      tab.rowsSpacing = rowsSpacing;

      expect(removeSpacingSpy).toHaveBeenCalledWith(spacingToRemove);
      removeSpacingSpy.mockRestore();
    });

    it('should neither add or remove spacing from current block is the new spacing is the same as the current spacing', () => {
      const tab = new Tab();

      const addSpacingSpy = jest.spyOn(TabBlock.prototype, 'addSpacing');
      const removeSpacingSpy = jest.spyOn(TabBlock.prototype, 'removeSpacing');

      tab.rowsSpacing = tab.rowsSpacing;

      expect(addSpacingSpy).not.toHaveBeenCalled();
      expect(removeSpacingSpy).not.toHaveBeenCalled();
      addSpacingSpy.mockRestore();
      removeSpacingSpy.mockRestore();
    });

    it('should throw if the rowsSpacing property is set to a no positive value', () => {
      const rowsSpacing = 0;
      const tab = new Tab();

      expect(() => (tab.rowsSpacing = rowsSpacing)).toThrow();
    });
  });

  describe('[sectionSymbol]', () => {
    it('should be created with the default section symbol if none is provided', () => {
      const tab = new Tab();

      expect(tab.sectionSymbol).toBe(Tab.DEFAULT_SECTION_SYMBOL);
    });

    it('should be created with the given section symbol if one is provided and valid', () => {
      const sectionSymbol = '#';
      const tab = new Tab({ sectionSymbol });

      expect(tab.sectionSymbol).toBe(sectionSymbol);
    });

    it('should throw if the given section symbol is not single character', () => {
      const sectionSymbol = '##';

      expect(() => new Tab({ sectionSymbol })).toThrow();
    });

    it('should set the sectionSymbol property if it is set to a valid value', () => {
      const sectionSymbol = '#';
      const tab = new Tab();

      tab.sectionSymbol = sectionSymbol;

      expect(tab.sectionSymbol).toBe(sectionSymbol);
    });

    it('should throw if the sectionSymbol is set to a no single character', () => {
      const sectionSymbol = '##';
      const tab = new Tab();

      expect(() => (tab.sectionSymbol = sectionSymbol)).toThrow();
    });
  });

  describe('[sectionFiller]', () => {
    it('should be created with the default section filler if none is provided', () => {
      const tab = new Tab();

      expect(tab.sectionFiller).toBe(Tab.DEFAULT_SECTION_FILLER);
    });

    it('should be created with the given section filler if one is provided and valid', () => {
      const sectionFiller = '$';
      const tab = new Tab({ sectionFiller });

      expect(tab.sectionFiller).toBe(sectionFiller);
    });

    it('should throw if the given section filler is not single character', () => {
      const sectionFiller = '$$';

      expect(() => new Tab({ sectionFiller })).toThrow();
    });
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

  it('should provide a method to write a header to the last tab block', () => {
    const headerName = 'some tab header';
    const tab = new Tab();

    tab.addTabBlock();
    tab.writeHeader(headerName);

    expect(tab.blocks[1][0]).toContain(headerName);
  });
});
