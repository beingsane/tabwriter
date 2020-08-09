import { SetSpacingInstruction } from './setSpacingInstruction';
import { Tab } from '../tab/tab';

describe(`[${SetSpacingInstruction.name}]`, () => {
  it('should set up the instructions name', () => {
    const instruction = new SetSpacingInstruction(1);

    const instructionName = instruction.name.trim();

    expect(instructionName).toBeDefined();
    expect(instructionName.length).toBeGreaterThan(0);
  });

  it('should not be a mergeable instruction', () => {
    const instruction = new SetSpacingInstruction(1);

    expect(instruction.isMergeableInstruction()).toBe(false);
  });

  it('should set the tab rows spacing on write', () => {
    const tab = new Tab();
    const spacing = 10;
    const instruction = new SetSpacingInstruction(spacing);

    instruction.writeOnTab(tab);

    expect(tab.rowsSpacing).toBe(spacing);
  });
});
