import express, { Application, Handler, ErrorRequestHandler } from 'express';
import { TabwriterServerConfig } from '../config/config';
import { BaseController } from './models/base.controller';

export class TabwriterServer {
  public readonly app: Application;
  public port: number;

  constructor(port?: number) {
    this.app = express();

    const config = TabwriterServerConfig.getConfig();
    this.port = port ? port : config.serverPort;
  }

  public useMiddleware(middleware: Handler | ErrorRequestHandler): void {
    this.app.use(middleware);
  }

  public useController(controller: BaseController): void {
    this.app.use(`/${controller.routePrefix}`, controller.router);
  }

  public useAsset(assetHandler: Handler): void {
    this.app.use(assetHandler);
  }

  public onStartup = (): void =>
    console.log(
      `[${TabwriterServer.name}] Running at http://localhost:${this.port}`
    );

  public start(): void {
    this.app.listen(this.port, this.onStartup);
  }
}
