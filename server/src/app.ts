import express from 'express';
import helmet from 'helmet';
// import morgan from 'morgan';
import { TabwriterServer } from './api/server';
import { tabwriterConfig } from './config/config';
import { errorHandler } from './api/middlewares/errorHandler.middleware';
import { WebController } from './api/web/web.controller';
import { ApiController } from './api/api.controller';
import { TabController } from './api/tab/tab.controller';

const twServer = new TabwriterServer(tabwriterConfig.serverPort);

twServer.useMiddleware(helmet());
twServer.useMiddleware(express.json());
twServer.useMiddleware(express.urlencoded({ extended: false }));
// if (!tabwriterConfig.isProduction) twServer.useMiddleware(morgan('dev'));

twServer.useAsset(express.static(tabwriterConfig.clientDistFolderPath));

const tabController = new TabController();
const apiController = new ApiController([tabController]);
twServer.useController(apiController);

const webController = new WebController();
twServer.useController(webController);

twServer.useMiddleware(errorHandler);

twServer.start();
