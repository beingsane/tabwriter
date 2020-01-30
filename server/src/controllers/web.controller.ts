import express, { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { ControllerBase } from '../interfaces/ControllerBase.interface';
import { WebService } from '../services/web.service';

export class WebController implements ControllerBase {
  public readonly routePrefix = '/web';
  public readonly router = express.Router();

  constructor() {
    this.router.get('/', this.getWebPage);
  }

  private getWebPage(req: Request, res: Response): void {
    const webPagePath = WebService.getWebPagePath();
    if (webPagePath != null) {
      res.sendFile(webPagePath);
    } else {
      res.sendStatus(httpStatusCodes.NOT_FOUND);
    }
  }
}
