import { Request, Response } from 'express';
import { ValidationChain, body } from 'express-validator';
import * as HttpStatus from 'http-status-codes';
import { validateInputs } from './inputValidation.middleware';
import { ResponseErrorInvalidRequest } from './../models/httpResponseErrors/responseErrorInvalidRequest.model';

describe('[validateInputs]', () => {
  it('should call next if there are not validation errors', async () => {
    const testValidators: ValidationChain[] = [];
    const validationMiddleware = validateInputs(testValidators);

    const requestObj = {} as Request;
    const responseObj = {} as Response;
    const next = jest.fn();

    await validationMiddleware(requestObj, responseObj, next);

    expect(next).toHaveBeenCalled();
  });

  it('should not call next if there are validation errors', async () => {
    const testFieldName = 'testField';
    const testValidators: ValidationChain[] = [
      body(testFieldName)
        .not()
        .isEmpty(),
    ];
    const validationMiddleware = validateInputs(testValidators);

    const requestObj = { body: {} } as Request;
    const responseObj = {} as Response;
    responseObj.status = jest.fn().mockReturnThis();
    responseObj.json = jest.fn().mockReturnThis();
    const next = jest.fn();

    await validationMiddleware(requestObj, responseObj, next);

    expect(next).not.toHaveBeenCalled();
  });

  it('should respond with a bad request status code if there are validation errors', async () => {
    const testFieldName = 'testField';
    const testValidators: ValidationChain[] = [
      body(testFieldName)
        .not()
        .isEmpty(),
    ];
    const validationMiddleware = validateInputs(testValidators);

    const requestObj = { body: {} } as Request;
    const responseObj = {} as Response;
    responseObj.status = jest.fn().mockReturnThis();
    responseObj.json = jest.fn().mockReturnThis();
    const next = jest.fn();

    await validationMiddleware(requestObj, responseObj, next);

    expect(responseObj.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
  });

  it('should respond with a invalid request error if there are validation errors', async () => {
    const testFieldName = 'testField';
    const testValidators: ValidationChain[] = [
      body(testFieldName)
        .not()
        .isEmpty(),
    ];
    const validationMiddleware = validateInputs(testValidators);

    const requestObj = { body: {} } as Request;
    const responseObj = {} as Response;
    responseObj.status = jest.fn().mockReturnThis();
    responseObj.json = jest.fn().mockReturnThis();
    const next = jest.fn();

    await validationMiddleware(requestObj, responseObj, next);

    expect(responseObj.json).toHaveBeenCalledWith(expect.any(ResponseErrorInvalidRequest));
  });
});
