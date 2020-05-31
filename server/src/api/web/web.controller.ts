import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { BaseController } from '../models/base.controller';
import { WebService } from './web.service';

export class WebController extends BaseController {
  public readonly routePrefix = '*';

  constructor(childControllers?: BaseController[]) {
    super(childControllers);

    this.router.all('*', asyncHandler(this.sendWebIndex));
  }

  public async sendWebIndex(_req: Request, res: Response): Promise<void> {
    const webIndex = await WebService.getIndex();

    res.type('html').send(webIndex);
  }
}
