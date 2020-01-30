import express, { Application, RequestHandler, Handler } from 'express';
import { ControllerBase } from './interfaces/ControllerBase.interface';
import { TabwriterConfig } from './config';

export interface TabwriterServerConfig {
  port?: number;
  middlewares?: Handler[];
  controllers?: ControllerBase[];
  assets?: Handler[];
}

export class TabwriterServer {
  private app: Application;
  public port: number;

  get server(): Application {
    return this.app;
  }

  constructor(config: TabwriterServerConfig) {
    this.app = express();
    this.port = config.port ? config.port : TabwriterConfig.DEFAULT_SERVER_PORT;

    if (config.middlewares) {
      config.middlewares.forEach(middleware => this.useMiddleware(middleware));
    }

    if (config.controllers) {
      config.controllers.forEach(controller => this.useController(controller));
    }

    if (config.assets) {
      config.assets.forEach(asset => this.useAsset(asset));
    }
  }

  private useMiddleware(middleware: RequestHandler): void {
    this.app.use(middleware);
  }

  private useController(controller: ControllerBase): void {
    this.app.use(controller.routePrefix, controller.router);
  }

  private useAsset(assetHandler: Handler): void {
    this.app.use(assetHandler);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`[server] Running at http://localhost:${this.port}`);
    });
  }
}
