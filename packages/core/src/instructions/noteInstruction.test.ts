import { NoteInstruction } from './noteInstruction';
import { Tab } from '../tab/tab';

describe(`[${NoteInstruction.name}]`, () => {
  it('should set up the instructions name', () => {
    const instruction = new NoteInstruction('test note');

    const instructionName = instruction.name.trim();

    expect(instructionName).toBeDefined();
    expect(instructionName.length).toBeGreaterThan(0);
  });

  it('should not be a mergeable instruction', () => {
    const instruction = new NoteInstruction('test note');

    expect(instruction.isMergeableInstruction()).toBe(false);
  });

  it('should write note as a footer to the tab on write', () => {
    const note = 'test note';
    const tab = new Tab();
    const instruction = new NoteInstruction(note);

    tab.writeFooter = jest.fn();
    instruction.writeOnTab(tab);

    expect(tab.writeFooter).toHaveBeenCalledWith(note);
  });
});
