import { Router } from 'express';

export abstract class BaseController {
  public abstract routePrefix: string;
  public router = Router();

  constructor(childControllers?: BaseController[]) {
    childControllers?.forEach((childController) => {
      this.router.use(
        `/${childController.routePrefix}`,
        childController.router
      );
    });
  }
}
