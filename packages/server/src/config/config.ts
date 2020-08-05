import path from 'path';

export class TabwriterServerConfig {
  public static readonly DEFAULT_SERVER_PORT = 3001;
  public static readonly PRODUCTION_ENVIRONMENT_NAME = 'production';

  private static tabwriterServerConfig: TabwriterServerConfig;

  public static getConfig(): TabwriterServerConfig {
    if (!TabwriterServerConfig.tabwriterServerConfig) {
      TabwriterServerConfig.tabwriterServerConfig = new TabwriterServerConfig();
    }

    return TabwriterServerConfig.tabwriterServerConfig;
  }

  public clientDistEntryPath: string;
  public clientDistFolderPath: string;
  public isProduction: boolean;
  public serverPort: number;

  private constructor() {
    this.clientDistEntryPath = this.readClientEntryPath();
    this.clientDistFolderPath = this.readClientDistPath();
    this.serverPort = this.readServerPort();

    this.isProduction =
      process.env.NODE_ENV ===
      TabwriterServerConfig.PRODUCTION_ENVIRONMENT_NAME;
  }

  private readClientEntryPath(): string {
    const clientDistEntryPath = process.env.TABWRITER_CLIENT_ENTRY_FILE_PATH;
    if (!clientDistEntryPath) {
      throw Error(
        `[TabwriterServerConfig] unable to read client entry path from environment variable TABWRITER_CLIENT_ENTRY_FILE_PATH`
      );
    }

    return path.resolve(clientDistEntryPath);
  }

  private readClientDistPath(): string {
    const clientDistFolderPath = process.env.TABWRITER_CLIENT_DIST_PATH;
    if (!clientDistFolderPath) {
      throw Error(
        `[TabwriterServerConfig] unable to read client distribution folder path from environment variable TABWRITER_CLIENT_DIST_PATH`
      );
    }

    return path.resolve(clientDistFolderPath);
  }

  private readServerPort(): number {
    const envServerPort = process.env.TABWRITER_SERVER_PORT;
    const serverPort = envServerPort
      ? parseInt(envServerPort, 10)
      : TabwriterServerConfig.DEFAULT_SERVER_PORT;

    return serverPort;
  }
}
