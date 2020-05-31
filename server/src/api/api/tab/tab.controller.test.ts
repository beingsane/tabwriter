import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { TabController } from './tab.controller';
import { TabWriterInstructions, TabWriterService } from '../../../services/tabWriter.service';

describe(`[${TabController.name}]`, () => {
  describe('[createTab]', () => {
    it('should create a tab for the given params', () => {
      const tabController = new TabController();
      const tabWriterInstructions: TabWriterInstructions = {
        instructions: '1-2',
        rowsQuantity: 6,
        rowsSpacing: 3,
      };

      const tabCreationSpy = jest.spyOn(TabWriterService, 'writeTab');

      const requestObj = {} as Request;
      requestObj.body = tabWriterInstructions;

      const responseObj = {} as Response;
      responseObj.status = jest.fn().mockReturnThis();
      responseObj.send = jest.fn().mockReturnThis();

      tabController.createTab(requestObj, responseObj);

      expect(tabCreationSpy).toHaveBeenCalledWith(tabWriterInstructions);
      expect(responseObj.status).toHaveBeenCalledWith(HttpStatus.OK);

      tabCreationSpy.mockRestore();
    });
  });
});
