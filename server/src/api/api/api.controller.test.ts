import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { ApiController } from './api.controller';
import { ResponseErrorResourceNotFound } from './../models/responses/responseErrorResourceNotFound.model';

describe(`[${ApiController.name}]`, () => {
  describe('[resourceNotFound]', () => {
    it('should return a not found response', () => {
      const resource = '/resource';
      const apiController = new ApiController();
      const expectedErrorResponse = new ResponseErrorResourceNotFound(resource);

      const requestObj = { originalUrl: resource } as Request;
      const responseObj = {} as Response;
      responseObj.status = jest.fn().mockReturnThis();
      responseObj.json = jest.fn().mockReturnThis();

      apiController.resourceNotFound(requestObj, responseObj);

      expect(responseObj.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(responseObj.json).toHaveBeenCalledWith(expectedErrorResponse);
    });
  });
});
