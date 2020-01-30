import request from 'supertest';
import { ApiController } from './../../controllers/api.controller';
import { TabwriterServer } from './../../server';

describe('api', () => {
  it('[get] /api should return OK', async () => {
    const app = new TabwriterServer({
      controllers: [new ApiController()],
    });

    const res = await request(app.server).get('/api');

    expect(res.status).toBe(200);
  });
});
