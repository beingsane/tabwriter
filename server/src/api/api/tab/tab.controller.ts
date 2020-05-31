import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { checkSchema } from 'express-validator';
import * as HttpStatus from 'http-status-codes';
import { BaseController } from '../../models/base.controller';
import { TabWriterService, TabWriterInstructions } from '../../../services/tabWriter.service';
import { validateInputs } from '../../middlewares/inputValidation.middleware';
import { tabCreationSchema } from './schemas/tabCreation.schema';

export class TabController extends BaseController {
  public readonly routePrefix = 'tabs';
  public readonly router = express.Router({ mergeParams: true });

  constructor(childControllers?: BaseController[]) {
    super(childControllers);

    this.router.post('/', validateInputs(checkSchema(tabCreationSchema)), asyncHandler(this.createTab));
  }

  public async createTab(req: Request, res: Response): Promise<void> {
    const tabInstructions: TabWriterInstructions = req.body;
    const tabWriterBuildResult = TabWriterService.writeTab(tabInstructions);

    res.status(HttpStatus.OK).send(tabWriterBuildResult);
  }
}
