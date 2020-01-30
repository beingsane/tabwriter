import fs from 'fs';
import { tabwriterConfig } from '../config';

export class WebService {
  public static getWebPagePath(): string | null {
    if (fs.existsSync(tabwriterConfig.clientDistEntryPath)) {
      return tabwriterConfig.clientDistEntryPath;
    } else {
      return null;
    }
  }
}
