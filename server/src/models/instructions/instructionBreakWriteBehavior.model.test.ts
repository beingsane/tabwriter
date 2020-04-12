import { InstructionBreakWriteBehavior } from './instructionBreakWriteBehavior.model';
import { Instruction } from './instruction.model';
import { Tab } from '../tab/tab.model';

describe(`[${InstructionBreakWriteBehavior.name}]`, () => {
  it('should add a tab block to tab', () => {
    const instructionStr = 'break';
    const instruction = new Instruction(instructionStr);

    const tab = new Tab();
    const currentaTabBlocksQty = tab.tabBlocks.length;

    instruction.writeToTab(tab);

    expect(tab.tabBlocks.length).toBe(currentaTabBlocksQty + 1);
  });
});
