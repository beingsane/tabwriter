const logoURL = require('./logourl.js');

class PdfWriter {
  constructor() {
    this.MAX_BLOCK_LENGTH = 66;
    this.LINE_SPACE = 5;
    this.INITIAL_Y_POSITION = 35;
    this.MARGIN = 20;
    this.LOGO_Y_POSITION = 15;
    this.LOGO_HEIGHT = 10;
    this.LOGO_WIDTH = this.LOGO_HEIGHT * 297/55;
    this.PAGE_X_POSITION = 181;
    this.PAGE_Y_POSITION = 23;
    this.FOOTER_Y_POSITION = 285;
    this.DEFAULT_WIDTH = 210;
    this.TAB_SPACE = 7;
    this.HEIGHT = 295;
    this.RED_RGB = [170, 15, 15];
    this.GRAY_RGB = [70, 70, 70];

    this.doc = new jsPDF();
    this.pages = 1;
    this.fontType = null;
    this.xPosition = this.MARGIN;
    this.yPosition = this.INITIAL_Y_POSITION;
    this.width = this.DEFAULT_WIDTH;
    this._setDefaultStyle();
  }

  _setDefaultStyle() {
    this.doc.setFont('courier');
    this.doc.setFontType('normal');
    this.doc.setFontSize(12);
    this.doc.setTextColor(0, 0, 0);
    this.fontType = 'default';
  }

  _setNoteStyle() {
    this.doc.setFont('helvetica');
    this.doc.setFontType('normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(this.GRAY_RGB[0], this.GRAY_RGB[1], this.GRAY_RGB[2]);
    this.fontType = 'note';
  }

  _setTitleStyle() {
    this.doc.setFont('helvetica');
    this.doc.setFontType('normal');
    this.doc.setFontSize(12);
    this.doc.setTextColor(this.RED_RGB[0], this.RED_RGB[1], this.RED_RGB[2]);
    this.fontType = 'title';
  }

  _write(content, style) {
    if (style) {
      style();
    }
    const splitTitle = this.doc.splitTextToSize(content, this.width - 2 * this.MARGIN);
    this.doc.text(this.xPosition, this.yPosition, splitTitle);
    this.yPosition += splitTitle.length * this.LINE_SPACE;
    this._setDefaultStyle();
  }

  writeTitle(title) {
    const TITLE_MARGIN = 2;
    this._write(title, this._setTitleStyle.bind(this));
    this.yPosition += TITLE_MARGIN;
  }

  writeDescription(description) {
    this.xPosition += this.TAB_SPACE;
    this.width -= this.TAB_SPACE;
    this._write(description, this._setNoteStyle.bind(this));
    this.xPosition -= this.TAB_SPACE;
    this.width += this.TAB_SPACE;
  }

  writeTabBlock(block) {
    if (this.yPosition + this.LINE_SPACE * block.length > this.HEIGHT - this.MARGIN) {
      this.doc.addPage();
      this.yPosition = this.INITIAL_Y_POSITION;
      this.pages += 1;
    } else {
      this.yPosition += this.LINE_SPACE;
    }

    block.forEach( (blockRow) => {
      this.doc.text(this.xPosition, this.yPosition, blockRow);
      this.yPosition += this.LINE_SPACE;
    });
  }

  writeNotes() {
    this._setNoteStyle();
    const date = new Date();
    const footer = 'Criado com Tab-Writer (tabwriter.herokuapp.com) em ' +
                   date.toLocaleDateString() + '.';

    for (let i = 0; i < this.pages; i++) {
      this.doc.setPage(i + 1);
      this.doc.addImage(logoURL, 'JPEG', this.xPosition, this.LOGO_Y_POSITION,
                        this.LOGO_WIDTH, this.LOGO_HEIGHT);

      this.doc.text(this.PAGE_X_POSITION, this.PAGE_Y_POSITION,
                    (i + 1).toString() + '/' + this.pages.toString());

      this.doc.text(this.xPosition, this.FOOTER_Y_POSITION, footer);
    }

    this._setDefaultStyle();
  }

  save(filename) {
    this.doc.save(filename);
  }

  get maxBlockLength() {
    return this.MAX_BLOCK_LENGTH;
  }

}

module.exports = PdfWriter;
