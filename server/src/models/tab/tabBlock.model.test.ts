import { Tab } from './tab.model';
import { TabBlock } from './tabBlock.model';
import { TabBlockWriteInstruction } from './tabBlockWriteInstruction.model';

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

  describe('[block]', () => {
    it('should give access to the header section alone', () => {
      const { tabBlock } = getDefaultSetup();

      expect(tabBlock.block[tabBlock.blockHeaderIdx]).toBe(tabBlock.header);
    });

    it('should give access to the footer section alone', () => {
      const { tabBlock } = getDefaultSetup();

      expect(tabBlock.block[tabBlock.blockFooterIdx]).toBe(tabBlock.footer);
    });

    it('should give access to the rows alone', () => {
      const { tabBlock } = getDefaultSetup();

      expect(tabBlock.block.slice(tabBlock.blockRowsStartIdx, tabBlock.blockRowsEndIdx + 1)).toEqual(tabBlock.rows);
    });

    it('should have the header trimmed if its end spacing is greater than the current spacing', () => {
      const { tab, tabBlock } = getDefaultSetup();
      const spacingToRemove = 1;

      tabBlock.writeHeader('some header');
      const expectedHeader = tabBlock.header.slice(0, tabBlock.header.length - spacingToRemove);

      tab.rowsSpacing = tab.rowsSpacing - spacingToRemove;
      tabBlock.removeSpacing(spacingToRemove);

      expect(tabBlock.header).toBe(expectedHeader);
    });

    it('should have the footer trimmed if its end spacing is greater than the current spacing', () => {
      const { tab, tabBlock } = getDefaultSetup();
      const spacingToRemove = 1;

      tabBlock.writeFooter('some footer');
      const expectedFooter = tabBlock.footer.slice(0, tabBlock.footer.length - spacingToRemove);

      tab.rowsSpacing = tab.rowsSpacing - spacingToRemove;
      tabBlock.removeSpacing(spacingToRemove);

      expect(tabBlock.footer).toBe(expectedFooter);
    });
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

      tabBlock.getMaximumRemovableRowsSpacing = jest.fn().mockReturnValue(spacingToRemove - 1);

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

  describe('[getMaximumRemovableRowsSpacing]', () => {
    it('should return the minimum number of fillers from the end to the beggining based on every row', () => {
      const { chord, note, tab, tabBlock } = getDefaultSetup();
      const writeInstruction = new TabBlockWriteInstruction(chord, note);
      tabBlock.writeInstruction(writeInstruction);

      const maximumRemovableSpacing = tabBlock.getMaximumRemovableRowsSpacing();

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

  describe('[writeHeader]', () => {
    it('should return a no success write result if an empty header is given', () => {
      const { tabBlock } = getDefaultSetup();
      const headerName = '  ';

      const result = tabBlock.writeHeader(headerName);

      expect(result.success).toBe(false);
      expect(result.description).toBeTruthy();
    });

    it(`should write the given header to the header section, preceded by the tab's section symbol`, () => {
      const { tab, tabBlock } = getDefaultSetup();
      const headerName = 'some header name';

      const expectedHeader =
        tabBlock.header +
        tab.sectionSymbol +
        tab.sectionFiller +
        headerName +
        Array(tab.rowsSpacing + 1).join(tab.sectionFiller);

      tabBlock.writeHeader(headerName);

      expect(tabBlock.header).toBe(expectedHeader);
    });

    it(`should fill the rows with filler to the header end, preceded by tab's section symbol`, () => {
      const { tab, tabBlock } = getDefaultSetup();
      const headerName = 'some header name';

      const expectedRows = tabBlock.rows.map(
        row =>
          row +
          tab.sectionSymbol +
          Array(tab.sectionFiller.length + headerName.length + tab.rowsSpacing + 1).join(tab.rowsFiller),
      );

      tabBlock.writeHeader(headerName);

      expect(tabBlock.rows).toEqual(expectedRows);
    });

    it('should keep writing notes on rows despite of the added filler', () => {
      const { chord, note, tab, tabBlock } = getDefaultSetup();
      const headerName = 'some header name';

      const expectedRows = tabBlock.rows.map((row, idx) =>
        idx === chord - 1
          ? row +
            tab.sectionSymbol +
            Array(tab.rowsSpacing + 1).join(tab.rowsFiller) +
            note +
            Array(tab.sectionFiller.length + headerName.length - note.length + 1).join(tab.rowsFiller)
          : row +
            tab.sectionSymbol +
            Array(tab.sectionFiller.length + headerName.length + tab.rowsSpacing + 1).join(tab.rowsFiller),
      );

      tabBlock.writeHeader(headerName);
      tabBlock.writeInstruction(new TabBlockWriteInstruction(chord, note));

      expect(tabBlock.rows).toEqual(expectedRows);
    });

    it(`should fill the footer with filler to the header end, preceded by tab's section symbol`, () => {
      const { tab, tabBlock } = getDefaultSetup();
      const headerName = 'some header name';

      const expectedFooter =
        tabBlock.footer +
        tab.sectionSymbol +
        Array(tab.sectionFiller.length + headerName.length + tab.rowsSpacing + 1).join(tab.sectionFiller);

      tabBlock.writeHeader(headerName);

      expect(tabBlock.footer).toBe(expectedFooter);
    });
  });

  describe('[writeFooter]', () => {
    it('should return a no success write result if an empty footer is given', () => {
      const { tabBlock } = getDefaultSetup();
      const footer = '  ';

      const result = tabBlock.writeFooter(footer);

      expect(result.success).toBe(false);
      expect(result.description).toBeTruthy();
    });

    it(`should fill the header with filler to the footer end, add the tab's section symbol and spacing`, () => {
      const { tab, tabBlock } = getDefaultSetup();
      const footer = 'some footer note';

      const expectedHeader =
        tabBlock.header +
        Array(footer.length + tab.sectionFiller.length + 1).join(tab.sectionFiller) +
        tab.sectionSymbol +
        Array(tab.rowsSpacing + 1).join(tab.sectionFiller);

      tabBlock.writeFooter(footer);

      expect(tabBlock.header).toBe(expectedHeader);
    });

    it(`should fill the rows with filler to the footer end, add the tab's section symbol and spacing`, () => {
      const { tab, tabBlock } = getDefaultSetup();
      const footer = 'some footer note';

      const expectedRows = tabBlock.rows.map(
        row =>
          row +
          Array(footer.length + tab.sectionFiller.length + 1).join(tab.rowsFiller) +
          tab.sectionSymbol +
          Array(tab.rowsSpacing + 1).join(tab.rowsFiller),
      );

      tabBlock.writeFooter(footer);

      expect(tabBlock.rows).toEqual(expectedRows);
    });

    it(`should write the given footer to the footer section, preceded by the tab's section symbol`, () => {
      const { tab, tabBlock } = getDefaultSetup();
      const footer = 'some footer note';

      const sectinRowsSpacingFiller = Array(tab.rowsSpacing + 1).join(tab.sectionFiller);
      const expectedFooter =
        sectinRowsSpacingFiller + footer + tab.sectionFiller + tab.sectionSymbol + sectinRowsSpacingFiller;

      tabBlock.writeFooter(footer);

      expect(tabBlock.footer).toBe(expectedFooter);
    });

    it('should not add filler to the rows if there already is space to add the given footer', () => {
      const { tab, tabBlock } = getDefaultSetup();
      const footer = 'some footer note';

      tabBlock.addSpacing(footer.length + 1);

      const expectedRows = tabBlock.rows.map(
        row => row + tab.sectionSymbol + Array(tab.rowsSpacing + 1).join(tab.rowsFiller),
      );

      tabBlock.writeFooter(footer);

      expect(tabBlock.rows).toEqual(expectedRows);
    });
  });
});
