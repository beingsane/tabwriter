export class TabwriterServerConfig {
  public static readonly DEFAULT_SERVER_PORT = 3001;
  public static readonly PRODUCTION_ENVIRONMENT_NAME = 'production';

  public static getConfig(): TabwriterServerConfig {
    return new TabwriterServerConfig();
  }

  public clientDistEntryPath = './build/index.html';
  public clientDistFolderPath = './build';
  public isProduction = false;
  public serverPort = 3000;
}
