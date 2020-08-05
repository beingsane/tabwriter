import fs from 'fs';
import { WebService } from './web.service';
import { TabwriterServerConfig } from '../../config/config';
jest.mock('../../config/config.ts');

const INDEX_TEST_BUUFER = Buffer.from('test');

beforeEach(() => jest.restoreAllMocks());

describe(`[${WebService.name}]`, () => {
  describe('[getIndex]', () => {
    it('should throw if the client index page is not found', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      return expect(WebService.getIndex()).rejects.toBeInstanceOf(Error);
    });

    it('should return the client index if found', async () => {
      const fsExistsSyncSpy = jest
        .spyOn(fs, 'existsSync')
        .mockReturnValue(true);
      const fsReadFileSpy = jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(INDEX_TEST_BUUFER);

      const webPagePath = await WebService.getIndex();
      const config = TabwriterServerConfig.getConfig();

      expect(fsExistsSyncSpy).toHaveBeenCalled();
      expect(fsReadFileSpy).toHaveBeenCalledWith(config.clientDistEntryPath);
      expect(webPagePath).toBe(INDEX_TEST_BUUFER);
    });

    it('should return the stored client index if already loaded', async () => {
      const fsExistsSyncSpy = jest.spyOn(fs, 'existsSync');
      const fsReadFileSpy = jest.spyOn(fs, 'readFileSync');

      const webPagePath = await WebService.getIndex();

      expect(fsExistsSyncSpy).not.toHaveBeenCalled();
      expect(fsReadFileSpy).not.toHaveBeenCalled();
      expect(webPagePath).toBe(INDEX_TEST_BUUFER);
    });
  });
});
