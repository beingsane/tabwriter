import { TabConfig } from './tab.model';
import { TabBlock, TabBlockWriteInstruction } from './tabBlock.model';
describe(`[${TabBlock.name}]`, () => {
  it('should initialize the tab block rows based on the given config', () => {
    const tabConfig = new TabConfig();

    const tabBlock = new TabBlock(tabConfig);

    expect(tabBlock.rows.length).toBe(tabConfig.rowsQty);
  });

  it('should initialize the tab block rows with spacing, based on the given config', () => {
    const tabConfig = new TabConfig();
    const expectedRowValue = Array(tabConfig.rowsSpacing + 1).join(tabConfig.rowsFiller);

    const tabBlock = new TabBlock(tabConfig);

    tabBlock.rows.forEach(row => {
      expect(row).toBe(expectedRowValue);
    });
  });

  describe(`[${TabBlock.prototype.writeInstruction.name}]`, () => {
    it('should return a no success result if the given chord is smaller than 1', () => {
      const tabConfig = new TabConfig();
      const invalidChord = 0;
      const note = '1';

      const writeInstruction = new TabBlockWriteInstruction(invalidChord, note);
      const tabBlock = new TabBlock(tabConfig);
      const result = tabBlock.writeInstruction(writeInstruction);

      expect(result.success).toBe(false);
    });

    it('should return a no success result if the given chord is greater than the maximum specified on config', () => {
      const tabConfig = new TabConfig();
      const invalidChord = tabConfig.rowsQty + 1;
      const note = '1';

      const writeInstruction = new TabBlockWriteInstruction(invalidChord, note);
      const tabBlock = new TabBlock(tabConfig);
      const result = tabBlock.writeInstruction(writeInstruction);

      expect(result.success).toBe(false);
    });

    it('should write note on the specified chord and add spacing based on config', () => {
      const chord = 1;
      const note = '1/2';
      const tabConfig = new TabConfig();
      const expectedWriteValue = note + Array(tabConfig.rowsSpacing + 1).join(tabConfig.rowsFiller);

      const writeInstruction = new TabBlockWriteInstruction(chord, note);
      const tabBlock = new TabBlock(tabConfig);
      const expectedFinalRowValue = tabBlock.rows[chord - 1] + expectedWriteValue;
      tabBlock.writeInstruction(writeInstruction);

      expect(tabBlock.rows[chord - 1]).toBe(expectedFinalRowValue);
    });

    it('should add equivalent spacing on non written chords and add spacing based on config', () => {
      const chordToWrite = 1;
      const note = '1/2';
      const tabConfig = new TabConfig();

      const noteSpacing = Array(note.length + 1).join(tabConfig.rowsFiller);
      const tabSpacing = Array(tabConfig.rowsSpacing + 1).join(tabConfig.rowsFiller);
      const expectedWriteValue = noteSpacing + tabSpacing;

      const tabBlock = new TabBlock(tabConfig);
      const expectedNonChordFinalRowValues = tabBlock.rows.reduce((store: Record<number, string>, row, rowIdx) => {
        if (rowIdx !== chordToWrite - 1) {
          store[rowIdx] = row + expectedWriteValue;
        }
        return store;
      }, {});

      const writeInstruction = new TabBlockWriteInstruction(chordToWrite, note);
      tabBlock.writeInstruction(writeInstruction);

      Object.keys(expectedNonChordFinalRowValues).forEach(rowIdxStr => {
        const rowIdx = parseInt(rowIdxStr, 10);
        expect(tabBlock.rows[rowIdx]).toBe(expectedNonChordFinalRowValues[rowIdx]);
      });
    });
  });
});
