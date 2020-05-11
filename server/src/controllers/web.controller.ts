import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ControllerBase } from './controllerBase.interface';
import { WebService } from '../services/web.service';

export class WebController implements ControllerBase {
  public readonly routePrefix = '*';
  public readonly router = express.Router();

  constructor() {
    this.router.get('*', asyncHandler(this.sendWebIndex));
  }

  public async sendWebIndex(_req: Request, res: Response): Promise<void> {
    const webIndex = await WebService.getIndex();

    res.type('html').send(webIndex);
  }
}
