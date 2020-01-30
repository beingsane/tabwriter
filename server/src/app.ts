import express, { Handler } from 'express';
import morgan from 'morgan';
import { TabwriterServer } from './server';
import { tabwriterConfig } from './config';
import { WebController } from './controllers/web.controller';
import { ApiController } from './controllers/api.controller';

const middlewares: Handler[] = [express.json(), express.urlencoded({ extended: false })];

if (!tabwriterConfig.isProduction) {
  middlewares.push(morgan('dev'));
}

const app = new TabwriterServer({
  middlewares,
  port: tabwriterConfig.serverPort,
  assets: [express.static(tabwriterConfig.clientDistFolderPath)],
  controllers: [new WebController(), new ApiController()],
});

app.start();
