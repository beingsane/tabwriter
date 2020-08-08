import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { TabwriterServer } from './api/server';
import { TabwriterServerConfig } from './config/config';
import { errorHandler } from './api/middlewares/errorHandler.middleware';
import { WebController } from './api/web/web.controller';
import { ApiController } from './api/api.controller';
import { TabController } from './api/tab/tab.controller';

const config = TabwriterServerConfig.getConfig();

const tabController = new TabController();
const apiController = new ApiController([tabController]);
const webController = new WebController();

const twServer = new TabwriterServer({
  port: config.serverPort,
  middlewares: [
    helmet(),
    ...(config.isProduction ? [] : [morgan('dev')]),
    express.json(),
    express.urlencoded({ extended: false }),
  ],
  controllers: [apiController, webController],
});

twServer.useMiddlewares([
  errorHandler,
  express.static(config.clientDistFolderPath),
]);

twServer.start(() =>
  console.log(
    `[${TabwriterServer.name}] Listening on port: ${config.serverPort}`
  )
);
