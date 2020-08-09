import { DefaultInstruction } from './defaultInstruction';
import { MergeInstruction } from './mergeInstruction';
import { Tab } from '../tab/tab';
import { TabBlockWriteInstruction } from '../tab/tabBlockWriteInstruction';

describe(`[${MergeInstruction.name}]`, () => {
  it('should set up the instructions name', () => {
    const instructionsToMerge = [
      new DefaultInstruction(1, '1'),
      new DefaultInstruction(2, '2'),
    ];
    const instruction = new MergeInstruction(instructionsToMerge);

    const instructionName = instruction.name.trim();

    expect(instructionName).toBeDefined();
    expect(instructionName.length).toBeGreaterThan(0);
  });

  it('should not be a mergeable instruction', () => {
    const mergeableInstruction = new DefaultInstruction(1, '1');
    const instruction = new MergeInstruction([mergeableInstruction]);

    expect(instruction.isMergeableInstruction()).toBe(false);
  });

  it('should write the mergeable instructions on tab on write', () => {
    const tab = new Tab();
    const instructionsToMerge = [
      new DefaultInstruction(1, '1'),
      new DefaultInstruction(2, '2'),
    ];
    const instruction = new MergeInstruction(instructionsToMerge);
    const expectedInstructions = instructionsToMerge.map(
      (instruction) =>
        new TabBlockWriteInstruction(instruction.chord, instruction.note)
    );

    tab.writeInstructionsMerged = jest.fn();
    instruction.writeOnTab(tab);

    expect(tab.writeInstructionsMerged).toHaveBeenCalledWith(
      expectedInstructions
    );
  });
});
