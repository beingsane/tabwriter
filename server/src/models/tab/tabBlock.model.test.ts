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
  it('should initialize the tab block rows based on the given tab config', () => {
    const tab = new Tab();

    const tabBlock = new TabBlock(tab);

    expect(tabBlock.rows.length).toBe(tab.config.rowsQty);
  });

  it('should initialize the tab block rows with spacing, based on the given config', () => {
    const tab = new Tab();
    const expectedRowValue = Array(tab.config.rowsSpacing + 1).join(tab.config.rowsFiller);

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

    expect(tabBlock.block[tab.config.rowsQty + 1]).toBe(tabBlock.footer);
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

    it(`should return a no success result if the given instruction's chord is greater than the maximum specified on config`, () => {
      const { note, tab, tabBlock } = getDefaultSetup();
      const invalidChord = tab.config.rowsQty + 1;

      const writeInstruction = new TabBlockWriteInstruction(invalidChord, note);
      const result = tabBlock.writeInstructionsMerged([writeInstruction]);

      expect(result.success).toBe(false);
      expect(result.description).toBeTruthy();
    });

    it(`should return a no success result if the given instruction's chords is greater than the maximum specified on config`, () => {
      const { tab, tabBlock } = getDefaultSetup();
      const notes = ['1/2', '2/3'];

      const writeInstructions = notes.map(
        (note, idx) => new TabBlockWriteInstruction(tab.config.rowsQty + idx + 1, note),
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

    it('should write note on the specified chords and add spacing based on config', () => {
      const { tab, tabBlock } = getDefaultSetup();
      const { chordsNoteMap, maxNotesLength } = getDefaultChordsNoteMap();

      const writeInstructions = Object.keys(chordsNoteMap).map(chordStr => {
        const { chord, note } = chordsNoteMapExtractor(chordsNoteMap, chordStr);
        return new TabBlockWriteInstruction(chord, note);
      });

      const expectedFinalRowValues = Object.keys(chordsNoteMap).reduce((store: Record<string, string>, chordStr) => {
        const { chord, note } = chordsNoteMapExtractor(chordsNoteMap, chordStr);
        const spacing = Array(tab.config.rowsSpacing + 1 + maxNotesLength - note.length).join(tab.config.rowsFiller);
        store[chordStr] = tabBlock.rows[chord - 1] + note + spacing;
        return store;
      }, {});

      tabBlock.writeInstructionsMerged(writeInstructions);

      Object.keys(chordsNoteMap).forEach(chordStr => {
        const { chord } = chordsNoteMapExtractor(chordsNoteMap, chordStr);
        expect(tabBlock.rows[chord - 1]).toBe(expectedFinalRowValues[chord]);
      });
    });

    it('should add equivalent spacing on non written chords and add spacing based on config', () => {
      const { tab, tabBlock } = getDefaultSetup();
      const { chordsNoteMap, maxNotesLength } = getDefaultChordsNoteMap();

      const writeInstructions = Object.keys(chordsNoteMap).map(chordStr => {
        const { chord, note } = chordsNoteMapExtractor(chordsNoteMap, chordStr);
        return new TabBlockWriteInstruction(chord, note);
      });

      const noteSpacing = Array(maxNotesLength + 1).join(tab.config.rowsFiller);
      const tabSpacing = Array(tab.config.rowsSpacing + 1).join(tab.config.rowsFiller);
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
