import express from 'express';
import morgan from 'morgan';
import { TabwriterServer } from './server';
import { tabwriterConfig } from './config/config';
import { WebController } from './controllers/web.controller';
import { ApiController } from './controllers/api.controller';

const twServer = new TabwriterServer(tabwriterConfig.serverPort);

twServer.useMiddleware(express.json());
twServer.useMiddleware(express.urlencoded({ extended: false }));
if (!tabwriterConfig.isProduction) twServer.useMiddleware(morgan('dev'));

twServer.useAsset(express.static(tabwriterConfig.clientDistFolderPath));

twServer.useController(new ApiController());
twServer.useController(new WebController());

twServer.start();
