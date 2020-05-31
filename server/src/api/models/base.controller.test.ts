import { BaseController } from './base.controller';

class TestController extends BaseController {
  public routePrefix = 'test/prefix';
}

class TestChildController extends BaseController {
  public routePrefix = 'child/prefix';
}

describe(`[${BaseController.name}]`, () => {
  it('should instantiate a controller without child controllers', () => {
    const controller = new TestController();

    expect(controller.router).toBeDefined();
  });

  it('should set up the given child controllers on the controller router', () => {
    const childController = new TestChildController();
    const parentController = new TestController([childController]);

    expect(parentController.router.stack[0].regexp.toString()).toContain(
      childController.routePrefix.replace('/', '\\/'),
    );
  });
});
