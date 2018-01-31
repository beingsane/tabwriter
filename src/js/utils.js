const utils = {
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
