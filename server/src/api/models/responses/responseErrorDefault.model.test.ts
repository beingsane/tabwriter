import * as HttpStatus from 'http-status-codes';
import { ResponseErrorDefault } from './responseErrorDefault.model';

describe(`[${ResponseErrorDefault.name}]`, () => {
  it('should set the message', () => {
    const responseError = new ResponseErrorDefault();

    expect(responseError.message).toBeDefined();
    expect(responseError.message.trim().length).toBeGreaterThan(0);
  });

  it('should return a internal server error status code', () => {
    const responseError = new ResponseErrorDefault();

    expect(responseError.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
