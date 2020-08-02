import { ParserResult } from '../models/parser/parserResult.model';
import { TabWriterService } from './tabWriter.service';
import { Tab } from '../models/tab/tab.model';

describe(`[${TabWriterService.name}]`, () => {
  describe('[writeTab]', () => {
    it('should return a success tab write result if all instructions are successfully written to a tab', async () => {
      const instructions = '1-2';

      const result = await TabWriterService.writeTab({
        instructions,
        rowsQuantity: 6,
        rowsSpacing: 2,
      });

      expect(result.success).toBe(true);
    });

    it('should return a no success tab write result if any instruction fail to be written to a tab', async () => {
      const instructions = '1-';

      const result = await TabWriterService.writeTab({
        instructions,
        rowsQuantity: 6,
        rowsSpacing: 2,
      });

      expect(result.success).toBe(false);
    });

    it('should allow the identification of failed instructions', async () => {
      const successInstruction = '1-2';
      const failedInstruction = '1-';
      const instructions = `${successInstruction} ${failedInstruction}`;

      const result = await TabWriterService.writeTab({
        instructions,
        rowsQuantity: 6,
        rowsSpacing: 2,
      });
      const failedInstructionResult = result.instructionsResults.filter(
        (ir) => !ir.success
      );

      expect(failedInstructionResult.length).toBe(1);
      expect(failedInstructionResult[0].instruction).toBe(failedInstruction);
    });
  });

  describe('[writeParsedInstructionToTab]', () => {
    const buildParsedDefaultInstructionResult = (
      chord: number,
      note: string
    ): ParserResult => {
      const instruction = `${chord}-${note}`;
      return new ParserResult(
        instruction,
        0,
        instruction.length - 1,
        null,
        null,
        null
      );
    };

    it('should write the given parsed instruction to the given tab', () => {
      const chord = 1;
      const note = '1/2';
      const parsedResult = buildParsedDefaultInstructionResult(chord, note);
      const tab = new Tab();

      TabWriterService.writeParsedInstructionToTab(parsedResult, tab);

      expect(tab.blocks[0][chord]).toContain(note);
    });

    it('should return a success instruction write result on a successful write on the given tab', () => {
      const chord = 1;
      const note = '1/2';
      const parsedResult = buildParsedDefaultInstructionResult(chord, note);
      const tab = new Tab();

      const result = TabWriterService.writeParsedInstructionToTab(
        parsedResult,
        tab
      );

      expect(result.success).toBe(true);
    });

    it('should return a no success instruction write result on a failed write on the given tab', () => {
      const chord = 0;
      const note = '1/2';
      const parsedResult = buildParsedDefaultInstructionResult(chord, note);
      const tab = new Tab();

      const result = TabWriterService.writeParsedInstructionToTab(
        parsedResult,
        tab
      );

      expect(result.success).toBe(false);
    });
  });
});
