import path from 'path';
import { TabwriterConfig } from './config';

const EXPECTED_CLIENT_DIST_FOLDER_PATH = '../../../client/build';

describe(`[${TabwriterConfig.name}]`, () => {
  const INITIAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...INITIAL_ENV };
  });

  it('should set up property clientDistFolderPath properly', () => {
    const config = new TabwriterConfig();

    const expectedPath = path.join(__dirname, EXPECTED_CLIENT_DIST_FOLDER_PATH);

    expect(config.clientDistFolderPath).toBe(expectedPath);
  });

  it('should set up property clientDistEntryPath properly', () => {
    const config = new TabwriterConfig();

    const expectedEntryPath = path.join(
      __dirname,
      EXPECTED_CLIENT_DIST_FOLDER_PATH,
      '/index.html'
    );

    expect(config.clientDistEntryPath).toBe(expectedEntryPath);
  });

  it('should set up property serverPort to environment variable TABWRITER_SERVER_PORT when available', () => {
    const expectedPort = 9876;

    process.env.TABWRITER_SERVER_PORT = expectedPort.toString();
    const config = new TabwriterConfig();

    expect(config.serverPort).toBe(expectedPort);
  });

  it('should set up property serverPort to default port when environment varibale TABWRITER_SERVER_PORT is not available', () => {
    if (process.env.TABWRITER_SERVER_PORT) {
      delete process.env.TABWRITER_SERVER_PORT;
    }

    const config = new TabwriterConfig();

    expect(config.serverPort).toBe(TabwriterConfig.DEFAULT_SERVER_PORT);
  });

  it('should set up property isProduction to true when TABWRITER_PRODUCTION environment variable is 1', () => {
    process.env.TABWRITER_PRODUCTION = '1';

    const config = new TabwriterConfig();

    expect(config.isProduction).toBe(true);
  });

  it('should set up property isProduction to false when TABWRITER_PRODUCTION environment variable is not 1', () => {
    process.env.TABWRITER_PRODUCTION = '0';

    const config = new TabwriterConfig();

    expect(config.isProduction).toBe(false);
  });
});
