import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { WebController } from './web.controller';
import { WebService } from '../services/web.service';

describe(`[${WebController.name}]`, () => {
  describe(`[${WebController.prototype.sendWebPage.name}]`, () => {
    it('should return not found if client index is not found', async () => {
      WebService.getWebPagePath = jest.fn(() => Promise.resolve(null));
      const webController = new WebController();

      const requestObj = {} as Request;
      const responseObj = {} as Response;
      responseObj.sendFile = jest.fn();
      responseObj.sendStatus = jest.fn();

      await webController.sendWebPage(requestObj, responseObj);

      expect(responseObj.sendFile).not.toHaveBeenCalled();
      expect(responseObj.sendStatus).toHaveBeenCalledWith(httpStatusCodes.NOT_FOUND);
    });

    it('should return client index if found', async () => {
      const expectedPath = '/test';
      WebService.getWebPagePath = jest.fn(() => Promise.resolve(expectedPath));
      const webController = new WebController();

      const requestObj = {} as Request;
      const responseObj = {} as Response;
      responseObj.sendFile = jest.fn();
      responseObj.sendStatus = jest.fn();

      await webController.sendWebPage(requestObj, responseObj);

      expect(responseObj.sendFile).toHaveBeenCalledWith(expectedPath);
      expect(responseObj.sendStatus).not.toHaveBeenCalled();
    });
  });
});
