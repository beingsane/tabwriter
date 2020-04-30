import { SectionInstruction } from './sectionInstruction.model';
import { Tab } from '../tab/tab.model';

describe(`[${SectionInstruction.name}]`, () => {
  it('should set up the instructions name', () => {
    const instruction = new SectionInstruction('test section');

    const instructionName = instruction.name.trim();

    expect(instructionName).toBeDefined();
    expect(instructionName.length).toBeGreaterThan(0);
  });

  it('should not be a mergeable instruction', () => {
    const instruction = new SectionInstruction('test section');

    expect(instruction.isMergeableInstruction()).toBe(false);
  });

  it('should write section as a header to the tab on write', () => {
    const sectionName = 'test section';
    const tab = new Tab();
    const instruction = new SectionInstruction(sectionName);

    tab.writeHeader = jest.fn();
    instruction.writeOnTab(tab);

    expect(tab.writeHeader).toHaveBeenCalledWith(sectionName);
  });
});
