$(document).ready(function() {

  let input = '#input';
  let dashboard = '#dashboard';
  let tabWriter = new TabWriter(input, dashboard);
  let titleFormVisible = false;

  $(window).on('resize', function() {
    tabWriter.instrToTables();
  });

  $('#btn-create').on('click', function() {
    tabWriter.getInstr();
    tabWriter.instrToTables(function() {
      $('.output-control').css('visibility', 'visible');
    }, function() {
      tabWriter.deleteAllTables();
      $('.output-control').css('visibility', 'hidden');
    });
    this.blur();
  });

  $('#btn-delete').on('click', function() {
    tabWriter.deleteAllTables(function() {
      sessionStorage.setItem('tabwriter-input', '');
      $(tabWriter.input).val('');
      tabWriter.getInstr();
      $('.output-control').css('visibility', 'hidden');
    });
    this.blur();
  });

  $('#btn-download').on('click', function() {
    if (titleFormVisible) {
      let title = $('.output-control .input-group input').val();
      tabWriter.instrToPdf(title, outputControlHideInput);
      $('.output-control .input-group input').val('');
    } else {
      outputControlShowInput();
    }
    titleFormVisible = !titleFormVisible;
    this.blur();
  });

  $(input).on('input', function() {
    sessionStorage.setItem('tabwriter-input', $(this).val());
  });

  if (sessionStorage.getItem('tabwriter-input')) {
    $(input).val(sessionStorage.getItem('tabwriter-input'));
  }

});

function outputControlShowInput() {
  $('.output-control .btn-custom').animate({
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  }, 400, function() {
    $('.output-control').animate({
      width: '100%'
    }, 400);
    $('.output-control .input-group input').css('display', 'table-cell');
    $('.output-control .input-group input').animate({
      borderWidth: '1px',
      padding: '6px 12px'
    }, 400);
    $('.output-control .btn-custom').html(
      '<i class="fa fa-download" aria-hidden="true"></i>'
    );
  });
}

function outputControlHideInput() {
  $('.output-control').animate({
    width: '60px'
  }, 400);
  $('.output-control .input-group input').animate({
    borderWidth: '0',
    padding: '0'
  }, 400, function() {
    $('.output-control .input-group input').css('display', 'none');
    $('.output-control .btn-custom').animate({
      borderTopLeftRadius: '40px',
      borderBottomLeftRadius: '40px',
    }, 400);
    $('.output-control .btn-custom').html(
      '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>'
    );
  });
}

String.prototype.allIndexesOf = function(character) {
  let characterIndexes = [];
  let characterIndex = 0;
  let startIndex = 0;

  while (characterIndex !== -1) {
    characterIndex = this.indexOf(character, startIndex);
    if (characterIndex !== -1) {
      characterIndexes.push(characterIndex);
      startIndex = characterIndex + 1;
    }
  }

  return characterIndexes;
};

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

}

TabWriter.prototype.getInstr = function() {
  let instr = $(this.input).val();
  this.instr = (instr ? this.NOTE_SEPARATOR_IN_INPUT + instr +
               this.NOTE_SEPARATOR_IN_INPUT : null);
  this.instrToTab();
};

TabWriter.prototype.instrToTab = function() {
  let tabRows;
  let spacesIdx;
  let note;
  let chord;
  let fret;

  if (this.instr === null) {
    this.tab = null;
    return;
  }

  tabRows = Array(this.CHORDS.length).fill('');
  spacesIdx = this.instr.allIndexesOf(this.NOTE_SEPARATOR_IN_INPUT);

  for (let i = 0; i < spacesIdx.length - 1; i++) {
    note = this.instr.slice(spacesIdx[i] + 1, spacesIdx[i + 1]);
    [chord, fret] = this.getChordAndFret(note);

    for (let j = 0; j < tabRows.length; j++) {
      if (j === chord - 1) {
        tabRows[j] += fret + this.NOTE_SEPARATOR_IN_TAB;
      } else {
        tabRows[j] += Array(fret.length + 1).join(this.NOTE_NULL_CHARACTER) +
                      this.NOTE_SEPARATOR_IN_TAB;
      }
    }
  }
  this.tab = tabRows;
};

TabWriter.prototype.wrapTab = function(maxLength) {
  let tabBlocks = [];
  let block;
  let intro;
  let content;
  let blockRow;
  let tab;
  let k = 0;

  if (this.tab === null) {
    return null;
  }

  tab = this.tab.slice();

  do {
    block = [];
    k += 1;

    for (let i = 0; i < this.CHORDS.length; i++) {
      intro = this.CHORDS[i] + this.CHORD_NAME_SEPARATOR;
      content = tab[i].slice(0, maxLength - intro.length - 2 * this.TAB_BORDER.length);
      blockRow = intro + this.TAB_BORDER + content + this.TAB_BORDER;

      if (blockRow.length < maxLength){
        let filler = Array(maxLength - blockRow.length + 1).join("-");
        blockRow += filler;
      }

      block.push(blockRow);

      tab[i] = tab[i].slice(maxLength - intro.length - 2 * this.TAB_BORDER.length,
                            tab[i].length);
    }

    tabBlocks.push(block);

  } while(!this.isEmptyTab(tab) && k < 25);

  return tabBlocks;
};

TabWriter.prototype.instrToTables = function(callbackSuccess, callbackFailure) {
  let singleCellTable;
  let maxLength;
  let tabBlocks;
  let table;
  let nRows = this.CHORDS.length;
  let nCols = 1;

  if (this.tab === null) {
    if (callbackFailure) {
      callbackFailure();
    }
    return;
  }

  singleCellTable = this.createTable(1, 1);
  maxLength = this.maxStrLenNoWrap($(singleCellTable[0]));

  this.deleteAllTables();
  tabBlocks = this.wrapTab(maxLength);

  if (tabBlocks) {
    for (let i = 0; i < tabBlocks.length; i++) {
      table = this.createTable(nRows, nCols);

      for (let j = 0; j < nRows; j++) {
        $(table[j]).text(tabBlocks[i][j]);
      }
    }
  }

  if (callbackSuccess) {
    callbackSuccess();
  }
};

TabWriter.prototype.instrToPdf = function(title, callback) {
  let pdfWriter;
  let tabBlocks;

  if (this.tab === null) {
    return;
  }

  pdfWriter = new TabWriterJsPdf();
  tabBlocks = this.wrapTab(pdfWriter.MAX_STRING_LENGTH);

  if (tabBlocks) {
    if (title) {
      pdfWriter.setTitleStyle();
      pdfWriter.writeTitle(title);
    }

    pdfWriter.setNormalStyle();
    for (let i = 0; i < tabBlocks.length; i++) {
      pdfWriter.writeBlock(tabBlocks[i]);
    }

    pdfWriter.setHeaderStyle();
    pdfWriter.writeHeadersAndFooters();
    pdfWriter.save("tabwriter.pdf");
  }

  if (callback) {
    callback();
  }
};

TabWriter.prototype.isEmptyTab = function(tab) {
  let emptyRows = 0;
  let row;

  for (let i = 0; i < tab.length; i++) {
    row = tab[i];
    if (row === Array(row.length + 1).join(this.NOTE_NULL_CHARACTER)) {
      emptyRows += 1;
    }
  }
  return (emptyRows === this.CHORDS.length ? true : false);
};

TabWriter.prototype.getChordAndFret = function(note) {
  let dashIdx = note.indexOf(this.NOTE_NULL_CHARACTER);
  let chord = Number(note.slice(0, dashIdx));
  let fret = note.slice(dashIdx + 1, note.length);
  return [chord, fret];
};

TabWriter.prototype.createTable = function(nRows, nCols) {
  let html = '<table><tbody>';
  let createdTds;

  for (let i = 0; i < nRows; i++) {
    html += '<tr>';
    for (let j = 0; j < nCols; j++) {
      html += '<td></td>';
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  $(this.dashboard).append(html);

  createdTds = $(this.dashboard + ' td').slice(-nRows);
  return createdTds;
};

TabWriter.prototype.deleteAllTables = function(callback) {
  $(this.dashboard).html('');
  if (callback) {
    callback();
  }
};

TabWriter.prototype.maxStrLenNoWrap = function(element) {
  let elementText = element.text();
  let fillText = '=';
  let height;
  let lineHeight;

  do {
    element.text(fillText);
    [lineHeight, height] = this.getElementHeights(element);
    fillText += "=";
  } while (height === lineHeight && fillText.length < this.TD_MAX_STRING_LENGTH + 2);

  element.text(elementText);
  return (fillText.length - 2);
};

TabWriter.prototype.getElementHeights = function(element) {
  let boxSizing = element.css('box-sizing');
  let lineHeight = pixelToNumber(element.css('lineHeight'));
  let height = pixelToNumber(element.css('height'));
  let heights;

  if (boxSizing === 'border-box' || boxSizing === 'padding-box') {
    let paddingTop = pixelToNumber(element.css('paddingTop'));
    let paddingBottom = pixelToNumber(element.css('paddingBottom'));
    height -= paddingTop + paddingBottom;
  }

  if (boxSizing === 'border-box') {
    let borderTop = pixelToNumber(element.css('borderTopWidth'));
    let borderBottom = pixelToNumber(element.css('borderBottomWidth'));
    height -= borderTop + borderBottom;
  }

  heights = [lineHeight, height];
  return heights;
};

function TabWriterJsPdf() {

  this.MAX_STRING_LENGTH = 66;
  this.LINE_SPACE = 5;
  this.INITIAL_Y_POSITION = 35;
  this.MARGIN = 20;
  this.LOGO_Y_POSITION = 15;
  this.LOGO_HEIGHT = 10;
  this.LOGO_WIDTH = this.LOGO_HEIGHT * 320/48;
  this.PAGE_X_POSITION = 181;
  this.PAGE_Y_POSITION = 23;
  this.FOOTER_Y_POSITION = 285;
  this.WIDTH = 210;
  this.HEIGHT = 295;

  this.doc = new jsPDF();
  this.pages = 1;
  this.style = null;
  this.xPosition = this.MARGIN;
  this.yPosition = this.INITIAL_Y_POSITION;

}

TabWriterJsPdf.prototype.setNormalStyle = function() {
  this.doc.setFont('courier');
  this.doc.setFontType('normal');
  this.doc.setFontSize(12);
  this.style = 'normal';
};

TabWriterJsPdf.prototype.setHeaderStyle = function() {
  this.doc.setFont("helvetica");
  this.doc.setFontSize(9);
  this.style = 'header';
};

TabWriterJsPdf.prototype.setTitleStyle = function() {
  this.doc.setFont("helvetica");
  this.doc.setFontSize(12);
  this.style = 'title';
};

TabWriterJsPdf.prototype.writeTitle = function(title) {
  let splitTitle = this.doc.splitTextToSize(title, this.WIDTH - 2 * this.MARGIN);
  this.doc.text(this.xPosition, this.yPosition, splitTitle);
  this.yPosition += splitTitle.length * this.LINE_SPACE;
};

TabWriterJsPdf.prototype.writeBlock = function(block) {
  if (this.yPosition + this.LINE_SPACE * block.length > this.HEIGHT - this.MARGIN) {
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
};

TabWriterJsPdf.prototype.writeHeadersAndFooters = function() {
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
};

TabWriterJsPdf.prototype.save = function(name) {
  this.doc.save(name);
};
