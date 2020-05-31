import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { errorHandler } from './errorHandler.middleware';
import { ResponseErrorDefault } from '../models/responses/responseErrorDefault.model';

describe('[errorHandler]', () => {
  it('should return a 500 status code response by default', () => {
    const error = new Error();

    const requestObj = {} as Request;
    const responseObj = {} as Response;
    responseObj.status = jest.fn().mockReturnThis();
    responseObj.json = jest.fn().mockReturnThis();

    errorHandler(error, requestObj, responseObj, () => null);

    expect(responseObj.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should return an object with a general internal error message', () => {
    const errorMessage = 'test error message';
    const error = new Error(errorMessage);
    const expectedErrorResponse = new ResponseErrorDefault();

    const requestObj = {} as Request;
    const responseObj = {} as Response;
    responseObj.status = jest.fn().mockReturnThis();
    responseObj.json = jest.fn().mockReturnThis();

    errorHandler(error, requestObj, responseObj, () => null);

    expect(responseObj.json).toHaveBeenCalledWith(expectedErrorResponse);
  });
});
