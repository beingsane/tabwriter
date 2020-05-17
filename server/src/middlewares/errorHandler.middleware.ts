import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import httpStatusCodes from 'http-status-codes';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  switch (err) {
    default:
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
};
