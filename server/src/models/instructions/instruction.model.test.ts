import { OperationErrorManager } from './../errors/operationErrorManager.model';
import { InstructionDefaultWriteBehavior } from './instructionDefaultWriteBehavior.model';
import { Instruction } from './instruction.model';
import { Tab } from '../tab/tab.model';

describe(`[${Instruction.name}]`, () => {
  it('should create an instruction with the default write behavior if the instruction is not a method', () => {
    const instructionStr = '1-2';
    const instruction = new Instruction(instructionStr, 0, instructionStr.length);

    expect(instruction.writeBehaviour).not.toBeNull();
    expect(instruction.writeBehaviour).toBeInstanceOf(InstructionDefaultWriteBehavior);
  });

  it('should create an instruction with the default write behavior if the instruction is a method', () => {
    const instructionStr = 'method(args){ params }';
    const instruction = new Instruction(instructionStr, 0, instructionStr.length);

    expect(instruction.writeBehaviour).not.toBeNull();
    expect(instruction.writeBehaviour).toBeInstanceOf(InstructionDefaultWriteBehavior);
  });

  it('should call writeToTab method of writeBehavior once its writeToTab method is called', () => {
    const instructionStr = '1-2';
    const instruction = new Instruction(instructionStr, 0, instructionStr.length);
    const tab = new Tab();
    const errorManager = new OperationErrorManager();

    instruction.writeBehaviour.writeToTab = jest.fn();
    instruction.writeToTab(tab, errorManager);

    expect(instruction.writeBehaviour.writeToTab).toHaveBeenCalledWith(tab, errorManager);
  });
});
