/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import { ResponseErrorDefault } from '../models/responses/responseErrorDefault.model';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  switch (err) {
    default: {
      const response = new ResponseErrorDefault();
      res.status(response.status).json(response);
    }
  }
};