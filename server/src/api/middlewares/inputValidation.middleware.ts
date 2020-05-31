import { Request, Response, NextFunction, Handler } from 'express';
import { ValidationChain, validationResult, ValidationError } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { InputValidationError } from '../models/inputValidationError.model';
import { ResponseErrorInvalidRequest } from '../models/responseErrorInvalidRequest.model';

export const appValidationResult = validationResult.withDefaults({
  formatter: (error: ValidationError) => new InputValidationError(error),
});

export const validateInputs = (validations: ValidationChain[]): Handler => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await Promise.all(validations.map(validation => validation.run(req)));
      const errors = appValidationResult(req);

      if (errors.isEmpty()) return next();

      const validationErrors = errors.array({ onlyFirstError: true });
      const response = new ResponseErrorInvalidRequest(validationErrors);
      res.status(response.status).json(response);
    },
  );
};
