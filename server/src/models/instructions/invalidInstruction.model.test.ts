import { InvalidInstruction } from './invalidInstruction';

describe(`[${InvalidInstruction.name}]`, () => {
  it('should set up the instructions name', () => {
    const instruction = new InvalidInstruction('description');

    const instructionName = instruction.name.trim();

    expect(instructionName).toBeDefined();
    expect(instructionName.length).toBeGreaterThan(0);
  });

  it('should not be a mergeable instruction', () => {
    const instruction = new InvalidInstruction('description');

    expect(instruction.isMergeableInstruction()).toBe(false);
  });

  it('should return an unsuccess write result with the given description on write on tab', () => {
    const description = 'some invalid description';
    const instruction = new InvalidInstruction(description);

    const writeResult = instruction.writeOnTab();

    expect(writeResult.success).toBe(false);
    expect(writeResult.description).toBe(description);
  });
});
