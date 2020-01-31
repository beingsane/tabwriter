/* eslint-disable @typescript-eslint/no-empty-function */
import express from 'express';
import { Request, Response, NextFunction, Handler } from 'express';
import { ControllerBase } from './../interfaces/ControllerBase.interface';
import { TabwriterServer } from './../server';
import { TabwriterConfig } from './../config';

const getTestMiddleware = (): Handler => (_req: Request, _res: Response, next: NextFunction): void => {
  next();
};

const getTestController = (): ControllerBase => ({
  routePrefix: '/test',
  router: express.Router(),
});

const getTestAssetHandler = (): Handler => (): void => {};

const getServerListenMock = (): jest.Mock =>
  jest.fn().mockImplementation((port: number, cb: Function) => {
    cb();
  });

describe('[TabwriterServer]', () => {
  it('should use a given middleware', () => {
    const twServer = new TabwriterServer();
    twServer.app.use = jest.fn();

    const middleware = getTestMiddleware();
    twServer.useMiddleware(middleware);

    expect(twServer.app.use).toHaveBeenCalledWith(middleware);
  });

  it('should use a given controller', () => {
    const twServer = new TabwriterServer();
    twServer.app.use = jest.fn();

    const controller = getTestController();

    twServer.useController(controller);

    expect(twServer.app.use).toHaveBeenCalledWith(controller.routePrefix, controller.router);
  });

  it('should use a given asset handler', () => {
    const twServer = new TabwriterServer();
    twServer.app.use = jest.fn();

    const assetHandler = getTestAssetHandler();

    twServer.useAsset(assetHandler);

    expect(twServer.app.use).toHaveBeenCalledWith(assetHandler);
  });

  it('should listen for requests on the given port when provided', () => {
    const expectedPort = 1234;
    const twServer = new TabwriterServer(expectedPort);
    twServer.app.listen = getServerListenMock();

    twServer.start();

    expect(twServer.app.listen).toHaveBeenCalledWith(expectedPort, expect.any(Function));
  });

  it('should listen for requests on the default port if none is provided', () => {
    const twServer = new TabwriterServer();
    twServer.app.listen = getServerListenMock();

    twServer.start();

    expect(twServer.app.listen).toHaveBeenCalledWith(TabwriterConfig.DEFAULT_SERVER_PORT, expect.any(Function));
  });

  it('should call method onStartup once server is started', () => {
    const twServer = new TabwriterServer();
    twServer.app.listen = getServerListenMock();
    twServer.onStartup = jest.fn();

    twServer.start();

    expect(twServer.onStartup).toHaveBeenCalled();
  });
});
