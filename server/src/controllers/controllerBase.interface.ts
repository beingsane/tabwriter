import { Router } from 'express';

export interface ControllerBase {
  routePrefix: string;
  router: Router;
}
