import * as HttpStatus from 'http-status-codes';
import { ResponseErrorResourceNotFound } from './responseErrorResourceNotFound.model';
import { ErrorCode } from '../errors/errorCodes.enum';

describe(`[${ResponseErrorResourceNotFound.name}]`, () => {
  it('should be mapped to the resource not found error code', () => {
    expect(ResponseErrorResourceNotFound.ERROR_CODE).toBe(ErrorCode.RESOURCE_NOT_FOUND);
  });

  it('should set the message', () => {
    const resource = '/resource';
    const responseError = new ResponseErrorResourceNotFound(resource);

    expect(responseError.message).toBeDefined();
    expect(responseError.message.trim().length).toBeGreaterThan(0);
  });

  it('should add the requested resource in the message', () => {
    const resource = '/resource';
    const responseError = new ResponseErrorResourceNotFound(resource);

    expect(responseError.message).toContain(resource);
  });

  it('should return a not found status code', () => {
    const resource = '/resource';
    const responseError = new ResponseErrorResourceNotFound(resource);

    expect(responseError.status).toBe(HttpStatus.NOT_FOUND);
  });
});
