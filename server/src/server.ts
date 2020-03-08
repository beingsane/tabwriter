import express from 'express';
import { Application, RequestHandler, Handler } from 'express';
import { ControllerBase } from './interfaces/ControllerBase.interface';
import { TabwriterConfig } from './config';

export class TabwriterServer {
  public readonly app: Application;
  public port: number;

  constructor(port?: number) {
    this.app = express();
    this.app.disable('x-powered-by');

    this.port = port ? port : TabwriterConfig.DEFAULT_SERVER_PORT;
  }

  public useMiddleware(middleware: RequestHandler): void {
    this.app.use(middleware);
  }

  public useController(controller: ControllerBase): void {
    this.app.use(controller.routePrefix, controller.router);
  }

  public useAsset(assetHandler: Handler): void {
    this.app.use(assetHandler);
  }

  public onStartup = (): void => console.log(`[${TabwriterServer.name}] Running at http://localhost:${this.port}`);

  public start(): void {
    this.app.listen(this.port, this.onStartup);
  }
}
