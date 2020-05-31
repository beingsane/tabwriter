import { ParamSchema } from 'express-validator';
import { ErrorCode } from '../../../models/errorCodes.enum';

export const MIN_ROWS_SPACING = 1;
export const MIN_ROWS_QUANTITY = 1;
export const MAX_ROWS_QUANTITY = 12;

export const tabCreationSchema: Record<string, ParamSchema> = {
  instructions: {
    exists: {
      errorMessage: ErrorCode.VALIDATION_TAB_CREATION_INSTRUCTIONS_MISSING,
    },
    isString: {
      errorMessage: ErrorCode.VALIDATION_TAB_CREATION_INSTRUCTIONS_INVALID_TYPE,
    },
    trim: true,
    notEmpty: {
      errorMessage: ErrorCode.VALIDATION_TAB_CREATION_INSTRUCTIONS_EMPTY_VALUE,
    },
  },
  rowsQuantity: {
    exists: {
      errorMessage: ErrorCode.VALIDATION_TAB_CREATION_ROWS_QUANTITY_MISSING,
    },
    isInt: {
      options: {
        min: MIN_ROWS_QUANTITY,
        max: MAX_ROWS_QUANTITY,
      },
      errorMessage: ErrorCode.VALIDATION_TAB_CREATION_ROWS_QUANTITY_INVALID_VALUE,
    },
    toInt: true,
  },
  rowsSpacing: {
    exists: {
      errorMessage: ErrorCode.VALIDATION_TAB_CREATION_ROWS_SPACING_MISSING,
    },
    isInt: {
      options: {
        min: MIN_ROWS_SPACING,
      },
      errorMessage: ErrorCode.VALIDATION_TAB_CREATION_ROWS_SPACING_INVALID_VALUE,
    },
    toInt: true,
  },
};
