import { DefaultInstruction } from './defaultInstruction.model';
import { RepeatInstruction } from './repeatInstruction.model';
import { Tab } from '../tab/tab.model';
import { TabBlockWriteResult } from '../tab/tabBlockWriteResult.model';

describe(`[${RepeatInstruction.name}]`, () => {
  it('should set up the instructions name', () => {
    const instructionsToRepeat = [new DefaultInstruction(1, '1')];
    const instruction = new RepeatInstruction(2, instructionsToRepeat);

    const instructionName = instruction.name.trim();

    expect(instructionName).toBeDefined();
    expect(instructionName.length).toBeGreaterThan(0);
  });

  it('should not be a mergeable instruction', () => {
    const instructionsToRepeat = [new DefaultInstruction(1, '1')];
    const instruction = new RepeatInstruction(2, instructionsToRepeat);

    expect(instruction.isMergeableInstruction()).toBe(false);
  });

  it('should repeatedly write the instructions to repeat on write', () => {
    const tab = new Tab();
    const repetitions = 3;
    const instructionsToRepeat = [new DefaultInstruction(1, '1'), new DefaultInstruction(1, '2')];
    const instruction = new RepeatInstruction(repetitions, instructionsToRepeat);

    instructionsToRepeat.forEach(
      (instruction) => (instruction.writeOnTab = jest.fn().mockReturnValue(new TabBlockWriteResult(true))),
    );
    instruction.writeOnTab(tab);

    instructionsToRepeat.forEach((instruction) => {
      expect(instruction.writeOnTab).toHaveBeenCalledWith(tab);
    });
  });

  it('should write errors only once if the write of a instruction returns in error', () => {
    const tab = new Tab();
    const repetitions = 3;
    const instructionsToRepeat = [new DefaultInstruction(1, '1'), new DefaultInstruction(1, '2')];
    const instruction = new RepeatInstruction(repetitions, instructionsToRepeat);
    const errorDescription = 'some error description';
    const errorDescriptionMatcher = new RegExp(errorDescription, 'g');

    instructionsToRepeat.forEach((instruction, idx) => {
      instruction.writeOnTab = jest
        .fn()
        .mockReturnValue(idx > 0 ? new TabBlockWriteResult(true) : new TabBlockWriteResult(false, errorDescription));
    });

    const writeResult = instruction.writeOnTab(tab);
    const errorDescriptionMatchs = writeResult.description?.match(errorDescriptionMatcher);

    expect(writeResult.success).toBe(false);
    expect(errorDescriptionMatchs).not.toBeNull();
    expect(errorDescriptionMatchs?.length).toBe(1);
  });
});
