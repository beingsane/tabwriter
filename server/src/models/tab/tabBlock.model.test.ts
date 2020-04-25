import { Tab } from './tab.model';
import { TabBlock, TabBlockWriteInstruction } from './tabBlock.model';

const getDefaultSetup = (): { chord: number; note: string; tab: Tab; tabBlock: TabBlock } => {
  const chord = 1;
  const note = '1/2';
  const tab = new Tab();
  const tabBlock = new TabBlock(tab);

  return { chord, note, tab, tabBlock };
};

const chordsNoteMapExtractor = (
  chordsNoteMap: Record<number, string>,
  chordStr: string,
): { chord: number; note: string } => {
  const chord = parseInt(chordStr, 10);
  const note = chordsNoteMap[chord];
  return { chord, note };
};

const getDefaultChordsNoteMap = (): { chordsNoteMap: Record<number, string>; maxNotesLength: number } => {
  const chordsNoteMap = { 1: '1', 2: '1/2', 3: '2' };
  const maxNotesLength = Object.keys(chordsNoteMap).reduce((store, chordStr) => {
    const { note } = chordsNoteMapExtractor(chordsNoteMap, chordStr);
    return note.length > store ? note.length : store;
  }, 0);

  return { chordsNoteMap, maxNotesLength };
};

describe(`[${TabBlock.name}]`, () => {
  it('should initialize the tab block rows based on the given tab', () => {
    const tab = new Tab();

    const tabBlock = new TabBlock(tab);

    expect(tabBlock.rows.length).toBe(tab.rowsQuantity);
  });

  it('should initialize the tab block rows with spacing, based on the given tab', () => {
    const tab = new Tab();
    const expectedRowValue = Array(tab.rowsSpacing + 1).join(tab.rowsFiller);

    const tabBlock = new TabBlock(tab);

    tabBlock.rows.forEach(row => {
      expect(row).toBe(expectedRowValue);
    });
  });

  it('should give access to the header section alone', () => {
    const { tabBlock } = getDefaultSetup();

    expect(tabBlock.block[0]).toBe(tabBlock.header);
  });

  it('should give access to the footer section alone', () => {
    const { tab, tabBlock } = getDefaultSetup();

    expect(tabBlock.block[tab.rowsQuantity + 1]).toBe(tabBlock.footer);
  });

  describe('[addSpacing]', () => {
    it('should throw if the given spacing is not a positive value', () => {
      const { tabBlock } = getDefaultSetup();
      const spacingToAdd = 0;

      expect(() => tabBlock.addSpacing(spacingToAdd)).toThrow();
    });

    it('should add fillers to all rows for the spacing amount provided when valid', () => {
      const { tab, tabBlock } = getDefaultSetup();
      const spacingToAdd = 10;

      const expectedFiller = Array(spacingToAdd + 1).join(tab.rowsFiller);
      const expectedRowsFinalValue = tabBlock.rows.map(row => row + expectedFiller);
      tabBlock.addSpacing(spacingToAdd);

      expect(tabBlock.rows).toEqual(expectedRowsFinalValue);
    });

    it('should add fillers to all rows for the tab rows spacing amount when no spacing value is given', () => {
      const { tab, tabBlock } = getDefaultSetup();

      const expectedFiller = Array(tab.rowsSpacing + 1).join(tab.rowsFiller);
      const expectedRowsFinalValue = tabBlock.rows.map(row => row + expectedFiller);
      tabBlock.addSpacing();

      expect(tabBlock.rows).toEqual(expectedRowsFinalValue);
    });
  });

  describe('[removeSpacing]', () => {
    it('should throw if the given spacing is not a positive value', () => {
      const { tabBlock } = getDefaultSetup();
      const spacingToRemove = 0;

      expect(() => tabBlock.removeSpacing(spacingToRemove)).toThrow();
    });

    it('should throw if the given spacing exceeds the maximum removable spacing', () => {
      const { tabBlock } = getDefaultSetup();
      const spacingToRemove = 2;

      tabBlock.maximumRemovableSpacing = jest.fn().mockReturnValue(spacingToRemove - 1);

      expect(() => tabBlock.removeSpacing(spacingToRemove)).toThrow();
    });

    it('should remove fillers from all rows for the spacing amount provided when valid', () => {
      const { tabBlock } = getDefaultSetup();
      const spacingToRemove = 1;

      const expectedRowsFinalValue = tabBlock.rows.map(row => row.slice(0, row.length - spacingToRemove));
      tabBlock.removeSpacing(spacingToRemove);

      expect(tabBlock.rows).toEqual(expectedRowsFinalValue);
    });

    it('should remove fillers from all rows for the tab rows spacing amount when no spacing value is given', () => {
      const { tab, tabBlock } = getDefaultSetup();

      const expectedRowsFinalValue = tabBlock.rows.map(row => row.slice(0, row.length - tab.rowsSpacing));
      tabBlock.removeSpacing();

      expect(tabBlock.rows).toEqual(expectedRowsFinalValue);
    });
  });

  describe('[maximumRemovableSpacing]', () => {
    it('should return the minimum number of fillers from the end to the beggining based on every row', () => {
      const { chord, note, tab, tabBlock } = getDefaultSetup();
      const writeInstruction = new TabBlockWriteInstruction(chord, note);
      tabBlock.writeInstruction(writeInstruction);

      const maximumRemovableSpacing = tabBlock.maximumRemovableSpacing();

      expect(maximumRemovableSpacing).toBe(tab.rowsSpacing);
    });
  });

  describe(`[writeInstruction]`, () => {
    it('should call the writeInstructionsMerged method with the given instruction', () => {
      const { chord, note, tabBlock } = getDefaultSetup();
      const writeInstruction = new TabBlockWriteInstruction(chord, note);
      const expectedWriteInstruction = [writeInstruction];

      tabBlock.writeInstructionsMerged = jest.fn();
      tabBlock.writeInstruction(writeInstruction);

      expect(tabBlock.writeInstructionsMerged).toHaveBeenCalledWith(expectedWriteInstruction);
    });
  });

  describe('[writeInstructionsMerged]', () => {
    it(`should return a no success result if the given instruction's chord is smaller than 1`, () => {
      const invalidChord = 0;
      const { note, tabBlock } = getDefaultSetup();

      const writeInstruction = new TabBlockWriteInstruction(invalidChord, note);
      const result = tabBlock.writeInstructionsMerged([writeInstruction]);

      expect(result.success).toBe(false);
      expect(result.description).toBeTruthy();
    });

    it(`should return a no success result if the given instruction's chords is smaller than 1`, () => {
      const notes = ['1/2', '2/3'];
      const { tabBlock } = getDefaultSetup();

      const writeInstructions = notes.map((note, idx) => new TabBlockWriteInstruction(-idx, note));
      const result = tabBlock.writeInstructionsMerged(writeInstructions);

      expect(result.success).toBe(false);
      expect(result.description).toBeTruthy();
    });

    it(`should return a no success result if the given instruction's chord is greater than the maximum specified on tab`, () => {
      const { note, tab, tabBlock } = getDefaultSetup();
      const invalidChord = tab.rowsQuantity + 1;

      const writeInstruction = new TabBlockWriteInstruction(invalidChord, note);
      const result = tabBlock.writeInstructionsMerged([writeInstruction]);

      expect(result.success).toBe(false);
      expect(result.description).toBeTruthy();
    });

    it(`should return a no success result if the given instruction's chords is greater than the maximum specified on tab`, () => {
      const { tab, tabBlock } = getDefaultSetup();
      const notes = ['1/2', '2/3'];

      const writeInstructions = notes.map(
        (note, idx) => new TabBlockWriteInstruction(tab.rowsQuantity + idx + 1, note),
      );
      const result = tabBlock.writeInstructionsMerged(writeInstructions);

      expect(result.success).toBe(false);
      expect(result.description).toBeTruthy();
    });

    it('should return a no success result if there are multiple instructions apllied to the same chord', () => {
      const { chord, tabBlock } = getDefaultSetup();
      const notes = ['1/2', '2/3'];

      const writeInstructions = notes.map(note => new TabBlockWriteInstruction(chord, note));
      const result = tabBlock.writeInstructionsMerged(writeInstructions);

      expect(result.success).toBe(false);
      expect(result.description).toBeTruthy();
    });

    it('should return a no success result if there are multiple instructions apllied to the same chord more than once', () => {
      const { tabBlock } = getDefaultSetup();
      const notes = ['1/2', '2/3', '1/2', '2/3'];

      const writeInstructions = notes.map((note, idx) => new TabBlockWriteInstruction(1 + (idx % 2), note));
      const result = tabBlock.writeInstructionsMerged(writeInstructions);

      expect(result.success).toBe(false);
      expect(result.description).toBeTruthy();
    });

    it('should write note on the specified chords and add spacing based on tab', () => {
      const { tab, tabBlock } = getDefaultSetup();
      const { chordsNoteMap, maxNotesLength } = getDefaultChordsNoteMap();

      const writeInstructions = Object.keys(chordsNoteMap).map(chordStr => {
        const { chord, note } = chordsNoteMapExtractor(chordsNoteMap, chordStr);
        return new TabBlockWriteInstruction(chord, note);
      });

      const expectedFinalRowValues = Object.keys(chordsNoteMap).reduce((store: Record<string, string>, chordStr) => {
        const { chord, note } = chordsNoteMapExtractor(chordsNoteMap, chordStr);
        const spacing = Array(tab.rowsSpacing + 1 + maxNotesLength - note.length).join(tab.rowsFiller);
        store[chordStr] = tabBlock.rows[chord - 1] + note + spacing;
        return store;
      }, {});

      tabBlock.writeInstructionsMerged(writeInstructions);

      Object.keys(chordsNoteMap).forEach(chordStr => {
        const { chord } = chordsNoteMapExtractor(chordsNoteMap, chordStr);
        expect(tabBlock.rows[chord - 1]).toBe(expectedFinalRowValues[chord]);
      });
    });

    it('should add equivalent spacing on non written chords and add spacing based on tab', () => {
      const { tab, tabBlock } = getDefaultSetup();
      const { chordsNoteMap, maxNotesLength } = getDefaultChordsNoteMap();

      const writeInstructions = Object.keys(chordsNoteMap).map(chordStr => {
        const { chord, note } = chordsNoteMapExtractor(chordsNoteMap, chordStr);
        return new TabBlockWriteInstruction(chord, note);
      });

      const noteSpacing = Array(maxNotesLength + 1).join(tab.rowsFiller);
      const tabSpacing = Array(tab.rowsSpacing + 1).join(tab.rowsFiller);
      const expectedWriteValue = noteSpacing + tabSpacing;

      const expectedNonChordFinalRowValues = tabBlock.rows.reduce((store: Record<number, string>, row, rowIdx) => {
        if (!chordsNoteMap[rowIdx + 1]) {
          store[rowIdx] = row + expectedWriteValue;
        }
        return store;
      }, {});

      tabBlock.writeInstructionsMerged(writeInstructions);

      Object.keys(expectedNonChordFinalRowValues).forEach(rowIdxStr => {
        const rowIdx = parseInt(rowIdxStr, 10);
        expect(tabBlock.rows[rowIdx]).toBe(expectedNonChordFinalRowValues[rowIdx]);
      });
    });
  });
});
