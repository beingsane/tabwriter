import fs from 'fs';
import { WebService } from './web.service';
import { tabwriterConfig } from '../config';

describe(`[${WebService.name}]`, () => {
  describe(`[${WebService.getWebPagePath.name}]`, () => {
    it('should return the client index path if found', async () => {
      const expectedPath = '/test';
      tabwriterConfig.clientDistEntryPath = expectedPath;
      fs.existsSync = jest.fn().mockReturnValue(true);

      const webPagePath = await WebService.getWebPagePath();

      expect(fs.existsSync).toHaveBeenCalled();
      expect(webPagePath).toBe(expectedPath);
    });

    it('should return null if client index is not found', async () => {
      fs.existsSync = jest.fn().mockReturnValue(false);

      const webPagePath = await WebService.getWebPagePath();

      expect(fs.existsSync).toHaveBeenCalled();
      expect(webPagePath).toBe(null);
    });
  });
});
