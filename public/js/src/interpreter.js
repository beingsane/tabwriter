class Interpreter {

  constructor(chords) {
    this.INSTRUCTIONS_PATTERN = /(\d*-[*?])|\w*\{.*?\}+|\w*\(.*?\)\{+.*?\}+|([^\s]+)/g;
    this.CHORD_FRET_SEPARATOR = '-';
    this.TAB_FILLER = '-';
    this.TAB_NOTE_SPACE = 2;
    this.chords = chords;
  }

  _writeNotes(notes) {
    const fret = [];
    const chord = [];

    notes.forEach( (note) => {
      const separatorIndex = note.indexOf(this.CHORD_FRET_SEPARATOR);
      const currentChord = Number(note.slice(0, separatorIndex));
      const currentFret = note.slice(separatorIndex + 1, note.length);
      if (currentChord <= this.chords.length) {
        chord.push(currentChord);
        fret.push(currentFret);
      }
    });

    if (!chord.length) {
      return;
    }

    const fretLength = fret.map( x => x.length );
    const maxFretLength = fretLength.reduce( (a, b) => {
      return Math.max(a, b);
    });

    this._tab.forEach( (tab, i) => {
      const index = chord.indexOf(i + 1);
      let fillerLength;
      if (index !== -1) {
        fillerLength = this.TAB_NOTE_SPACE + 1 + maxFretLength - fretLength[index];
        this._tab[i] += fret[index] + Array(fillerLength).join(this.TAB_FILLER);
      } else {
        fillerLength = maxFretLength + this.TAB_NOTE_SPACE + 1;
        this._tab[i] += Array(fillerLength).join(this.TAB_FILLER);
      }
    });
  }

  _readInstruction(instruction, errorObject) {
    const notes = instruction.match(/(\d*-.*)/g);
    if (notes !== null) {
      this._writeNotes(notes);
    } else {
      errorObject.push('<' + instruction + '>' + ' não é uma instrução válida.');
    }
  }

  convert(data) {
    const error = [];
    this._tab = Array(this.chords.length).fill('');

    const instructions = data.match(this.INSTRUCTIONS_PATTERN);

    if (instructions !== null) {
      instructions.forEach( (instruction) => {
        this._readInstruction(instruction, error);
      });
    }
    return error;
  }

  get chords() {
    return this._chords;
  }
  set chords(chords) {
    this._chords = chords;
    this._tab = Array(chords.length).fill('');
  }

  get tab() {
    return this._tab;
  }

}

module.exports = Interpreter;
