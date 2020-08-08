import request from 'supertest';
import express, { Application } from 'express';
import * as HttpStatus from 'http-status-codes';
import { TabwriterServer } from './server';
import { TabwriterServerConfig } from '../config/config';
import { ApiController } from './api.controller';
import { ResponseErrorResourceNotFound } from './models/responses/responseErrorResourceNotFound.model';

jest.mock('../config/config');

const getTestServer = (): Application => {
  const config = TabwriterServerConfig.getConfig();

  return new TabwriterServer({
    port: config.serverPort,
    middlewares: [express.json()],
    controllers: [new ApiController()],
  }).app;
};

describe(`[${ApiController.name}]`, () => {
  describe('/api/*', () => {
    it('should return a not found response', async () => {
      const requestedResource = '/api/some/unknown/resource';

      return request(getTestServer())
        .get(requestedResource)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND)
        .then((response) => {
          const body = response.body as ResponseErrorResourceNotFound;

          expect(body).toEqual(
            new ResponseErrorResourceNotFound(requestedResource)
          );
        });
    });
  });
});
