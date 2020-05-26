import * as HttpStatus from 'http-status-codes';
import { ErrorCode } from './errorCodes.enum';
import { errorCodesToMessageMap } from './errorCodesToMessage.map';
import { ResponseErrorResourceNotFound } from './responseErrorResourceNotFound.model';

describe(`[${ResponseErrorResourceNotFound.name}]`, () => {
  it('should set the message for the resource not found message', () => {
    const responseError = new ResponseErrorResourceNotFound();

    expect(responseError.message).toBe(errorCodesToMessageMap[ErrorCode.RESOURCE_NOT_FOUND]);
  });

  it('should return a not found status code', () => {
    const responseError = new ResponseErrorResourceNotFound();

    expect(responseError.status).toBe(HttpStatus.NOT_FOUND);
  });
});
