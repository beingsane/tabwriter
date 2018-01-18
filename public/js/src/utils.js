const PdfWriter = require('./pdfwriter.js');

const utils = {
  wrapTab: function(data) {
    // Deep object cloning
    const tab = JSON.parse(JSON.stringify(data.tab));
    const extractionData = {
      chords: data.chords,
      maxLength: data.maxLength,
      minLength: data.minLength || 15,
      tabFiller: data.tabFiller || '-',
      chordSeparator: data.chordSeparator || ') ',
      tabBorder: data.tabBorder || '--'
    };

    const tabBlocks = [];
    if (this.isEmptyTab(tab, extractionData.tabFiller)) {
      return tabBlocks;
    }

    do {
      const currentBlock = this.extractTabBlock(tab, extractionData);
      tabBlocks.push(currentBlock);
    } while (!this.isEmptyTab(tab, extractionData.tabFiller));

    return tabBlocks;
  },

  isEmptyTab: function(tabObject, tabFiller) {
    let emptyTab = true;

    // Check number of empty rows
    const emptyRows = tabObject.core.reduce((total, row) => {
      const empty = (!row.length || row === Array(row.length + 1).join(tabFiller)) ? 1 : 0;
      return total + empty;
    }, 0);

    if (emptyRows < tabObject.core.length) {
      emptyTab = false;
    } else {
      // Check sections
      if (tabObject.sections !== null && tabObject.sections.length &&
          tabObject.sections !== Array(tabObject.sections.length + 1).join(' ')) {
        emptyTab = false;
      }
      // Check notes
      if (tabObject.notes !== null && tabObject.notes.length &&
          tabObject.notes !== Array(tabObject.notes.length + 1).join(' ')) {
        emptyTab = false;
      }
    }
    return emptyTab;
  },

  extractTabBlock: function(tabObject, extractionData) {
    // extractionData {
    //   chords: ['1', '2', '3', '4', '5', '6'],
    //   maxLength: 100,
    //   tabFiller: '-',
    //   chodSeparator: ') ',
    //   tabBorder: '--'
    // }
    const block = [];
    let introLength = extractionData.chords.length.toString().length +
        extractionData.chordSeparator.length;
    let contentEnd = extractionData.maxLength - introLength - 2 * extractionData.tabBorder.length;

    while (!this.isTabBreakable(tabObject, contentEnd - 1, extractionData.tabFiller) &&
           contentEnd > extractionData.minLength) {
      contentEnd--;
    }

    // Extract core
    extractionData.chords.forEach( (chord, i) => {
      let intro = chord + extractionData.chordSeparator;
      if (intro.length < introLength) {
        intro = Array(introLength - intro.length + 1).join(' ') + intro;
      }

      const content = tabObject.core[i].slice(0, contentEnd);
      let blockRow = intro + extractionData.tabBorder + content + extractionData.tabBorder;
      if (blockRow.length < extractionData.maxLength) {
        const filler = Array(extractionData.maxLength - blockRow.length + 1)
                           .join(extractionData.tabFiller);
        blockRow += filler;
      }
      block.push(blockRow);
      tabObject.core[i] = tabObject.core[i].slice(contentEnd, tabObject.core[i].length);
    });
    // Extract sections
    if (tabObject.sections !== null) {
      const secIntro = Array(introLength + 1).join(' ');
      const secBorder = Array(extractionData.tabBorder.length + 1).join(' ');
      const secContent = tabObject.sections.slice(0, contentEnd);
      let section = secIntro + secBorder + secContent + secBorder;
      if (section.length < extractionData.maxLength) {
        const filler = Array(extractionData.maxLength - section.length + 1).join(' ');
        section += filler;
      }
      block.unshift(section);
      tabObject.sections = tabObject.sections.slice(contentEnd, tabObject.sections.length);
    }
    // Extract Notes
    if (tabObject.notes !== null) {
      const noteIntro = Array(introLength + 1).join(' ');
      const noteBorder = Array(extractionData.tabBorder.length + 1).join(' ');
      const noteContent = tabObject.notes.slice(0, contentEnd);
      let note = noteIntro + noteBorder + noteContent + noteBorder;
      if (note.length < extractionData.maxLength) {
        const filler = Array(extractionData.maxLength - note.length + 1).join(' ');
        note += filler;
      }
      block.push(note);
      tabObject.notes = tabObject.notes.slice(contentEnd, tabObject.notes.length);
    }
    return block;
  },

  isTabBreakable(tabObject, idx, tabFiller) {
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
      if (row[idx] !== tabFiller && row[idx + 1] !== tabFiller) {
        breakable = false;
      }
    });
    return breakable;
  },

  maxStrLenNoWrap: function(element) {
    const FILLER = '-';
    const MAX_ITER = 200;
    const elementText = element.text();
    let fillerText = FILLER;
    let height;
    let lineHeight;
    let i = 0;

    do {
      element.text(fillerText);
      [lineHeight, height] = this.getElementHeights(element);
      fillerText += FILLER;

    } while (height === lineHeight && i < MAX_ITER);
    element.text(elementText);
    return (fillerText.length - 2);
  },

  getElementHeights: function(element) {
    const boxSizing = element.css('box-sizing');
    let height = parseInt(element.css('height'));

    if (boxSizing === 'border-box' || boxSizing === 'padding-box') {
      const paddingTop = parseInt(element.css('paddingTop'));
      const paddingBottom = parseInt(element.css('paddingBottom'));
      height -= paddingTop + paddingBottom;
    }

    if (boxSizing === 'border-box') {
      const borderTop = parseInt(element.css('borderTopWidth'));
      const borderBottom = parseInt(element.css('borderBottomWidth'));
      height -= borderTop + borderBottom;
    }

    const lineHeight = parseInt(element.css('lineHeight'));
    const heights = [lineHeight, height];
    return heights;
  },

  appendTable: function(element, nRows, nCols) {
    let htmlStr = '<table><tbody>';

    for (let i = 0; i < nRows; i++) {
      htmlStr += '<tr>';
      for (let j = 0; j < nCols; j++) {
        htmlStr += '<td></td>';
      }
      htmlStr += '</tr>';
    }
    htmlStr += '</tbody></table>';
    element.append(htmlStr);

    // return last element's table
    return element.find('table').slice(-1);
  },

  writePdf: function(data) {
    const tab = data.tab;
    const chords = data.chords;
    const title = data.title;
    const description = data.description;
    const filename = data.filename || 'tabwriter.pdf';
    const tabFiller = data.tabFiller || '-';

    const pdfWriter = new PdfWriter();
    const tabBlocks = this.wrapTab({
      tab: tab,
      chords: chords,
      maxLength: pdfWriter.maxStrLength,
      tabFiller: tabFiller
    });

    if (tabBlocks.length) {
      if (title) {
        pdfWriter.writeTitle(title);
      }

      if (description) {
        pdfWriter.writeDescription(description);
      }

      tabBlocks.forEach( (block) => {
        pdfWriter.writeTabBlock(block);
      });

      pdfWriter.writeNotes();
      pdfWriter.save(filename);
    }
  },

  getCloseIndexOf(str, syms, start) {
    // syms = {
    //   open: '(',
    //   close: ')'
    // }
    const startIdx = start || str.indexOf(syms.open) - 1;
    let newOpens = 0;
    let endIdx = startIdx;
    let thisLetter;

    for (let i = startIdx, n = str.length; i < n; i++) {
      thisLetter = str[i];
      if (thisLetter === syms.open) {
        newOpens++;
      }
      if (thisLetter === syms.close && newOpens !== 0) {
        newOpens--;
      }
      if (thisLetter === syms.close && newOpens === 0) {
        endIdx = i;
        break;
      }
    }
    return endIdx;
  },

  getFirstDifferentFrom(iterable, check, start, iteration) {
    const locStart = start || 0;
    const iter = iteration || 1;
    const n = iterable.length;
    let ret = locStart;
    if (n > 1) {
      if (iter > 0) {
        for (let i = locStart; i < n; i = i + iter) {
          if (iterable[i] != check) {
            ret = i;
            break;
          }
        }
      } else {
        for (let i = locStart; i > 0; i = i + iter) {
          if (iterable[i] != check) {
            ret = i;
            break;
          }
        }
      }
    }
    return ret;
  }

};

module.exports = utils;
