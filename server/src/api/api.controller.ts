import { Request, Response } from 'express';
import { BaseController } from './models/base.controller';
import { ResponseErrorResourceNotFound } from './models/responses/responseErrorResourceNotFound.model';

export class ApiController extends BaseController {
  public readonly routePrefix = 'api';

  constructor(childControllers?: BaseController[]) {
    super(childControllers);

    this.router.all('*', this.resourceNotFound);
  }

  public resourceNotFound(req: Request, res: Response): void {
    const response = new ResponseErrorResourceNotFound(req.originalUrl);
    res.status(response.status).json(response);
  }
}
