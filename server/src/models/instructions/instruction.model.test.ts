import { OperationErrorManager } from './../errors/operationErrorManager.model';
import { InstructionDefaultWriteBehavior } from './instructionDefaultWriteBehavior.model';
import { InstructionBreakWriteBehavior } from './instructionBreakWriteBehavior.model';
import { InstructionParsingMetadata } from './instructionMetadata.model';
import { Instruction } from './instruction.model';
import { Tab } from '../tab/tab.model';

describe(`[${Instruction.name}]`, () => {
  it('should be created with the default parsing metadata if none is provided', () => {
    const defaultParsingMetadata = new InstructionParsingMetadata();

    const instruction = new Instruction('1-2');

    expect(instruction.parsingMetadata).toEqual(defaultParsingMetadata);
  });

  it('should be created with the given parsing metadata if one is provided', () => {
    const parsingMetadata = new InstructionParsingMetadata(0, 2);

    const instruction = new Instruction('1-2', parsingMetadata);

    expect(instruction.parsingMetadata).toEqual(parsingMetadata);
  });

  it('should create an instruction with the default write behavior if the instruction is not a method', () => {
    const instructionStr = '1-2';
    const instruction = new Instruction(instructionStr);

    expect(instruction.writeBehaviour).not.toBeNull();
    expect(instruction.writeBehaviour).toBeInstanceOf(InstructionDefaultWriteBehavior);
  });

  it('should create an instruction with the default write behavior if the instruction is an unmapped method', () => {
    const instructionStr = 'method(args){ params }';
    const instruction = new Instruction(instructionStr);

    expect(instruction.writeBehaviour).not.toBeNull();
    expect(instruction.writeBehaviour).toBeInstanceOf(InstructionDefaultWriteBehavior);
  });

  it('should create an instruction with the break write behavior if the instruction is break', () => {
    const instructionStr = 'break';
    const instruction = new Instruction(instructionStr);

    expect(instruction.writeBehaviour).not.toBeNull();
    expect(instruction.writeBehaviour).toBeInstanceOf(InstructionBreakWriteBehavior);
  });

  it('should call writeToTab method of writeBehavior once its writeToTab method is called', () => {
    const instructionStr = '1-2';
    const instruction = new Instruction(instructionStr);
    const tab = new Tab();
    const errorManager = new OperationErrorManager();

    instruction.writeBehaviour.writeToTab = jest.fn();
    instruction.writeToTab(tab, errorManager);

    expect(instruction.writeBehaviour.writeToTab).toHaveBeenCalledWith(tab, errorManager);
  });

  it('should not call writeToTab method of writeToTab if instruction`s metadata are not read properly', () => {
    const instructionStr = '/';
    const instruction = new Instruction(instructionStr);
    const tab = new Tab();

    instruction.writeBehaviour.writeToTab = jest.fn();
    instruction.writeToTab(tab);

    expect(instruction.writeBehaviour.writeToTab).not.toHaveBeenCalled();
  });

  it('should add error on error manager if one is provided and instruction`s metadata are not read properly', () => {
    const instructionStr = '/';
    const instruction = new Instruction(instructionStr);
    const tab = new Tab();
    const errorManager = new OperationErrorManager();

    errorManager.addError = jest.fn();
    instruction.writeToTab(tab, errorManager);

    expect(errorManager.addError).toHaveBeenCalled();
  });
});
