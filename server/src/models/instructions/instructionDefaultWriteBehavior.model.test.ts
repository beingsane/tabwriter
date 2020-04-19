import { TabBlockWriteResultDto, TabBlockWriteInstruction } from './../tab/tabBlock.model';
import { OperationErrorManager } from './../errors/operationErrorManager.model';
import { InstructionDefaultWriteBehavior } from './instructionDefaultWriteBehavior.model';
import { Instruction } from './instruction.model';
import { Tab } from '../tab/tab.model';
import { TabBlock } from '../tab/tabBlock.model';

const createInstructionDefaultWriteBehavior = (instructionStr: string): InstructionDefaultWriteBehavior => {
  const instruction = new Instruction(instructionStr);
  return new InstructionDefaultWriteBehavior(instruction);
};

describe(`[${InstructionDefaultWriteBehavior.name}]`, () => {
  it(`should not write note on tab if it can't read instruction's chord and note`, () => {
    const instructionStr = 'method(args) { params }';
    const instructionDefaultWriteBehavior = createInstructionDefaultWriteBehavior(instructionStr);
    const tab = new Tab();

    TabBlock.prototype.writeInstruction = jest.fn();
    instructionDefaultWriteBehavior.writeToTab(tab);

    expect(TabBlock.prototype.writeInstruction).not.toHaveBeenCalled();
  });

  it(`should add error on error manager if one is provided and it can't read instruction's chord and note`, () => {
    const instructionStr = 'method(args) { params }';
    const instructionDefaultWriteBehavior = createInstructionDefaultWriteBehavior(instructionStr);
    const tab = new Tab();
    const errorManager = new OperationErrorManager();

    errorManager.addError = jest.fn();
    instructionDefaultWriteBehavior.writeToTab(tab, errorManager);

    expect(errorManager.addError).toHaveBeenCalled();
  });

  it(`should write note on tab if it can read instructon's chord and note`, () => {
    const chord = 1;
    const note = '2';
    const instructionStr = `${chord}-${note}`;
    const instructionDefaultWriteBehavior = createInstructionDefaultWriteBehavior(instructionStr);
    const tab = new Tab();

    const expectedWriteInstruction = new TabBlockWriteInstruction(chord, note);
    TabBlock.prototype.writeInstruction = jest.fn(() => new TabBlockWriteResultDto(true));
    instructionDefaultWriteBehavior.writeToTab(tab);

    expect(TabBlock.prototype.writeInstruction).toHaveBeenCalledWith(expectedWriteInstruction);
  });

  it('should add error on error manager if one is provided and it gets an error while writing chord and not to tab', () => {
    const chord = 1;
    const note = '2';
    const instructionStr = `${chord}-${note}`;
    const instructionDefaultWriteBehavior = createInstructionDefaultWriteBehavior(instructionStr);
    const tab = new Tab();
    const errorManager = new OperationErrorManager();

    errorManager.addError = jest.fn();
    TabBlock.prototype.writeInstruction = jest.fn(() => new TabBlockWriteResultDto(false));
    instructionDefaultWriteBehavior.writeToTab(tab, errorManager);

    expect(errorManager.addError).toHaveBeenCalled();
  });
});
