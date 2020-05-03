import { DefaultInstruction } from './defaultInstruction.model';
import { Tab } from '../tab/tab.model';
import { TabBlockWriteInstruction } from '../tab/tabBlockWriteInstruction.model';

describe(`[${DefaultInstruction.name}]`, () => {
  it('should set up the instructions name', () => {
    const instruction = new DefaultInstruction(1, '1');

    const instructionName = instruction.name.trim();

    expect(instructionName).toBeDefined();
    expect(instructionName.length).toBeGreaterThan(0);
  });

  it('should be a mergeable instruction', () => {
    const instruction = new DefaultInstruction(1, '1');

    expect(instruction.isMergeableInstruction()).toBe(true);
  });

  it('should write note on chord to the tab on write', () => {
    const tab = new Tab();
    const instruction = new DefaultInstruction(1, '1/2');
    const expectedWriteInstruction = new TabBlockWriteInstruction(instruction.chord, instruction.note);

    tab.writeInstruction = jest.fn();
    instruction.writeOnTab(tab);

    expect(tab.writeInstruction).toHaveBeenCalledWith(expectedWriteInstruction);
  });
});
