/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Handler } from 'express';
import { TabwriterServerConfig } from '../config/config';
import { TabwriterServer } from './server';
import { BaseController } from './models/base.controller';
jest.mock('../config/config.ts');

class TestController extends BaseController {
  public routePrefix = 'test';
}

const getTestController = (): BaseController => new TestController();

const getTestMiddleware = (): Handler => () => {};

const getTestServer = (
  serverParams: {
    port?: number;
    middlewares?: any[];
    controllers?: BaseController[];
  } = {}
): TabwriterServer => {
  const config = TabwriterServerConfig.getConfig();

  return new TabwriterServer({
    port: serverParams.port ?? config.serverPort,
    middlewares: serverParams.middlewares ?? [],
    controllers: serverParams.controllers ?? [],
  });
};

describe(`[${TabwriterServer.name}]`, () => {
  it('should listen for requests on the given port', () => {
    const config = TabwriterServerConfig.getConfig();
    const port = config.serverPort;
    const twServer = getTestServer({ port });

    twServer.app.listen = jest.fn();
    twServer.start();

    expect(twServer.app.listen).toHaveBeenCalledWith(port, undefined);
  });

  it('should use the given middlewares on instantiation', () => {
    const middlewares = [getTestMiddleware()];
    const useMiddlewaresSpy = jest.spyOn(
      TabwriterServer.prototype,
      'useMiddlewares'
    );

    getTestServer({
      middlewares,
    });

    expect(useMiddlewaresSpy).toHaveBeenCalledWith(middlewares);
    useMiddlewaresSpy.mockRestore();
  });

  it('should use the given controllers on instantiation', () => {
    const controllers = [getTestController()];
    const useControllersSpy = jest.spyOn(
      TabwriterServer.prototype,
      'useControllers'
    );

    getTestServer({
      controllers,
    });

    expect(useControllersSpy).toHaveBeenCalledWith(controllers);
    useControllersSpy.mockRestore();
  });

  it('should use a given middleware', () => {
    const middleware = getTestMiddleware();
    const twServer = getTestServer();

    twServer.app.use = jest.fn();
    twServer.useMiddleware(middleware);

    expect(twServer.app.use).toHaveBeenCalledWith(middleware);
  });

  it('should use the given middlewares', () => {
    const middleware = getTestMiddleware();
    const twServer = getTestServer();

    twServer.useMiddleware = jest.fn().mockReturnThis();
    twServer.useMiddlewares([middleware]);

    expect(twServer.useMiddleware).toHaveBeenCalledWith(middleware);
  });

  it('should use a given controller', () => {
    const controller = getTestController();
    const expectedRoute = `/${controller.routePrefix}`;
    const twServer = getTestServer();

    twServer.app.use = jest.fn();
    twServer.useController(controller);

    expect(twServer.app.use).toHaveBeenCalledWith(
      expectedRoute,
      controller.router
    );
  });

  it('should use the given controllers', () => {
    const controller = getTestController();
    const twServer = getTestServer();

    twServer.useController = jest.fn();
    twServer.useControllers([controller]);

    expect(twServer.useController).toHaveBeenCalledWith(controller);
  });
});
