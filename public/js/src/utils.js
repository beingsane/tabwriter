const PdfWriter = require('./pdfwriter.js');

const utils = {
  wrapTab: function(data) {
    const tab = data.tab.slice();
    const chords = data.chords;
    const maxLength = data.maxLength;
    const tabFiller = data.tabFiller || '-';
    const chordSeparator = data.chordSeparator || ') ';
    const tabBorder = data.tabBorder || '--';

    const tabBlocks = [];
    if (this.isEmptyTab(tab)) {
      return tabBlocks;
    }

    do {
      const currentBlock = [];

      chords.forEach( (chord, j) => {
        const intro = chord + chordSeparator;
        let contentLength = maxLength - intro.length - 2 * tabBorder.length;
        let content = tab[j].slice(0, contentLength);
        // check for a note break
        if (tab[j][contentLength] !== tabFiller &&
              content.lastIndexOf(tabFiller) !== content.length - 1) {
          content = content.slice(0, content.lastIndexOf(tabFiller));
          contentLength = content.length;
        }

        let currentBlockRow = intro + tabBorder + content + tabBorder;
        if (currentBlockRow.length < maxLength) {
          const filler = Array(maxLength - currentBlockRow.length + 1).join(tabFiller);
          currentBlockRow += filler;
        }

        currentBlock.push(currentBlockRow);
        tab[j] = tab[j].slice(contentLength, tab[j].length);
      });

      tabBlocks.push(currentBlock);
    } while (!this.isEmptyTab(tab, tabFiller));

    return tabBlocks;
  },

  isEmptyTab: function(tab, tabFiller='-') {
    if (tab == null || !tab.length) {
      return true;
    }

    const emptyRows = tab.reduce((total, e) => {
      const empty = (!e.length || e === Array(e.length + 1).join(tabFiller)) ? 1 : 0;
      return total + empty;
    }, 0);

    return (emptyRows === tab.length ? true : false);
  },

  maxStrLenNoWrap: function(element) {
    const elementText = element.text();
    const FILLER = '-';
    let fillerText = FILLER;
    let height;
    let lineHeight;

    do {
      element.text(fillerText);
      [lineHeight, height] = this.getElementHeights(element);
      fillerText += FILLER;

    } while (height === lineHeight);
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
    const tabTitle = data.tabTitle;
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
      if (tabTitle) {
        pdfWriter.writeTitle(tabTitle);
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
  }

};

module.exports = utils;
