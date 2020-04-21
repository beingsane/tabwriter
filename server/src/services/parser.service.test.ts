import { ParserService } from './parser.service';

describe(`[${ParserService.name}]`, () => {
  describe(`[parse]`, () => {
    it('should have an async execution option', async () => {
      const parser = new ParserService();
      parser.parse = jest.fn();

      await parser.parseAsync('');

      expect(parser.parse).toHaveBeenCalled();
    });

    it('should reject if an error occurs while parsing async', () => {
      const parser = new ParserService();
      const expectedError = new Error('test');
      parser.parse = jest.fn(() => {
        throw expectedError;
      });

      return parser.parseAsync('').catch(e => expect(e).toBe(expectedError));
    });

    it('should parse no instructions if the given instructions string is empty', () => {
      const instructionsStr = '     ';
      const parser = new ParserService();

      const instructions = parser.parse(instructionsStr);

      expect(instructions.length).toBe(0);
    });

    it('should parse instructions between spaces', () => {
      const instruction1 = 'instr1';
      const instruction2 = 'instr2';
      const instructionsStr = `${instruction1} ${instruction2}`;
      const parser = new ParserService();

      const instructions = parser.parse(instructionsStr);

      expect(instructions.length).toBe(2);
      expect(instructions[0].value).toBe(instruction1);
      expect(instructions[1].value).toBe(instruction2);
    });

    it('should read instructions with brackets as a single instruction', () => {
      const instructionsStr = 'instr1(arg1, arg2)[arg1, arg2]{arg1, arg2}';
      const parser = new ParserService();

      const instructions = parser.parse(instructionsStr);

      expect(instructions.length).toBe(1);
      expect(instructions[0].value).toBe(instructionsStr);
    });

    it('should read instructions with brackets as a single instruction, even with spaces between', () => {
      const instructionsStr = '  instr1  (  arg1  , arg2  )  [  arg1  , arg2  ]  {  arg1  , arg2  }  ';
      const parser = new ParserService();

      const instructions = parser.parse(instructionsStr);

      expect(instructions.length).toBe(1);
      expect(instructions[0].value).toBe(instructionsStr.trim());
    });

    it('should read a instruction with no matching closing bracket to the end of the instructions string', () => {
      const instructionsStr = 'instr2(arg1, arg2[arg1, arg2]{arg1, arg2}';
      const parser = new ParserService();

      const instructions = parser.parse(instructionsStr);

      expect(instructions.length).toBe(1);
      expect(instructions[0].value).toBe(instructionsStr);
    });

    it('should read a instruction with no matching closing bracket to the end of the instructions string, even with spaces between', () => {
      const instructionsStr = '  instr1  (  arg1  , arg2  )  [  arg1  , arg2  ]  {  arg1  , arg2  ';
      const parser = new ParserService();

      const instructions = parser.parse(instructionsStr);

      expect(instructions.length).toBe(1);
      expect(instructions[0].value).toBe(instructionsStr.trim());
    });

    it('should parse and read the instructions args', () => {
      const args = [1, 1.11, 'some text input'];
      const instructionStr = `instr(${args.join(', ')})`;
      const parser = new ParserService();

      const instructions = parser.parse(instructionStr);

      expect(instructions.length).toBe(1);
      expect(instructions[0].args).toEqual(args);
    });

    it('should parse and read the instructions args, even with spaces', () => {
      const args = [1, 1.11, 'some text input'];
      const instructionStr = `  instr  (  ${args.join('  ,  ')}  )  `;
      const parser = new ParserService();

      const instructions = parser.parse(instructionStr);

      expect(instructions.length).toBe(1);
      expect(instructions[0].args).toEqual(args);
    });

    it('should parse and read the instruction targets', () => {
      const targets = ['1-2', '2-3'];
      const instructionsStr = `instr{${targets.join(' ')}}`;
      const parser = new ParserService();

      const instructions = parser.parse(instructionsStr);
      const readTargetsValues = instructions[0].targets?.map(target => target.value);

      expect(instructions.length).toBe(1);
      expect(readTargetsValues).toEqual(targets);
    });

    it('sould parse and read the instruction targets, even with spaces', () => {
      const targets = ['1-2', '2-3'];
      const instructionsStr = `  instr  {  ${targets.join('  ')}  }  `;
      const parser = new ParserService();

      const instructions = parser.parse(instructionsStr);
      const readTargetsValues = instructions[0].targets?.map(target => target.value);

      expect(instructions.length).toBe(1);
      expect(readTargetsValues).toEqual(targets);
    });

    it('should upadete inner targets positions to the global reference', () => {
      const innerTargets = ['6-1', '6-2'];
      const target = `instr{${innerTargets.join(' ')}}`;
      const instructionsStr = `instr{${target}}`;
      const parser = new ParserService();

      const instructions = parser.parse(instructionsStr);
      const instructionReadTarget = instructions[0]?.targets;
      const innerTargetsRead = instructionReadTarget ? instructionReadTarget[0]?.targets : null;

      expect(innerTargetsRead).not.toBeNull();
      expect(innerTargetsRead).toBeDefined();
      if (innerTargetsRead) {
        innerTargets.forEach((target, idx) => {
          expect(innerTargetsRead[idx].value).toBe(target);
          expect(innerTargetsRead[idx].readFromIdx).toBe(instructionsStr.indexOf(target));
          expect(innerTargetsRead[idx].readToIdx).toBe(instructionsStr.indexOf(target) + target.length - 1);
        });
      }
    });

    it('should upadete inner targets positions to the global reference, even with spaces', () => {
      const innerTargets = ['6-1', '6-2'];
      const target = `  instr  {  ${innerTargets.join('  ')}  }  `;
      const instructionsStr = `  instr  {  ${target}  }  `;
      const parser = new ParserService();

      const instructions = parser.parse(instructionsStr);
      const instructionReadTarget = instructions[0]?.targets;
      const innerTargetsRead = instructionReadTarget ? instructionReadTarget[0]?.targets : null;

      expect(innerTargetsRead).not.toBeNull();
      expect(innerTargetsRead).toBeDefined();
      if (innerTargetsRead) {
        innerTargets.forEach((target, idx) => {
          expect(innerTargetsRead[idx].value).toBe(target);
          expect(innerTargetsRead[idx].readFromIdx).toBe(instructionsStr.indexOf(target));
          expect(innerTargetsRead[idx].readToIdx).toBe(instructionsStr.indexOf(target) + target.length - 1);
        });
      }
    });
  });
});
