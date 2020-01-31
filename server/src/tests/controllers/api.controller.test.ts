import httpStatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { ApiController } from './../../controllers/api.controller';

describe('[ApiController]', () => {
  describe('[test]', () => {
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
