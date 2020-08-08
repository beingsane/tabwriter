/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import express, { Application } from 'express';
import * as HttpStatus from 'http-status-codes';
import { TabwriterServer } from '../server';
import { TabwriterServerConfig } from '../../config/config';
import { TabController } from './tab.controller';
import { ErrorCode } from '../models/errors/errorCodes.enum';
import { ResponseErrorInvalidRequest } from '../models/responses/responseErrorInvalidRequest.model';
import { ResponseErrorInvalidInstructions } from './models/responseErrorInvalidInstructions.model';

jest.mock('../../config/config.ts');

const getTestServer = (): Application => {
  const config = TabwriterServerConfig.getConfig();

  return new TabwriterServer({
    port: config.serverPort,
    middlewares: [express.json()],
    controllers: [new TabController()],
  }).app;
};

describe(`[${TabController.name}]`, () => {
  describe('POST /tabs', () => {
    it('should return an invalid request if instructions parameter is not provided', async () => {
      const payload = { rowsSpacing: 1, rowsQuantity: 1 };

      return request(getTestServer())
        .post('/tabs')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ResponseErrorInvalidRequest;

          expect(body.errors.length).toBe(1);
          expect(body.errors[0].code).toBe(
            ErrorCode.VALIDATION_REQUIRED_PARAMETER_MISSING
          );
          expect(body.errors[0].field).toBe('instructions');
        });
    });

    it('should return an invalid request if instructions parameter is of an invalid type', async () => {
      const payload = { rowsSpacing: 1, rowsQuantity: 1, instructions: 1 };

      return request(getTestServer())
        .post('/tabs')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ResponseErrorInvalidRequest;

          expect(body.errors.length).toBe(1);
          expect(body.errors[0].code).toBe(ErrorCode.VALIDATION_INVALID_TYPE);
          expect(body.errors[0].field).toBe('instructions');
        });
    });

    it('should return an invalid request if instructions parameter is an empty string', async () => {
      const payload = { rowsSpacing: 1, rowsQuantity: 1, instructions: ' ' };

      return request(getTestServer())
        .post('/tabs')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ResponseErrorInvalidRequest;

          expect(body.errors.length).toBe(1);
          expect(body.errors[0].code).toBe(
            ErrorCode.VALIDATION_REQUIRED_PARAMETER_EMPTY
          );
          expect(body.errors[0].field).toBe('instructions');
        });
    });

    it('should return an invalid request if rowsSpacing parameter is not provided', async () => {
      const payload = { rowsQuantity: 1, instructions: '1-2' };

      return request(getTestServer())
        .post('/tabs')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ResponseErrorInvalidRequest;

          expect(body.errors.length).toBe(1);
          expect(body.errors[0].code).toBe(
            ErrorCode.VALIDATION_REQUIRED_PARAMETER_MISSING
          );
          expect(body.errors[0].field).toBe('rowsSpacing');
        });
    });

    it('should return an invalid request if rowsSpacing parameter is of an invalid type', async () => {
      const payload = {
        rowsQuantity: 1,
        instructions: '1-2',
        rowsSpacing: 'invalid type',
      };

      return request(getTestServer())
        .post('/tabs')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ResponseErrorInvalidRequest;

          expect(body.errors.length).toBe(1);
          expect(body.errors[0].code).toBe(ErrorCode.VALIDATION_INVALID_TYPE);
          expect(body.errors[0].field).toBe('rowsSpacing');
        });
    });

    it('should return an invalid request if rowsSpacing parameter is smaller than 1', async () => {
      const payload = { rowsQuantity: 1, instructions: '1-2', rowsSpacing: 0 };

      return request(getTestServer())
        .post('/tabs')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ResponseErrorInvalidRequest;

          expect(body.errors.length).toBe(1);
          expect(body.errors[0].code).toBe(
            ErrorCode.VALIDATION_INVALID_INT_RANGE_VALUE
          );
          expect(body.errors[0].field).toBe('rowsSpacing');
        });
    });

    it('should return an invalid request if rowsQuantity parameter is not provided', async () => {
      const payload = { rowsSpacing: 1, instructions: '1-2' };

      return request(getTestServer())
        .post('/tabs')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ResponseErrorInvalidRequest;

          expect(body.errors.length).toBe(1);
          expect(body.errors[0].code).toBe(
            ErrorCode.VALIDATION_REQUIRED_PARAMETER_MISSING
          );
          expect(body.errors[0].field).toBe('rowsQuantity');
        });
    });

    it('should return an invalid request if rowsQuantity parameter is of an invalid type', async () => {
      const payload = {
        rowsSpacing: 1,
        instructions: '1-2',
        rowsQuantity: 'invalid type',
      };

      return request(getTestServer())
        .post('/tabs')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ResponseErrorInvalidRequest;

          expect(body.errors.length).toBe(1);
          expect(body.errors[0].code).toBe(ErrorCode.VALIDATION_INVALID_TYPE);
          expect(body.errors[0].field).toBe('rowsQuantity');
        });
    });

    it('should return an invalid request if rowsQuantity parameter is smaller than 1', async () => {
      const payload = { rowsSpacing: 1, instructions: '1-2', rowsQuantity: 0 };

      return request(getTestServer())
        .post('/tabs')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ResponseErrorInvalidRequest;

          expect(body.errors.length).toBe(1);
          expect(body.errors[0].code).toBe(
            ErrorCode.VALIDATION_INVALID_INT_RANGE_VALUE
          );
          expect(body.errors[0].field).toBe('rowsQuantity');
        });
    });

    it('should return an invalid request if rowsQuantity parameter is greather than 12', async () => {
      const payload = { rowsSpacing: 1, instructions: '1-2', rowsQuantity: 13 };

      return request(getTestServer())
        .post('/tabs')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const body = response.body as ResponseErrorInvalidRequest;

          expect(body.errors.length).toBe(1);
          expect(body.errors[0].code).toBe(
            ErrorCode.VALIDATION_INVALID_INT_RANGE_VALUE
          );
          expect(body.errors[0].field).toBe('rowsQuantity');
        });
    });

    it('should return an invalid instructions if there are falied instructions', async () => {
      const invalidInstruction = '0-1';
      const payload = {
        rowsSpacing: 1,
        rowsQuantity: 1,
        instructions: `1-2 ${invalidInstruction}`,
      };

      return request(getTestServer())
        .post('/tabs')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
        .then((response) => {
          const body = response.body as ResponseErrorInvalidInstructions;

          expect(body.errors.length).toBe(1);
          expect(body.errors[0].code).toBe(
            ErrorCode.UNPROCESSABLE_TAB_INSTRUCTION
          );
          expect(body.errors[0].instruction).toBe(invalidInstruction);
        });
    });

    it('should return the created tab on success', async () => {
      const payload = {
        rowsSpacing: 1,
        rowsQuantity: 1,
        instructions: '1-2 1-1',
      };

      return request(getTestServer())
        .post('/tabs')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK);
    });
  });
});
