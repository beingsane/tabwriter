import path from 'path';

export class TabwriterConfig {
  public static readonly DEFAULT_SERVER_PORT = 3001;

  public serverPort: number;
  public isProduction: boolean;
  public clientDistFolderPath: string;
  public clientDistEntryPath: string;

  constructor() {
    this.clientDistFolderPath = path.join(__dirname, '../../../client/build');
    this.clientDistEntryPath = path.join(
      this.clientDistFolderPath,
      '/index.html'
    );

    this.serverPort = process.env.TABWRITER_SERVER_PORT
      ? parseInt(process.env.TABWRITER_SERVER_PORT, 10)
      : TabwriterConfig.DEFAULT_SERVER_PORT;

    this.isProduction = process.env.TABWRITER_PRODUCTION === '1';
  }
}

export const tabwriterConfig = new TabwriterConfig();
