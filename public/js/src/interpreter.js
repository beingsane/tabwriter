const utils = require('./utils.js');

class Interpreter {

  constructor(chordsNumber, mainSpacing) {
    this.CHORD_FRET_SEPARATOR = '-';
    this.TAB_FILLER = '-';
    this.SEC_SYMBOL = '|';
    this.DEFAULT_CHORDS_NUMBER = 6;
    this.DEFAULT_SPACING = 2;
    this.DEFAULT_SEC_SPACE = 4;

    this.mainSpacing = mainSpacing || this.DEFAULT_SPACING;
    this.chordsNumber = chordsNumber || this.DEFAULT_CHORDS_NUMBER;
    this.currentSpacing = this.mainSpacing;

    this.methods = {
      default: function(noteStr, tabArr, errorArr) {
        const tabObject = tabArr[this.currentTabArrIdx];
        this._writeNotes([noteStr], tabObject, errorArr);
      },

      break: function(data, tabArr, errorArr) {
        // Check data
        this._isDataSet(data, {args: false, instr: false}, errorArr);
        tabArr.push({
          core: Array(this.chordsNumber).fill(''),
          sections: null,
          notes: null
        });
        this.currentTabArrIdx++;
      },

      repeat: function(data, tabArr, errorArr) {
        // Check data
        if (!this._isDataSet(data, {args: true, instr: true}, errorArr)) {
          return;
        }
        // Check if arg is a valid number
        const n = Number(data.args);
        if (isNaN(n) || !Number.isInteger(n) || n < 1) {
          errorArr.push('Erro ao usar o método <' + data.funcName + '>: O valor de repetições ' +
                        'fornecido <' + data.args + '> não é válido.');
          return;
        }
        const errorLengthPrev = errorArr.length;
        // Read instructions
        const notes = this._parseInstructions(data.instr);
        for (let i = 0; i < n; i++) {
          notes.forEach( (note) => {
            this._readInstruction(note, tabArr, errorArr);
          });
        }
        // Remove repeated error messages
        const errorLengthAfter = errorArr.length;
        if (errorLengthAfter !== errorLengthPrev) {
          const newErrors = errorLengthAfter - errorLengthPrev;
          errorArr.splice(errorLengthPrev, (n - 1) * newErrors / n);
        }
      },

      merge: function(data, tabArr, errorArr) {
        // Check data
        if (!this._isDataSet(data, {args: false, instr: true}, errorArr)) {
          return;
        }
        // Check if there is a function call nested inside
        const functionElements = data.instr.match(/[a-zA-Z]+\s*\(/g);
        if (functionElements) {
          errorArr.push('Erro ao usar o método <' + data.funcName + '>: Não foi possível ' +
                        'avaliar a expressão <' + functionElements[0] + '>. Métodos não ' +
                        'podem ser chamados dentro desse método.');
          return;
        }
        // Read instructions
        const notes = this._parseInstructions(data.instr);
        const notesData = this._parseChordAndFret(notes, errorArr);

        // Check for multiple entries in the same chord
        if (notesData.chords.length) {
          const multipleChords = notesData.chords.filter( (chord, i, chords) => {
            return (chords.indexOf(chord) !== chords.lastIndexOf(chord)) ? true: false;
          });
          if (multipleChords.length) {
            errorArr.push('Erro ao usar o método <' + data.funcName + '>: Detectada mais ' +
                          'de uma instrução referente à mesma corda.');
            return;
          }
        }
        // Write notes
        const tabObject = tabArr[this.currentTabArrIdx];
        this._writeNotes(notesData, tabObject, errorArr);
      },

      space: function(data, tabArr, errorArr) {
        // Check data
        if (!this._isDataSet(data, {args: true, instr: false}, errorArr)) {
          return;
        }
        // Check if arg is a valid number
        const newSpace = Number(data.args);
        if (isNaN(newSpace) || !Number.isInteger(newSpace) || newSpace < 1) {
          errorArr.push('Erro ao usar o método <' + data.funcName + '>: O valor de ' +
                        'espaçamento fornecido <' + data.args + '> não é válido. ' +
                        'Para usar o espaçamento padrão use <space(2)>.');
          return;
        }
        // Correct last tab space if necessary
        const tabObject = tabArr[this.currentTabArrIdx];
        if (tabObject.core[0].length) {
          const diffSpace = newSpace - this.currentSpacing;
          if (diffSpace > 0) {
            tabObject.core.forEach( (row, i) => {
              tabObject.core[i] += Array(diffSpace + 1).join(this.TAB_FILLER);
            });
            // correct secions
            if (tabObject.sections !== null) {
              tabObject.sections += Array(diffSpace + 1).join(' ');
            }
          } else if (diffSpace < 0) {
            tabObject.core.forEach( (row, i) => {
              tabObject.core[i] = row.slice(0, diffSpace);
            });
            // correct secions
            if (tabObject.sections !== null) {
              tabObject.sections = tabObject.sections.slice(0, diffSpace);
            }
          }
        }
        // Update tab space
        this.currentSpacing = newSpace;
      },

      section: function(data, tabArr, errorArr) {
        // Check data
        if (!this._isDataSet(data, {args: true, instr: false}, errorArr)) {
          return;
        }
        const tabObject = tabArr[this.currentTabArrIdx];
        const rowLength = tabObject.core[0].length;
        if (tabObject.sections === null) {
          // Initialize sections in tabObject
          tabObject.sections = Array(rowLength + 1).join(' ');
        } else {
          // Check if tab's core has reached last sections' end
          const secLength = tabObject.sections.length;
          if (secLength > rowLength) {
            const fillerLength = secLength - rowLength;
            const filler = Array(fillerLength + 1).join(this.TAB_FILLER);
            tabObject.core.forEach( (row, i) => {
              tabObject.core[i] += filler;
            });
          }
        }
        // Add section notation
        this._appendSection(tabObject, data.args);
      },

      note: function(data, tabArr, errorArr) {
        // Check data
        if (!this._isDataSet(data, {args: true, instr: false}, errorArr)) {
          return;
        }
        const tabObject = tabArr[this.currentTabArrIdx];
        const rowLength = tabObject.core[0].length;
        const notesContent = Array(this.DEFAULT_SEC_SPACE + 1).join(' ') + data.args + ' ';

        // Set section and core rows properly
        if (tabObject.sections !== null && tabObject.sections.length > rowLength) {
          const secLength = tabObject.sections.length;
          tabObject.core.forEach( (row, i) => {
            tabObject.core[i] += Array(secLength - rowLength + 1).join(this.TAB_FILLER);
          });
        }

        if (tabObject.notes === null) {
          // Initialize notes if the first
          this._initializeNote(tabObject, notesContent);
        } else {
          // Append note if note the first
          this._appendNote(tabObject, notesContent);
        }

        // Set symbol and spaces on core, notes and sections
        tabObject.notes += this.SEC_SYMBOL + Array(this.currentSpacing + 1).join(' ');
        tabObject.notesIdx.push(tabObject.notes.length);
        tabObject.core.forEach( (row, i) => {
          tabObject.core[i] += this.SEC_SYMBOL + Array(this.currentSpacing + 1)
                                                      .join(this.TAB_FILLER);
        });
        if (tabObject.sections !== null) {
          tabObject.sections += Array(this.currentSpacing + this.SEC_SYMBOL.length + 1).join(' ');
        }
      }

    };

    // Set methods' short notations
    this.methods.m = this.methods.merge;
    this.methods.r = this.methods.repeat;
    this.methods.s = this.methods.space;
    this.methods.sec = this.methods.section;
  }

  _initializeNote(tabObject, note) {
    if (tabObject.notes !== null) {
      return;
    }
    tabObject.notesIdx = [];
    const rowLength = tabObject.core[0].length;
    if (rowLength > note.length) {
      tabObject.notes = Array(rowLength - note.length + 1).join(' ');
      tabObject.notes += note;
    } else {
      // Fill core and sections to match notes' length
      const filler = Array(note.length - rowLength + 1).join(this.TAB_FILLER);
      tabObject.core.forEach( (row, i) => {
        tabObject.core[i] += filler;
      });
      if (tabObject.sections !== null) {
        tabObject.sections += Array(note.length - rowLength + 1).join(' ');
      }
      tabObject.notes = note;
    }
  }

  _appendNote(tabObject, note) {
    if (tabObject.notes === null) {
      return;
    }
    const rowLength = tabObject.core[0].length;
    const lastNoteIdx = tabObject.notesIdx.slice(-1)[0];
    const expectedNoteLength = lastNoteIdx + note.length;
    let filler;
    if (rowLength > expectedNoteLength) {
      // Fill between notes to match core's length
      filler = Array(rowLength - expectedNoteLength + 1).join(' ');
      tabObject.notes = tabObject.notes.slice(0, lastNoteIdx + 1);
      tabObject.notes += filler + note;
    } else {
      // Fill core and sections to match notes' length
      filler = Array(expectedNoteLength - rowLength + 1).join(this.TAB_FILLER);
      tabObject.core.forEach( (row, i) => {
        tabObject.core[i] += filler;
      });
      if (tabObject.sections !== null) {
        tabObject.sections += Array(expectedNoteLength - rowLength + 1).join(' ');
      }
      tabObject.notes = tabObject.notes.slice(0, lastNoteIdx + 1);
      tabObject.notes += note;
    }
  }

  _appendSection(tabObject, section) {
    if (tabObject.sections === null) {
      return;
    }
    const rowLength = tabObject.core[0].length;
    // Check if there is a note right before
    if (rowLength > this.currentSpacing) {
      // Count number of | at the expected postion of a note right before
      const vertBars = tabObject.core.reduce( (total, row) => {
        let isVertBar = false;
        const previousCharIdx = utils.getFirstDifferentFrom(row, this.TAB_FILLER,
                                                            row.length - 1, -1);
        const previousChar = row[previousCharIdx];
        const expectVertBarIdx = row.length - 1 - this.currentSpacing;
        if (previousCharIdx === expectVertBarIdx &&
            previousChar === this.SEC_SYMBOL) {
          isVertBar = true;
        }
        return isVertBar + total;
      }, 0);
      // If there is a note right before
      if(vertBars === this.chordsNumber) {
        // Remove note notation from core
        tabObject.core.forEach( (row, i) => {
          tabObject.core[i] = row.slice(0, row.length - this.currentSpacing - 1);
        });
        // Remove note notation spaces from section
        tabObject.sections = tabObject.sections
                  .slice(0, tabObject.sections.length - this.currentSpacing - 1);
      }
    }
    // Set section symbol and spaces on core and sections
    tabObject.sections += this.SEC_SYMBOL + ' ' + section +
        Array(this.DEFAULT_SEC_SPACE + 1).join(' ');
    tabObject.core.forEach( (row, i) => {
      tabObject.core[i] += this.SEC_SYMBOL + Array(this.currentSpacing + 1)
                                                  .join(this.TAB_FILLER);
    });
  }

  _isDataSet(data, expectedData, errorArr) {
    // expectedData {
    //   data: true or false
    // }
    let dataSet = true;
    for (let key in expectedData) {
      if (expectedData[key]) {
        // key is expected to be non empty in data
        if (!(key in data) || data[key] === null || data[key] === '' &&
            data[key] === Array(data[key].length + 1).join(' ')) {
              dataSet = false;
            }
      } else {
        // key is not expected to be in data
        if (key in data && data[key] !== null) {
          errorArr.push('Atenção ao usar o método <' + data.funcName + '>: Este ' +
                        'método não faz uso de ' + data[key + 'Name'] + '. O valor ' +
                        'fornecido <' + data[key] + '> não foi utilizado.');
        }
      }
    }
    if (!dataSet) {
      errorArr.push('Erro ao usar o método <' + data.funcName + '>: ' +
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
    let nextLetterIdx;

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
          // Check next non space character
          nextLetterIdx = utils.getFirstDifferentFrom(instructionStr, ' ', i);
          if (nextLetterIdx === i) {
            foundEnd = true;
          } else {
            nextLetter = instructionStr[nextLetterIdx];
            if (nextLetter !== '(' && nextLetter !== '{') {
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
    let thisInstrStr = instructionStr.replace(/\n/g, ' ');
    const instructions = [];
    let currentIdx = 0;
    let newInstruction;
    let controlVariable = 0;
    let n = thisInstrStr.length;
    while (currentIdx <= n - 1 && controlVariable <= n - 1) {
      [newInstruction, currentIdx] = this._extractNextInstruction(thisInstrStr, currentIdx);
      if (newInstruction) {
        instructions.push(newInstruction);
      }
      controlVariable++;
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
      hasArgs: hasArgs,
      args: args,
      argsName: 'argumento',
      hasInstr: hasInstr,
      instr: instr,
      instrName: 'instrução'
    };
  }

  _parseChordAndFret(notesArr, errorArr) {
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
        errorArr.push('Erro ao usar a instrução padrão: A corda indicada em <' + note +
                      '> não é um número inteiro.');
      }
      if (currentChord > this.chordsNumber || currentChord < 1) {
        validChord = false;
        errorArr.push('Erro ao usar a instrução padrão: A corda indicada em <' + note +
                      '> extrapola o limite de cordas disponíveis.');
      }
      // Check for non empty fret
      if (currentFret === '') {
        validFret = false;
        errorArr.push('Erro ao usar a instrução padrão: O parâmetro referente à ' +
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

  _writeNotes(notesArr, tabObject, errorArr) {
    let notesData = notesArr;
    if (!notesData.chords) {
      notesData = this._parseChordAndFret(notesArr, errorArr);
    }
    if (notesData.chords.length) {
      // Write notes
      tabObject.core.forEach( (row, i) => {
        const index = notesData.chords.indexOf(i + 1);
        let fillerLength;
        if (index !== -1) {
          fillerLength = this.currentSpacing + 1 + notesData.maxFretLength -
                         notesData.frets[index].length;
          tabObject.core[i] += notesData.frets[index] + Array(fillerLength).join(this.TAB_FILLER);
        } else {
          fillerLength = notesData.maxFretLength + this.currentSpacing + 1;
          tabObject.core[i] += Array(fillerLength).join(this.TAB_FILLER);
        }
      });
      // Update Section
      if (tabObject.sections !== null) {
        const rowLength = tabObject.core[0].length;
        const secLength = tabObject.sections.length;
        if (rowLength > secLength) {
          tabObject.sections += Array(rowLength - secLength + 1).join(' ');
        }
      }
    }
  }

  _readInstruction(instructionStr, tabArr, errorArr) {
    // Check if instruction has a separator and expected chord is a number
    if (instructionStr.includes(this.CHORD_FRET_SEPARATOR) &&
         !isNaN(instructionStr.slice(0, instructionStr.indexOf(this.CHORD_FRET_SEPARATOR)))) {
      // Default note instruction
      this.methods.default.apply(this, [instructionStr, tabArr, errorArr]);
    } else {
      // Read Instruction
      const method = this._parseFunction(instructionStr);
      if (method.funcName in this.methods) {
        this.methods[method.funcName].apply(this, [method, tabArr, errorArr]);
      } else {
        errorArr.push('Erro ao usar método: Não existe correspondência para o ' +
                      'método indicado <' + method.funcName + '>.');
      }
    }
  }

  convert(instructionsStr) {
    this.currentTabArrIdx = 0;
    this.currentSpacing = this.mainSpacing;
    const instructions = this._parseInstructions(instructionsStr);
    const errorArr = [];
    const tabArr = [{
      core: Array(this.chordsNumber).fill(''),
      sections: null,
      notes: null
    }];

    if (instructions.length) {
      instructions.forEach( (instruction) => {
        this._readInstruction(instruction, tabArr, errorArr);
      });
    }

    return {
      tabArr: tabArr,
      errorArr: errorArr
    };
  }

  get chordFreatSeparator() {
    return this.CHORD_FRET_SEPARATOR;
  }
  set chordFreatSeparator(character) {
    if (character.length === 1) {
      this.CHORD_FRET_SEPARATOR = character;
    }
  }

  get secSymbolChar() {
    return this.SEC_SYMBOL;
  }
  set secSymbolChar(character) {
    if (character.length === 1) {
      this.SEC_SYMBOL = character;
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

module.exports = Interpreter;
