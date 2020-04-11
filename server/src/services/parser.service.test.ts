import { ParserService, ParserServiceConfig } from './parser.service';

describe(`[${ParserServiceConfig.name}]`, () => {
  it('should start with the default instructions separator', () => {
    const config = new ParserServiceConfig();

    expect(config.instructionsSeparator).toBe(ParserServiceConfig.DEFAULT_INSTRUCTIONS_SEPARATOR);
  });

  it('should allow editing the instructions separator value', () => {
    const config = new ParserServiceConfig();
    const instructionsSeparator = '$';

    config.instructionsSeparator = instructionsSeparator;

    expect(config.instructionsSeparator).toBe(instructionsSeparator);
  });

  it('should throw an error when editing the instructions separator value with a non character string', () => {
    const config = new ParserServiceConfig();
    const instructionsSeparator = '$$';

    expect(() => (config.instructionsSeparator = instructionsSeparator)).toThrow();
  });
});

describe(`[${ParserService.name}]`, () => {
  it('should use the default parser config if no custom config is provided', () => {
    const defaultConfig = new ParserServiceConfig();

    const parser = new ParserService('1-2');

    expect(parser.config).toEqual(defaultConfig);
  });

  it('should use the given parser config when provided', () => {
    const config = new ParserServiceConfig();
    config.instructionsSeparator = '$';

    const parser = new ParserService('1-2', config);

    expect(parser.config).toEqual(config);
  });

  describe(`[${ParserService.prototype.parse.name}]`, () => {
    it('should have an async execution option', async () => {
      const parser = new ParserService('');
      parser.parse = jest.fn();

      await parser.parseAsync();

      expect(parser.parse).toHaveBeenCalled();
    });

    it('should reject if an error occurs while parsing async', () => {
      const parser = new ParserService('');
      const expectedError = new Error('test');
      parser.parse = jest.fn(() => {
        throw expectedError;
      });

      return parser.parseAsync().catch(e => expect(e).toBe(expectedError));
    });

    it('should parse no instructions if the given instructions string is empty', () => {
      const instructionsStr = '     ';
      const parser = new ParserService(instructionsStr);

      const instructions = parser.parse();

      expect(instructions.length).toBe(0);
    });

    it('should parse instructions between the instructions separator set on the parser', () => {
      const instructionsStr = ' instr1 instr2 ';
      const parser = new ParserService(instructionsStr);

      const instructions = parser.parse();

      expect(instructions.length).toBe(2);
      expect(instructions[0].source).toBe('instr1');
      expect(instructions[1].source).toBe('instr2');
    });

    it('should read instructions with brackets as a single instruction', () => {
      const instructionsStr = ' instr1 ( arg1, arg2 ) [ arg1, arg2 ] { arg1, arg2 } ';
      const parser = new ParserService(instructionsStr);

      const instructions = parser.parse();

      expect(instructions.length).toBe(1);
      expect(instructions[0].source).toBe(instructionsStr.trim());
    });

    it('should read a instruction with no matching closing bracket to the end of the instructions string', () => {
      const instructionsStr = ' instr2 ( arg1, arg2 [ arg1, arg2 ] { arg1, arg2 } ';
      const parser = new ParserService(instructionsStr);

      const instructions = parser.parse();

      expect(instructions.length).toBe(1);
      expect(instructions[0].source).toBe(instructionsStr.trim());
    });

    it('should read a instruction with instructions separator between brackets as one single instruction', () => {
      const instructionsStr = ' instr2(arg1, arg2) ';
      const parser = new ParserService(instructionsStr);

      const instructions = parser.parse();

      expect(instructions.length).toBe(1);
      expect(instructions[0].source).toBe(instructionsStr.trim());
    });
  });
});
