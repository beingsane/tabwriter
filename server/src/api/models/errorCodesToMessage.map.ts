import { ErrorCode } from './errorCodes.enum';
import { MIN_ROWS_QUANTITY, MAX_ROWS_QUANTITY, MIN_ROWS_SPACING } from '../../api/api/tab/schemas/tabCreation.schema';

export const errorCodesToMessageMap: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_REQUEST]: 'Requisição Inválida',
  [ErrorCode.RESOURCE_NOT_FOUND]: 'Recurso não encontrado',
  [ErrorCode.ERROR_DEFAULT]: 'Erro inesperado',
  [ErrorCode.VALIDATION_DEFAULT]: 'Valor inválido',
  [ErrorCode.VALIDATION_TAB_CREATION_INSTRUCTIONS_MISSING]: 'Campo obrigatório',
  [ErrorCode.VALIDATION_TAB_CREATION_INSTRUCTIONS_INVALID_TYPE]: 'Deve ser do tipo string',
  [ErrorCode.VALIDATION_TAB_CREATION_INSTRUCTIONS_EMPTY_VALUE]: 'Não deve ser vazio',
  [ErrorCode.VALIDATION_TAB_CREATION_ROWS_QUANTITY_MISSING]: 'Campo obrigatório',
  [ErrorCode.VALIDATION_TAB_CREATION_ROWS_QUANTITY_INVALID_VALUE]: `Deve ser um inteiro entre ${MIN_ROWS_QUANTITY} e ${MAX_ROWS_QUANTITY}`,
  [ErrorCode.VALIDATION_TAB_CREATION_ROWS_SPACING_MISSING]: 'Campo obrigatório',
  [ErrorCode.VALIDATION_TAB_CREATION_ROWS_SPACING_INVALID_VALUE]: `Deve ser um inteiro maior do que ${MIN_ROWS_SPACING}`,
};
