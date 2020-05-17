import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { errorHandler } from './errorHandler.middleware';

describe('[errorHandler]', () => {
  it('should return a 500 status code response by default', () => {
    const error = new Error();

    const requestObj = {} as Request;
    const responseObj = {} as Response;
    responseObj.status = jest.fn().mockReturnThis();
    responseObj.send = jest.fn().mockReturnThis();

    errorHandler(error, requestObj, responseObj, () => null);

    expect(responseObj.status).toHaveBeenCalledWith(httpStatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('should return an object with the error message', () => {
    const errorMessage = 'test error message';
    const error = new Error(errorMessage);
    const expectedResponsePayload = { message: errorMessage };

    const requestObj = {} as Request;
    const responseObj = {} as Response;
    responseObj.status = jest.fn().mockReturnThis();
    responseObj.send = jest.fn().mockReturnThis();

    errorHandler(error, requestObj, responseObj, () => null);

    expect(responseObj.send).toHaveBeenCalledWith(expectedResponsePayload);
  });
});
