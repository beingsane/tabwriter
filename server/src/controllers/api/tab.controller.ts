import express, { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { BaseController } from '../base.controller';
import { TabWriterService, TabWriterInstructions } from '../../services/tabWriter.service';

export class TabController extends BaseController {
  public readonly routePrefix = 'tabs';
  public readonly router = express.Router({ mergeParams: true });

  constructor(childControllers?: BaseController[]) {
    super(childControllers);

    this.router.post('/', asyncHandler(this.createTab));
  }

  public async createTab(req: Request, res: Response): Promise<void> {
    const tabInstructions: TabWriterInstructions = req.body;
    const tabWriterBuildResult = TabWriterService.writeTab(tabInstructions);

    res.status(httpStatusCodes.OK).send(tabWriterBuildResult);
  }
}
