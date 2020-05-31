import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { checkSchema } from 'express-validator';
import * as HttpStatus from 'http-status-codes';
import { BaseController } from '../../models/base.controller';
import { TabWriterService, TabWriterInstructions } from '../../../services/tabWriter.service';
import { validateInputs } from '../../middlewares/inputValidation.middleware';
import { tabCreationSchema } from './schemas/tabCreation.schema';
import { ResponseErrorInvalidInstruction } from './models/responseErrorInvalidInstruction.model';
import { ResponseErrorInvalidInstructions } from './models/responseErrorInvalidInstructions.model';

export class TabController extends BaseController {
  public readonly routePrefix = 'tabs';
  public readonly router = express.Router({ mergeParams: true });

  constructor(childControllers?: BaseController[]) {
    super(childControllers);

    this.router.post('/', validateInputs(checkSchema(tabCreationSchema)), asyncHandler(this.createTab));
  }

  public async createTab(req: Request, res: Response): Promise<void> {
    const tabInstructions = req.body as TabWriterInstructions;
    const tabWriterBuildResult = await TabWriterService.writeTab(tabInstructions);

    if (tabWriterBuildResult.success) {
      res.status(HttpStatus.OK).send(tabWriterBuildResult.tab);
    } else {
      const failedInstructionsResponseErrors = tabWriterBuildResult.instructionsResults
        .filter((instructionResult) => !instructionResult.success)
        .map((failedInstructionResult) => new ResponseErrorInvalidInstruction(failedInstructionResult));

      const response = new ResponseErrorInvalidInstructions(failedInstructionsResponseErrors);
      res.status(response.status).json(response);
    }
  }
}
