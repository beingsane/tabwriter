import fs from 'fs';
import { tabwriterConfig } from '../../config/config';

export class WebService {
  private static index: Buffer;
  private static isIndexLoaded = false;

  public static async getIndex(): Promise<Buffer> {
    if (!WebService.isIndexLoaded) await this.loadIndex();

    return WebService.index;
  }

  private static async loadIndex(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(tabwriterConfig.clientDistEntryPath)) {
        WebService.index = fs.readFileSync(tabwriterConfig.clientDistEntryPath);
        WebService.isIndexLoaded = true;
        resolve();
      } else {
        WebService.isIndexLoaded = false;
        reject(new Error('Index page not found'));
      }
    });
  }
}
