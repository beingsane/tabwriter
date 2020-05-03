import { InstructionFactory } from './instructionFactory.model';
import { MergeableInstruction } from './mergeableInstruction.model';
import { ParserService } from './../../services/parser.service';
import { InvalidInstruction } from './invalidInstruction';
import { DefaultInstruction } from './defaultInstruction.model';
import { BreakInstruction } from './breakInstruction.model';
import { MergeInstruction } from './mergeInstruction.model';
import { RepeatInstruction } from './repeatInstruction.model';
import { SetSpacingInstruction } from './setSpacingInstruction.model';
import { SectionInstruction } from './sectionInstruction.model';
import { NoteInstruction } from './noteInstruction.model';

describe(`[${InstructionFactory.name}]`, () => {
  describe('[getInstruction]', () => {
    describe('[default]', () => {
      it('should return a default instruction for a parsed <:chord-:note > instruction', () => {
        const instructionStr = '1-1/2';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult) as MergeableInstruction;

          expect(instruction).toBeInstanceOf(DefaultInstruction);
        });
      });

      it('should return an invalid instruction for a parsed <:chord-:note > instruction with invalid chord or note', () => {
        const instructionStr = '1 -1 1- f-1';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });
    });

    describe('[break]', () => {
      it('should return a break instruction for a parsed <BREAK> method', () => {
        const instructionStr = 'break';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(BreakInstruction);
        });
      });
    });

    describe('[merge]', () => {
      it('should return a merge instruction for a parsed < MERGE > or < M > methods with valid mergeable targets', () => {
        const instructionStr = 'merge { 1-2 2-2 } m { 1-2 2-2 }';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(MergeInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < MERGE > or < M > method without targets', () => {
        const instructionStr = 'merge m';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < MERGE > or < M > method with empty targets', () => {
        const instructionStr = 'merge {} m{}';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < MERGE > or < M > method with unmergeable targets', () => {
        const instructionStr = 'merge {{}} m{{}} merge { break 1-2 } m { break 1-2 }';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });
    });

    describe('[repeat]', () => {
      it('should return a repeat instruction for a parsed < REPEAT > or < R > methods with valid args and targets', () => {
        const instructionStr = 'repeat (2) { 1-2 2-2 } r (2) { 1-2 2-2 }';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(RepeatInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < REPEAT > or < R > method without arguments', () => {
        const instructionStr = 'repeat { 1-2 2-2 } r { 1-2 2-2 }';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < REPEAT > or < R > method with more than 1 argument', () => {
        const instructionStr = 'repeat (2, another argument) { 1-2 2-2 } r (2, another argument) { 1-2 2-2 }';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < REPEAT > or < R > method with an invalid argument', () => {
        const instructionStr = 'repeat (some argument) { 1-2 2-2 } r (some argument) { 1-2 2-2 }';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < REPEAT > or < R > method without targets', () => {
        const instructionStr = 'repeat (2) r (2)';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });
    });

    describe('[set spacing]', () => {
      it('should return a set spacing instruction for a parsed < SPACE > or < S > methods with valid args', () => {
        const instructionStr = 'space (10) s (10)';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(SetSpacingInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < SPACE > or < S > method without arguments', () => {
        const instructionStr = 'space s';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < SPACE > or < S > method with more than 1 argument', () => {
        const instructionStr = 'space (10, another argument) s (10, another argument)';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < SPACE > or < S > method with an invalid argument', () => {
        const instructionStr = 'space (some argument) s (some argument)';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });
    });

    describe('[section]', () => {
      it('should return a section instruction for a parsed < SECTION > or < SEC > methods with valid args', () => {
        const instructionStr = 'section (some section) sec (some other section)';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(SectionInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < SECTION > or < SEC > method without arguments', () => {
        const instructionStr = 'section sec';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < SECTION > or < SEC > method with more than 1 argument', () => {
        const instructionStr = 'section (some section, another argument) sec (some other section, another argument)';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });
    });

    describe('[note]', () => {
      it('should return a note instruction for a parsed < NOTE > method with valid args', () => {
        const instructionStr = 'note (some note)';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(NoteInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < NOTE > method without arguments', () => {
        const instructionStr = 'note';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });

      it('should return an invalid instruction for a parsed < NOTE > method with more than 1 argument', () => {
        const instructionStr = 'note (some note, another note)';
        const parser = new ParserService();
        const parserResults = parser.parse(instructionStr);

        parserResults.forEach(parserResult => {
          const instruction = InstructionFactory.getInstruction(parserResult);

          expect(instruction).toBeInstanceOf(InvalidInstruction);
        });
      });
    });
  });
});
