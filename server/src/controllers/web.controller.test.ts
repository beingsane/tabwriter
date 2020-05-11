import { Request, Response } from 'express';
import { WebController } from './web.controller';
import { WebService } from '../services/web.service';

describe(`[${WebController.name}]`, () => {
  describe('[sendWebIndex]', () => {
    it('should return client index if found', async () => {
      const indexTestBuffer = Buffer.from('test');
      WebService.getIndex = jest.fn(() => Promise.resolve(indexTestBuffer));
      const webController = new WebController();

      const requestObj = {} as Request;
      const responseObj = {} as Response;
      responseObj.type = jest.fn(() => responseObj);
      responseObj.send = jest.fn(() => responseObj);

      await webController.sendWebIndex(requestObj, responseObj);

      expect(responseObj.type).toHaveBeenCalledWith('html');
      expect(responseObj.send).toHaveBeenCalledWith(indexTestBuffer);
    });
  });
});
