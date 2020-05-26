import * as HttpStatus from 'http-status-codes';
import { ErrorCode } from './errorCodes.enum';
import { errorCodesToMessageMap } from './errorCodesToMessage.map';
import { ResponseErrorDefault } from './responseErrorDefault.model';

describe(`[${ResponseErrorDefault.name}]`, () => {
  it('should set the message for the default error code', () => {
    const responseError = new ResponseErrorDefault();

    expect(responseError.message).toBe(errorCodesToMessageMap[ErrorCode.ERROR_DEFAULT]);
  });

  it('should return a internal server error status code', () => {
    const responseError = new ResponseErrorDefault();

    expect(responseError.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
