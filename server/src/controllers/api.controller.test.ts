import httpStatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { ApiController } from './api.controller';

describe(`[${ApiController.name}]`, () => {
  describe(`[${ApiController.prototype.test.name}]`, () => {
    it('should return OK', async () => {
      const apiController = new ApiController();

      const requestObj = {} as Request;
      const responseObj = {} as Response;
      responseObj.sendStatus = jest.fn();

      await apiController.test(requestObj, responseObj);

      expect(responseObj.sendStatus).toHaveBeenCalledWith(httpStatusCodes.OK);
    });
  });
});
