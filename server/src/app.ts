import express from 'express';
import morgan from 'morgan';
import { TabwriterServer } from './server';
import { tabwriterConfig } from './config/config';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { WebController } from './controllers/web/web.controller';
import { ApiController } from './controllers/api/api.controller';
import { TabController } from './controllers/api/tab.controller';

const twServer = new TabwriterServer(tabwriterConfig.serverPort);

twServer.useMiddleware(express.json());
twServer.useMiddleware(express.urlencoded({ extended: false }));
if (!tabwriterConfig.isProduction) twServer.useMiddleware(morgan('dev'));

twServer.useAsset(express.static(tabwriterConfig.clientDistFolderPath));

const tabController = new TabController();
const apiController = new ApiController([tabController]);
twServer.useController(apiController);

const webController = new WebController();
twServer.useController(webController);

twServer.useMiddleware(errorHandler);

twServer.start();
