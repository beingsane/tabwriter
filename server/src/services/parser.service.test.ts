import { TabwriterParser } from './parser.service';

describe(`[${TabwriterParser.name}]`, () => {
  describe(`[${TabwriterParser.prototype.parse.name}]`, () => {
    it('should have an async execution option', async () => {
      const parser = new TabwriterParser('');
      parser.parse = jest.fn();

      await parser.parseAsync();

      expect(parser.parse).toHaveBeenCalled();
    });

    it('should reject if an error occurs while parsing async', () => {
      const parser = new TabwriterParser('');
      const expectedError = new Error('test');
      parser.parse = jest.fn(() => {
        throw expectedError;
      });

      return parser.parseAsync().catch(e => expect(e).toBe(expectedError));
    });

    it('should be able to set a custom instructions separator on object instantiation', () => {
      const instructionsSeparator = '$';
      const parser = new TabwriterParser('', { instructionsSeparator });

      expect(parser.instructionsSeparator).toBe(instructionsSeparator);
    });

    it('should use default instructions separator on object instantiation if none is provided', () => {
      const parser = new TabwriterParser('');

      expect(parser.instructionsSeparator).toBe(TabwriterParser.DEFAULT_INSTRUCTIONS_SEPARATOR);
    });

    it('should be able to change the instructions separator after object instantiation', () => {
      const instructionsSeparator = '$';

      const parser = new TabwriterParser('');
      parser.instructionsSeparator = instructionsSeparator;

      expect(parser.instructionsSeparator).toBe(instructionsSeparator);
    });

    it('should throw an error if a instructions separator with more than one character is provided', () => {
      const instructionsSeparator = '$$';
      const parser = new TabwriterParser('');

      expect(() => (parser.instructionsSeparator = instructionsSeparator)).toThrow();
    });

    it('should parse no instructions if the given instructions string is empty', () => {
      const instructionsStr = '     ';
      const parser = new TabwriterParser(instructionsStr);

      parser.parse();

      expect(parser.instructions.length).toBe(0);
    });

    it('should parse instructions between the instructions separator set on the parser', () => {
      const instructionsStr = ' instr1 instr2 ';
      const parser = new TabwriterParser(instructionsStr);

      parser.parse();

      expect(parser.instructions.length).toBe(2);
      expect(parser.instructions[0].instructionStr).toBe('instr1');
      expect(parser.instructions[1].instructionStr).toBe('instr2');
    });

    it('should read instructions with brackets as a single instruction', () => {
      const instructionsStr = ' instr1 ( arg1, arg2 ) [ arg1, arg2 ] { arg1, arg2 } ';
      const parser = new TabwriterParser(instructionsStr);

      parser.parse();

      expect(parser.instructions.length).toBe(1);
      expect(parser.instructions[0].instructionStr).toBe(instructionsStr.trim());
    });

    it('should read a instruction with no matching closing bracket to the end of the instructions string', () => {
      const instructionsStr = ' instr2 ( arg1, arg2 [ arg1, arg2 ] { arg1, arg2 } ';
      const parser = new TabwriterParser(instructionsStr);

      parser.parse();

      expect(parser.instructions.length).toBe(1);
      expect(parser.instructions[0].instructionStr).toBe(instructionsStr.trim());
    });

    it('should read a instruction with instructions separator between brackets as one single instruction', () => {
      const instructionsStr = ' instr2(arg1, arg2) ';
      const parser = new TabwriterParser(instructionsStr);

      parser.parse();

      expect(parser.instructions.length).toBe(1);
      expect(parser.instructions[0].instructionStr).toBe(instructionsStr.trim());
    });
  });
});
