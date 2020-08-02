import { ErrorCode } from '../../models/errors/errorCodes.enum';
import { InstructionWriteResult } from '../../../services/tabWriter.service';

export class InvalidInstructionError {
  public readonly code = ErrorCode.UNPROCESSABLE_TAB_INSTRUCTION;
  public readonly message: string;
  public readonly instruction: string;
  public readonly readFrom: number;
  public readonly readTo: number;
  public readonly context: string;

  constructor({
    error,
    instruction,
    readFromIdx,
    readToIdx,
    name,
  }: InstructionWriteResult) {
    this.message = error !== null ? error : '';
    this.instruction = instruction;
    this.readFrom = readFromIdx;
    this.readTo = readToIdx;
    this.context = name;
  }
}
