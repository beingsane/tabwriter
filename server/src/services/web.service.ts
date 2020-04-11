import fs from 'fs';
import { tabwriterConfig } from '../config/config';

export class WebService {
  public static getWebPagePath(): Promise<string | null> {
    return new Promise(resolve => {
      if (fs.existsSync(tabwriterConfig.clientDistEntryPath)) {
        resolve(tabwriterConfig.clientDistEntryPath);
      } else {
        resolve(null);
      }
    });
  }
}
