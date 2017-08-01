$(window).ready(function() {
  setBodyMargin();

  let input = '#input';
  let dashboard = '#dashboard';
  let tabWriter = new TabWriter(input, dashboard);

  $(window).on('resize', function() {
    setBodyMargin();
    tabWriter.instrToTables();
  });

  $('#btn-create').on('click', function() {
    tabWriter.getInstr();
    tabWriter.instrToTables();
    this.blur();
  });

  $('#btn-delete').on('click', function() {
    $(input).val('');
    sessionStorage.setItem('tabwriter-input', '');
    tabWriter.getInstr();
    this.blur();
  });

  $('#btn-download').on('click', function() {
    tabWriter.getInstr();
    tabWriter.instrToPdf();
    this.blur();
  });

  $(input).on('input', function() {
    sessionStorage.setItem('tabwriter-input', $(this).val());
  });

  if (sessionStorage.getItem('tabwriter-input')) {
    $(input).val(sessionStorage.getItem('tabwriter-input'));
  }
});

String.prototype.allIndexesOf = function(character) {
  let indexes = [];
  let k = 0;
  let i = 0;

  while (k !== -1) {
    k = this.indexOf(character, i);
    if (k !== -1) {
      indexes.push(k);
      i = k + 1;
    }
  }

  return indexes;
}

function setBodyMargin() {
  let navHeight = $('nav').css('height');
  navHeight = Number(navHeight.slice(0, navHeight.indexOf("px")))
  $('body').css('margin-top', navHeight + 15);
}

function pixelToNumber(pixelValue) {
  let numberStr = pixelValue.slice(0, pixelValue.indexOf("px"));
  let numberInt = Math.floor(Number(numberStr));
  return numberInt;
}

function TabWriter(input, dashboard) {

  this.TD_MAX_STRING_LENGTH = 150;
  this.NOTE_SEPARATOR_IN_TAB = '--';
  this.NOTE_SEPARATOR_IN_INPUT = ' ';
  this.NOTE_NULL_CHARACTER = '-';
  this.CHORD_NAME_SEPARATOR = ') ';
  this.TAB_BORDER = '--';
  this.CHORDS = ['e', 'B', 'G', 'D', 'A', 'E'];

  this.input = input;
  this.dashboard = dashboard;

  this.instr = null;
  this.tab = null;

  this.getInstr = function() {
    let instr = $(this.input).val();
    this.instr = (instr != "" ? this.NOTE_SEPARATOR_IN_INPUT + instr +
                 this.NOTE_SEPARATOR_IN_INPUT : null);
  }

  this.instrToTab = function() {
    if (this.instr == null) {
      this.deleteAllTables();
      return;
    }
    let tabRows = Array(this.CHORDS.length).fill('');
    let spacesIdx = this.instr.allIndexesOf(this.NOTE_SEPARATOR_IN_INPUT);

    for (var i = 0; i < spacesIdx.length - 1; i++) {
      let note = this.instr.slice(spacesIdx[i] + 1, spacesIdx[i + 1]);
      let [chord, fret] = this.getChordAndFret(note);

      for (var j = 0; j < tabRows.length; j++) {
        if (j === chord - 1) {
          tabRows[j] += fret + this.NOTE_SEPARATOR_IN_TAB;
        } else {
          tabRows[j] += Array(fret.length + 1).join(this.NOTE_NULL_CHARACTER) +
                        this.NOTE_SEPARATOR_IN_TAB;
        }
      }
    }
    this.tab = tabRows;
  }

  this.wrapTab = function(maxLength) {
    let tabBlocks = [];
    let k = 0;
    let tab = this.tab;
    if (tab === null) {
      return null;
    }

    do {
      k += 1;
      let block = [];

      for (var i = 0; i < this.CHORDS.length; i++) {
        let intro = this.CHORDS[i] + this.CHORD_NAME_SEPARATOR;
        let content = tab[i].slice(0, maxLength - intro.length - 2 * this.TAB_BORDER.length);
        let blockRow = intro + this.TAB_BORDER + content + this.TAB_BORDER;

        if (blockRow.length < maxLength){
          let filler = Array(maxLength - blockRow.length + 1).join("-");
          blockRow += filler;
        }

        block.push(blockRow);

        tab[i] = tab[i].slice(maxLength - intro.length - 2 * this.TAB_BORDER.length, tab[i].length);
      }

      tabBlocks.push(block);

    } while(!this.isEmptyTab(tab) && k < 25);

    return tabBlocks;
  }

  this.instrToTables = function() {
    this.instrToTab();
    if (this.instr == null) {
      return;
    }

    let td = this.createTable(1, 1)
    let maxLength = this.maxStrLenNoWrap($(td[0]));

    this.deleteAllTables();
    let tabBlocks = this.wrapTab(maxLength);

    for (var i = 0; i < tabBlocks.length; i++) {
      let table = this.createTable(this.CHORDS.length, 1);

      for (var j = 0; j < this.CHORDS.length; j++) {
        $(table[j]).text(tabBlocks[i][j]);
      }
    }
  }

  this.instrToPdf = function() {
    this.instrToTab();
    if (this.instr == null) {
      return;
    }

    let pdfWriter = new TabWriterJsPdf();
    let tabBlocks = this.wrapTab(pdfWriter.MAX_STRING_LENGTH);

    pdfWriter.setNormalStyle();
    for (var i = 0; i < tabBlocks.length; i++) {
      pdfWriter.writeBlock(tabBlocks[i]);
    }

    pdfWriter.setHeaderStyle();
    pdfWriter.writeHeadersAndFooters();
    pdfWriter.save("tabwriter.pdf");
  }

  this.isEmptyTab = function(tab) {
    let emptyRows = 0;
    for (var i = 0; i < tab.length; i ++) {
      let row = tab[i];
      if (row === Array(row.length + 1).join(this.NOTE_NULL_CHARACTER)) {
        emptyRows += 1;
      }
    }
    return (emptyRows === this.CHORDS.length ? true : false);
  }

  this.getChordAndFret = function(note) {
    let dashIdx = note.indexOf(this.NOTE_NULL_CHARACTER);
    let chord = Number(note.slice(0, dashIdx));
    let fret = note.slice(dashIdx + 1, note.length);
    return [chord, fret];
  }

  this.createTable = function(rows, cols) {
    let html = '<table><tbody>';
    for (var i = 0; i < rows; i++) {
      html += '<tr>';
      for (var j = 0; j < cols; j++) {
        html += '<td></td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    $(this.dashboard).append(html);

    let createdTds = $(this.dashboard + ' td').slice(-rows);
    return createdTds;
  }

  this.deleteAllTables = function() {
    $(this.dashboard).html('');
  }

  this.maxStrLenNoWrap = function(element) {
    let elementText = element.text();
    let fillText = '=';

    do {
      element.text(fillText);
      var [lineHeight, height] = this.getElementHeights(element);
      fillText += "=";
    } while (height === lineHeight && fillText.length < this.TD_MAX_STRING_LENGTH + 2);

    element.text(elementText);
    return (fillText.length - 2);
  }

  this.pixelToNumber = function(pixelValue) {
    let numberStr = pixelValue.slice(0, pixelValue.indexOf("px"));
    let numberInt = Math.floor(Number(numberStr));
    return numberInt;
  }

  this.getElementHeights = function(element) {
    let boxSizing = element.css('box-sizing');
    let lineHeight = this.pixelToNumber(element.css('lineHeight'));
    let height = this.pixelToNumber(element.css('height'));

    if (boxSizing === 'border-box' || boxSizing === 'padding-box') {
      let paddingTop = this.pixelToNumber(element.css('paddingTop'));
      let paddingBottom = this.pixelToNumber(element.css('paddingBottom'));
      height -= paddingTop + paddingBottom;
    }

    if (boxSizing === 'border-box') {
      let borderTop = this.pixelToNumber(element.css('borderTopWidth'));
      let borderBottom = this.pixelToNumber(element.css('borderBottomWidth'));
      height -= borderTop + borderBottom;
    }

    let heights = [lineHeight, height];
    return heights;
  }

}

function TabWriterJsPdf() {
  this.MAX_STRING_LENGTH = 66;
  this.LINE_SPACE = 5;
  this.INITIAL_Y_POSITION = 35;

  this.LOGO_Y_POSITION = 15;
  this.LOGO_HEIGHT = 10;
  this.LOGO_WIDTH = this.LOGO_HEIGHT * 320/48;

  this.PAGE_X_POSITION = 181;
  this.PAGE_Y_POSITION = 23;

  this.FOOTER_Y_POSITION = 285;

  this.doc = new jsPDF();
  this.pages = 1;

  this.style = null;
  this.width = 210;
  this.height = 295;
  this.xPosition = 20;
  this.yPosition = this.INITIAL_Y_POSITION;

  this.setNormalStyle = function() {
    this.doc.setFont('courier');
    this.doc.setFontType('normal');
    this.doc.setFontSize(12);
    this.style = 'normal';
  }

  this.setHeaderStyle = function() {
    this.doc.setFont("helvetica");
    this.doc.setFontSize(9);
    this.style = 'header';
  }

  this.writeBlock = function(block) {
    if (this.yPosition + this.LINE_SPACE * block.length > this.height - 20) {
      this.doc.addPage();
      this.yPosition = this.INITIAL_Y_POSITION;
      this.pages += 1;
    } else {
      this.yPosition += this.LINE_SPACE;
    }

    for (var i = 0; i < block.length; i++) {
      this.doc.text(this.xPosition, this.yPosition, block[i]);
      this.yPosition += this.LINE_SPACE;
    }
  }

  this.writeHeadersAndFooters = function() {
    let date = new Date();
    let footer = "Criado com Tab-Writer (tabwriter.herokuapp.com) em " +
                 date.getDate() + "/" + (date.getMonth() + 1) + "/" +
                 date.getFullYear() + ".";

    for (var i = 0; i < this.pages; i++) {
      this.doc.setPage(i+1);
      this.doc.addImage(logoURL, 'JPEG', this.xPosition, this.LOGO_Y_POSITION,
                        this.LOGO_WIDTH, this.LOGO_HEIGHT);

      this.doc.text(this.PAGE_X_POSITION, this.PAGE_Y_POSITION,
                    (i+1).toString() + "/" + this.pages.toString());

      this.doc.text(this.xPosition, this.FOOTER_Y_POSITION, footer);
    }
  }

  this.save = function(name) {
    this.doc.save(name);
  }

}
