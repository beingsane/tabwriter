import * as HttpStatus from 'http-status-codes';
import { ResponseErrorResourceNotFound } from './responseErrorResourceNotFound.model';

describe(`[${ResponseErrorResourceNotFound.name}]`, () => {
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
