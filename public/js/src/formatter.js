const PdfWriter = require('./pdfwriter.js');
const utils = require('./utils.js');

class Formatter {
  constructor() {
    this.CHORD_SEPARATOR = ') ';
    this.INTRO_FILLER = ' ';
    this.MIN_ROW_LENGTH = 15;
    this.SEC_FILLER = ' ';
    this.TAB_BORDER_SPACE = 2;
    this.TAB_FILLER = '-';
  }

  _extractCore(tabObject, blockArr, extracData) {
    // Extract core
    extracData.chords.forEach( (chord, i) => {

      let intro = chord + this.CHORD_SEPARATOR;
      if (intro.length < extracData.introLength) {
        intro = Array(extracData.introLength - intro.length + 1).join(this.INTRO_FILLER) + intro;
      }

      const content = tabObject.core[i].slice(0, extracData.contentEnd);
      const border = Array(this.TAB_BORDER_SPACE + 1).join(this.TAB_FILLER);
      let blockRow = intro + border + content + border;
      if (blockRow.length < extracData.rowLength) {
        const filler = Array(extracData.rowLength - blockRow.length + 1)
                           .join(this.TAB_FILLER);
        blockRow += filler;
      }

      blockArr.push(blockRow);
      tabObject.core[i] = tabObject.core[i].slice(extracData.contentEnd, tabObject.core[i].length);
    });
  }

  _extractFromKey(tabObject, blockArr, extractData, key) {
    if (tabObject[key] === undefined) {
      return;
    } else if (tabObject[key] === null) {
      return;
    } else {

      const intro = Array(extractData.introLength + 1).join(this.SEC_FILLER);
      const border = Array(this.TAB_BORDER_SPACE + 1).join(this.SEC_FILLER);
      const content = tabObject[key].slice(0, extractData.contentEnd);

      let row = intro + border + content + border;
      if (row.length < extractData.rowLength) {
        const filler = Array(extractData.rowLength - row.length + 1).join(this.SEC_FILLER);
        row += filler;
      }

      if (key === 'sections') {
        blockArr.unshift(row);
      } else {
        blockArr.push(row);
      }

      tabObject[key] = tabObject[key].slice(extractData.contentEnd, tabObject[key].length);
    }
  }

  _extractBlock(tabObject, extractData) {
    const block = [];
    const introLength = extractData.chords.length.toString().length + this.CHORD_SEPARATOR.length;

    let contentEnd = extractData.rowLength - introLength - 2 * this.TAB_BORDER_SPACE;
    while (!this._isTabBreakable(tabObject, contentEnd - 1, this.TAB_FILLER) &&
           contentEnd > this.MIN_ROW_LENGTH) {
      contentEnd--;
    }

    extractData.contentEnd = contentEnd;
    extractData.introLength = introLength;

    this._extractCore(tabObject, block, extractData);
    this._extractFromKey(tabObject, block, extractData, 'sections');
    this._extractFromKey(tabObject, block, extractData, 'notes');

    return block;
  }

  _isTabBreakable(tabObject, idx) {
    let breakable = true;
    // Check if break point is after tab's end
    if (idx > tabObject.core[0].length - 1) {
      // Check if it is also after sections' and notes' end
      if ((tabObject.sections === null || idx > tabObject.sections.length - 1) &&
          (tabObject.notes === null || idx > tabObject.notes.length - 1)) {
        return breakable;
      }
    }
    // Check sections to be breakable at idx
    if (tabObject.sections !== null) {
      let sectionRange = tabObject.sections.slice(idx - 1, idx + 2);
      if (sectionRange !== Array(sectionRange.length + 1).join(' ')) {
        breakable = false;
      }
    }
    // Check notes to be breakable at idx
    if (tabObject.notes !== null) {
      let notesRange = tabObject.notes.slice(idx - 1, idx + 2);
      if (notesRange !== Array(notesRange.length + 1).join(' ')) {
        breakable = false;
      }
    }
    // Check core to be breakable at idx
    tabObject.core.forEach( (row) => {
      if (row[idx] !== this.TAB_FILLER && row[idx + 1] !== this.TAB_FILLER) {
        breakable = false;
      }
    });
    return breakable;
  }

  format(tabObject, maxLength) {
    const blocks = [];
    if (utils.isEmptyTab(tabObject, this.TAB_FILLER)) {
      return blocks;
    }
    // Deep object cloning
    const tab = JSON.parse(JSON.stringify(tabObject));
    const chordsNumber = tab.core.length;
    const chordsArr = Array.from({length: chordsNumber}, (val, i) => (i + 1).toString());
    const extractData = {
      rowLength: maxLength,
      chords: chordsArr
    };

    let extractedBlock;
    do {
      extractedBlock = this._extractBlock(tab, extractData);
      blocks.push(extractedBlock);
    } while (!utils.isEmptyTab(tab, this.TAB_FILLER));

    return blocks;
  }

  formatToPdf(tabObject, data) {
    // data {
    //   title: Title,
    //   description: Description,
    //   filename: Filename
    // }
    const pdfWriter = new PdfWriter();
    const tabBlocks = this.format(tabObject, pdfWriter.maxBlockLength);
    const filename = data.filename || 'tabwriter.pdf';

    if (tabBlocks.length) {

      if (data.title) {
        pdfWriter.writeTitle(data.title);
      }

      if (data.description) {
        pdfWriter.writeDescription(data.description);
      }

      tabBlocks.forEach( (block) => {
        pdfWriter.writeTabBlock(block);
      });

      pdfWriter.writeNotes();
      pdfWriter.save(filename);
    }
  }

  get borderSpace() {
    return this.TAB_BORDER_SPACE;
  }
  set borderSpace(space) {
    this.TAB_BORDER_SPACE = space;
  }

  get chordSeparator() {
    return this.CHORD_SEPARATOR;
  }
  set chordSeparator(separator) {
    this.CHORD_SEPARATOR = separator;
  }

  get introFillerChar() {
    return this.INTRO_FILLER;
  }
  set introFillerChar(character) {
    if (character.length === 1) {
      this.INTRO_FILLER = character;
    }
  }

  get tabFillerChar() {
    return this.TAB_FILLER;
  }
  set tabFillerChar(character) {
    if (character.length === 1) {
      this.TAB_FILLER = character;
    }
  }

}

module.exports = Formatter;
