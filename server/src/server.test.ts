import express from 'express';
import { Request, Response, NextFunction, Handler } from 'express';
import { TabwriterConfig } from './config/config';
import { TabwriterServer } from './server';
import { ControllerBase } from './controllers/controllerBase.interface';

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

describe(`[${TabwriterServer.name}]`, () => {
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
    const startupCallback = jest.fn();
    const twServer = new TabwriterServer(expectedPort);

    twServer.app.listen = getServerListenMock();
    twServer.onStartup = startupCallback;
    twServer.start();

    expect(twServer.app.listen).toHaveBeenCalledWith(expectedPort, startupCallback);
  });

  it('should listen for requests on the default port if none is provided', () => {
    const startupCallback = jest.fn();
    const twServer = new TabwriterServer();

    twServer.app.listen = getServerListenMock();
    twServer.onStartup = startupCallback;

    twServer.start();

    expect(twServer.app.listen).toHaveBeenCalledWith(TabwriterConfig.DEFAULT_SERVER_PORT, startupCallback);
  });

  it('should call method onStartup once server is started', () => {
    const twServer = new TabwriterServer();
    twServer.app.listen = getServerListenMock();
    twServer.onStartup = jest.fn();

    twServer.start();

    expect(twServer.onStartup).toHaveBeenCalled();
  });

  it('should log server initialization on onStartup call', () => {
    const twServer = new TabwriterServer();
    console.log = jest.fn();

    twServer.onStartup();

    expect(console.log).toHaveBeenCalled();
  });
});
