/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application } from 'express';
import { BaseController } from './models/base.controller';

export interface TabwriterServerParams {
  port: number;
  middlewares: any[];
  controllers: BaseController[];
}

export class TabwriterServer {
  public readonly app: Application;
  public readonly port: number;

  constructor(serverParams: TabwriterServerParams) {
    this.app = express();
    this.port = serverParams.port;

    this.useMiddlewares(serverParams.middlewares);
    this.useControllers(serverParams.controllers);
  }

  public useMiddlewares(middlewares: any[]): void {
    middlewares.forEach((middleware) => this.useMiddleware(middleware));
  }

  public useMiddleware(middleware: any): void {
    this.app.use(middleware);
  }

  public useControllers(controllers: BaseController[]): void {
    controllers.forEach((controller) => this.useController(controller));
  }

  public useController(controller: BaseController): void {
    this.app.use(`/${controller.routePrefix}`, controller.router);
  }

  public start(cb?: () => void): void {
    this.app.listen(this.port, cb);
  }
}
