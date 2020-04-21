import { BreakInstruction } from './breakInstruction.model';
import { Tab } from '../tab/tab.model';

describe(`[${BreakInstruction.name}]`, () => {
  it('should set up the instructions name', () => {
    const instruction = new BreakInstruction();

    const instructionName = instruction.name.trim();

    expect(instructionName).toBeDefined();
    expect(instructionName.length).toBeGreaterThan(0);
  });

  it('should not be a mergeable instruction', () => {
    const instruction = new BreakInstruction();

    expect(instruction.isMergeableInstruction()).toBe(false);
  });

  it('add a tab block to the tab on write', () => {
    const tab = new Tab();
    const instruction = new BreakInstruction();

    tab.addTabBlock = jest.fn();
    instruction.writeOnTab(tab);

    expect(tab.addTabBlock).toHaveBeenCalled();
  });
});
