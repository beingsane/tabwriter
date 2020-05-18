import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { ApiController } from './api.controller';

describe(`[${ApiController.name}]`, () => {
  describe('[resourceNotFound]', () => {
    it('should return a not found response', () => {
      const apiController = new ApiController();

      const requestObj = {} as Request;
      const responseObj = {} as Response;
      responseObj.status = jest.fn().mockReturnThis();
      responseObj.send = jest.fn().mockReturnThis();

      apiController.resourceNotFound(requestObj, responseObj);

      expect(responseObj.status).toHaveBeenCalledWith(httpStatusCodes.NOT_FOUND);
      expect(responseObj.send).toHaveBeenCalled();
    });
  });
});
