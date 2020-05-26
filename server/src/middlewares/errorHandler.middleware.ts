/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';
import { ResponseErrorDefault } from '../models/httpResponseErrors/responseErrorDefault.model';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  switch (err) {
    default:
      const response = new ResponseErrorDefault();
      res.status(response.status).json(response);
  }
};
