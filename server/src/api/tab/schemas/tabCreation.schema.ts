import { ParamSchema } from 'express-validator';
import { InvalidIntRange } from '../../models/errors/invalidIntRange.model';
import { EmptyParameter } from '../../models/errors/emptyParameter.model';
import { InvalidInputError } from '../../models/errors/invalidInputError.model';
import { InvalidType } from '../../models/errors/invalidType.model';
import { MissingParameter } from '../../models/errors/missingParameter.model';

export const MIN_ROWS_SPACING = 1;
export const MIN_ROWS_QUANTITY = 1;
export const MAX_ROWS_QUANTITY = 12;

export const tabCreationSchema: Record<string, ParamSchema> = {
  instructions: {
    exists: {
      errorMessage: (): InvalidInputError => new MissingParameter('instructions'),
    },
    isString: {
      errorMessage: (): InvalidInputError => new InvalidType('instructions', 'string'),
    },
    trim: true,
    notEmpty: {
      errorMessage: (): InvalidInputError => new EmptyParameter('instructions'),
    },
  },
  rowsQuantity: {
    exists: {
      errorMessage: (): InvalidInputError => new MissingParameter('rowsQuantity'),
    },
    isInt: {
      options: {
        min: MIN_ROWS_QUANTITY,
        max: MAX_ROWS_QUANTITY,
      },
      errorMessage: (value: string): InvalidInputError => {
        return Number.isInteger(Number(value))
          ? new InvalidIntRange('rowsQuantity', { min: MIN_ROWS_QUANTITY, max: MAX_ROWS_QUANTITY })
          : new InvalidType('rowsQuantity', 'int');
      },
    },
    toInt: true,
  },
  rowsSpacing: {
    exists: {
      errorMessage: (): InvalidInputError => new MissingParameter('rowsSpacing'),
    },
    isInt: {
      options: {
        min: MIN_ROWS_SPACING,
      },
      errorMessage: (value: string): InvalidInputError => {
        return Number.isInteger(Number(value))
          ? new InvalidIntRange('rowsSpacing', { min: MIN_ROWS_SPACING })
          : new InvalidType('rowsSpacing', 'int');
      },
    },
    toInt: true,
  },
};
