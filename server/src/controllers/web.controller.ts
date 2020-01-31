import express from 'express';
import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { ControllerBase } from '../interfaces/ControllerBase.interface';
import { WebService } from '../services/web.service';

export class WebController implements ControllerBase {
  public readonly routePrefix = '*';
  public readonly router = express.Router();

  constructor() {
    this.router.get('*', this.sendWebPage);
  }

  public async sendWebPage(_req: Request, res: Response): Promise<void> {
    const webPagePath = await WebService.getWebPagePath();
    if (webPagePath != null) {
      res.sendFile(webPagePath);
    } else {
      res.sendStatus(httpStatusCodes.NOT_FOUND);
    }
  }
}
