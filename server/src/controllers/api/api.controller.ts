import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { BaseController } from '../base.controller';

export class ApiController extends BaseController {
  public readonly routePrefix = 'api';

  constructor(childControllers?: BaseController[]) {
    super(childControllers);

    this.router.all('*', this.resourceNotFound);
  }

  public resourceNotFound(req: Request, res: Response): void {
    res.status(httpStatusCodes.NOT_FOUND).send({
      message: 'The requested resource was not found',
      requestedResource: req.originalUrl,
    });
  }
}
