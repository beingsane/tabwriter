const utils = require('./utils.js');

class Interpreter {

  constructor(chordsNumber, mainSpacing) {
    this.CHORD_FRET_SEPARATOR = '-';
    this.TAB_FILLER = '-';
    this.DEFAULT_CHORDS_NUMBER = 6;
    this.DEFAULT_SPACING = 2;

    this.mainSpacing = mainSpacing || this.DEFAULT_SPACING;
    this.chordsNumber = chordsNumber || this.DEFAULT_CHORDS_NUMBER;
    this.currentSpacing = this.mainSpacing;

    this.methods = {
      default: function(noteStr, errorObject) {
        this._writeNotes([noteStr], errorObject);
      },

      repeat: function(data, errorObject) {
        // Check data
        if (!this._isDataSet(data, {args: true, instr: true}, errorObject)) {
          return;
        }
        // Check if arg is a valid number
        const n = Number(data.args);
        if (isNaN(n) || !Number.isInteger(n) || n < 1) {
          errorObject.push('Erro ao usar o método <' + data.funcName + '>: O valor de repetições ' +
                           'fornecido <' + data.args + '> não é válido.');
          return;
        }
        const errorLengthPrev = errorObject.length;
        // Read instructions
        const notes = this._parseInstructions(data.instr);
        for (let i = 0; i < n; i++) {
          notes.forEach( (note) => {
            this._readInstruction(note, errorObject);
          });
        }
        // Remove repeated error messages
        const errorLengthAfter = errorObject.length;
        if (errorLengthAfter !== errorLengthPrev) {
          const newErrors = errorLengthAfter - errorLengthPrev;
          errorObject.splice(errorLengthPrev, (n - 1) * newErrors / n);
        }
      },

      merge: function(data, errorObject) {
        // Check data
        if (!this._isDataSet(data, {args: false, instr: true}, errorObject)) {
          return;
        }
        // Check if there were given args
        if (data.hasArgs) {
          errorObject.push('Atenção ao usar o método <' + data.funcName + '>: Este método não faz '+
                           'uso de argumentos. O argumento fornecido <' + data.args +
                           '> não foi utilizado.');
        }
        // Check if there is a function call nested inside
        const functionElements = data.instr.match(/[a-zA-Z]+\s*\(/g);
        if (functionElements) {
          errorObject.push('Erro ao usar o método <' + data.funcName + '>: Não foi possível ' +
                           'avaliar a expressão <' + functionElements[0] + '>. Métodos não ' +
                           'podem ser chamados dentro desse método.');
          return;
        }
        // Read instructions
        const notes = this._parseInstructions(data.instr);
        const notesData = this._parseChordAndFret(notes, errorObject);

        // Check for multiple entries in the same chord
        if (notesData.chords.length) {
          const multipleChords = notesData.chords.filter( (chord, i, chords) => {
            return (chords.indexOf(chord) !== chords.lastIndexOf(chord)) ? true: false;
          });
          if (multipleChords.length) {
            errorObject.push('Erro ao usar o método <' + data.funcName + '>: Detectada mais ' +
                             'de uma instrução referente à mesma corda.');
            return;
          }
        }
        // Write notes
        this._writeNotes(notesData, errorObject);
      },

      space: function(data, errorObject) {
        // Check data
        if (!this._isDataSet(data, {args: true, instr: false}, errorObject)) {
          return;
        }
        // Check if there were given notes
        if (data.hasInstr) {
          errorObject.push('Atenção ao usar o método <' + data.funcName + '>: Este ' +
                           'método não faz uso de instruções. A instrução fornecida <' +
                           data.instr + '> não foi utilizada.');
        }
        // Check if arg is a valid number
        const newSpace = Number(data.args);
        if (isNaN(newSpace) || !Number.isInteger(newSpace) || newSpace < 1) {
          errorObject.push('Erro ao usar o método <' + data.funcName + '>: O valor de ' +
                           'espaçamento fornecido <' + data.args + '> não é válido. ' +
                           'Para usar o espaçamento padrão use <space(2)>.');
          return;
        }
        // Correct last tab space if necessary
        if (!utils.isEmptyTab(this._tab, this.TAB_FILLER = '-')) {
          const diffSpace = newSpace - this.currentSpacing;
          if (diffSpace > 0) {
            this._tab.forEach( (tab, i) => {
              this._tab[i] += Array(diffSpace + 1).join(this.TAB_FILLER);
            });
          } else if (diffSpace < 0) {
            this._tab.forEach( (tab, i) => {
              this._tab[i] = tab.slice(0, diffSpace);
            });
          }
        }
        // Update tab space
        this.currentSpacing = newSpace;
      },
    };

    // Set methods' short notations
    this.methods.m = this.methods.merge;
    this.methods.r = this.methods.repeat;
    this.methods.s = this.methods.space;
  }

  _isDataSet(data, expectedData, errorObject) {
    // expectedData {
    //   data: true or false
    // }
    let dataSet = true;
    for (let key in expectedData) {
      if (expectedData[key] && key in data) {
        if (data[key] === null || data[key] === '' ||
            data[key] === Array(data[key].length + 1).join(' ')) {
          dataSet = false;
        }
      }
    }
    if (!dataSet) {
      errorObject.push('Erro ao usar o método <' + data.funcName + '>: ' +
                       'Verifique parâmetros e instruções.');
    }
    return dataSet;
  }

  _extractNextInstruction(instructionStr, start) {
    // No spaces allowed between function name and arguments
    let instructionStart = start || 0;
    let instructionEnd = instructionStr.length;
    let openParenthesis = 0;
    let openCurlyBraces = 0;
    let onInstruction = false;
    let lookForEnd = false;
    let foundEnd = false;
    let nextLetter;

    for (let i = start, n = instructionStr.length; i < n; i++) {
      let thisLetter = instructionStr[i];
      if (thisLetter !== ' ' && !onInstruction) {
        instructionStart = i;
        onInstruction = true;
        lookForEnd = true;
      }
      if (thisLetter === '(') {
        openParenthesis++;
        lookForEnd = false;
      }
      if (thisLetter === '{') {
        openCurlyBraces++;
        lookForEnd = false;
      }
      if (thisLetter === ')' && openParenthesis !== 0) {
        openParenthesis--;
      }
      if (thisLetter === '}' && openCurlyBraces !== 0) {
        openCurlyBraces--;
      }
      if (onInstruction && (openParenthesis === 0 && openCurlyBraces === 0)) {
        lookForEnd = true;
      }
      if (lookForEnd && thisLetter === ' ') {
        // Check for end of string
        if (i  === (n - 1)) {
          foundEnd = true;
        } else {
          // Loop over remaining string
          for (let j = i + 1; j < n; j++) {
            nextLetter = instructionStr[j];
            // Check for first no space character
            if (nextLetter !== ' ') {
              // If it isn't neither ( nor {, then it's the end
              if (nextLetter !== '(' && nextLetter !== '{') {
                foundEnd = true;
              }
              break;
            }
            // If scan reaches string's end then it's the end
            if (j  === (n - 1)) {
              foundEnd = true;
            }
          }
        }
      }
      if (foundEnd) {
        instructionEnd = i;
        break;
      }
    }

    let instruction = instructionStr.slice(instructionStart, instructionEnd);
    if (instruction === Array(instruction.length + 1).join(' ')) {
      instruction = '';
    }
    return [instruction, instructionEnd];
  }

  _parseInstructions(instructionStr){
    const instructions = [];
    let currentIdx = 0;
    let newInstruction;
    while (currentIdx <= instructionStr.length - 1) {
      [newInstruction, currentIdx] = this._extractNextInstruction(instructionStr, currentIdx);
      if (newInstruction) {
        instructions.push(newInstruction);
      }
    }
    return instructions;
  }

  _parseFunction(funcStr) {
    let args = null;
    let instr = null;
    let hasArgs = false;
    let hasInstr = false;
    let funcNameEnd = funcStr.length;
    let parenthesisIdx;
    let curlyBracesIdx;

    if (funcStr.includes('(') && funcStr.includes('{')) {
      parenthesisIdx = funcStr.indexOf('(');
      curlyBracesIdx = funcStr.indexOf('{');
      funcNameEnd = parenthesisIdx < curlyBracesIdx ? parenthesisIdx : curlyBracesIdx;
      hasArgs = true;
      hasInstr = true;
    } else if (funcStr.includes('(')) {
      parenthesisIdx = funcStr.indexOf('(');
      funcNameEnd = parenthesisIdx;
      hasArgs = true;
      hasInstr = false;
    } else if (funcStr.includes('{')) {
      curlyBracesIdx = funcStr.indexOf('{');
      funcNameEnd = curlyBracesIdx;
      hasArgs = false;
      hasInstr = true;
    }

    const funcName = funcStr.slice(0, funcNameEnd).replace(/ /g, '');
    if (hasArgs) {
      args = funcStr.slice(parenthesisIdx + 1,
              utils.getCloseIndexOf(funcStr, {open: '(', close: ')'}, parenthesisIdx));
    }
    if (hasInstr) {
      instr = funcStr.slice(curlyBracesIdx + 1,
              utils.getCloseIndexOf(funcStr, {open: '{', close: '}'}, curlyBracesIdx));
    }

    return {
      funcName: funcName,
      args: args,
      instr: instr,
      hasArgs: hasArgs,
      hasInstr: hasInstr
    };
  }

  _parseChordAndFret(notesArr, errorObject) {
    const frets = [];
    const chords = [];

    notesArr.forEach( (note) => {
      const separatorIdx = note.indexOf(this.CHORD_FRET_SEPARATOR);
      const currentChord = Number(note.slice(0, separatorIdx));
      const currentFret = note.slice(separatorIdx + 1, note.length);
      let validChord = true;
      let validFret = true;
      // Check if a valid chord
      if (!Number.isInteger(currentChord)) {
        validChord = false;
        errorObject.push('Erro ao usar a instrução padrão: A corda indicada em <' + note +
                         '> não é um número inteiro.');
      }
      if (currentChord > this.chords.length || currentChord < 1) {
        validChord = false;
        errorObject.push('Erro ao usar a instrução padrão: A corda indicada em <' + note +
                         '> extrapola o limite de cordas disponíveis.');
      }
      // Check for non empty fret
      if (currentFret === '') {
        validFret = false;
        errorObject.push('Erro ao usar a instrução padrão: O parâmetro referente à ' +
                         'casa inexiste na instrução <' + note + '>.');
      }
      if (validChord && validFret) {
        chords.push(currentChord);
        frets.push(currentFret);
      }
    });

    let maxFretLength;
    if (chords.length) {
      const fretsLength = frets.map( x => x.length );
      maxFretLength = fretsLength.reduce( (a, b) => {
        return Math.max(a, b);
      });
    } else {
      maxFretLength = undefined;
    }

    return {
      chords: chords,
      frets: frets,
      maxFretLength: maxFretLength
    };
  }

  _writeNotes(notesArr, errorObject) {
    let notesData = notesArr;
    if (!notesData.chords) {
      notesData = this._parseChordAndFret(notesArr, errorObject);
    }
    if (notesData.chords.length) {
      // Write notes
      this._tab.forEach( (tab, i) => {
        const index = notesData.chords.indexOf(i + 1);
        let fillerLength;
        if (index !== -1) {
          fillerLength = this.currentSpacing + 1 + notesData.maxFretLength -
                         notesData.frets[index].length;
          this._tab[i] += notesData.frets[index] + Array(fillerLength).join(this.TAB_FILLER);
        } else {
          fillerLength = notesData.maxFretLength + this.currentSpacing + 1;
          this._tab[i] += Array(fillerLength).join(this.TAB_FILLER);
        }
      });
    }
  }

  _readInstruction(instructionStr, errorObject) {
    // Check if instruction has a separator and expected chord is a number
    if (instructionStr.includes(this.CHORD_FRET_SEPARATOR) &&
         !isNaN(instructionStr.slice(0, instructionStr.indexOf(this.CHORD_FRET_SEPARATOR)))) {
      // Default note instruction
      this.methods.default.apply(this, [instructionStr, errorObject]);
    } else {
      // Read Instruction
      const method = this._parseFunction(instructionStr);
      if (method.funcName in this.methods) {
        this.methods[method.funcName].apply(this, [method, errorObject]);
      } else {
        errorObject.push('Erro ao usar método: Não existe correspondência para o ' +
                         'método indicado <' + method.funcName + '>.');
      }
    }
  }

  convert(instructionsStr) {
    this.currentSpacing = this.mainSpacing;
    const error = [];
    this._tab = Array(this.chords.length).fill('');
    const instructions = this._parseInstructions(instructionsStr);

    if (instructions.length) {
      instructions.forEach( (instruction) => {
        this._readInstruction(instruction, error);
      });
    }

    return error;
  }

  get chordsNumber() {
    return this._chordsNumber;
  }
  set chordsNumber(chordsNumber) {
    this._chordsNumber = chordsNumber;
    this._chords = Array.from({length: chordsNumber}, (val, i) => (i + 1).toString());
    this._tab = Array(chordsNumber).fill('');
  }

  get mainSpacing() {
    return this._mainSpacing;
  }
  set mainSpacing(space) {
    this._mainSpacing = space;
  }

  get chords() {
    return this._chords;
  }
  set chords(chordsArr) {
    this._chords = chordsArr;
    this._chordsNumber = chordsArr.length;
    this._tab = Array(chordsArr.length).fill('');
  }

  get tab() {
    return this._tab;
  }

}

module.exports = Interpreter;
