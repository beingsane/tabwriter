/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';

interface TesteEnv {
  TABWRITER_SERVER_PORT: number;
  TABWRITER_CLIENT_DIST_PATH: string;
  TABWRITER_CLIENT_ENTRY_FILE_PATH: string;
}

const setupTestEnv = (): TesteEnv => {
  const TABWRITER_SERVER_PORT = 1234;
  const TABWRITER_CLIENT_DIST_PATH = './test/client/dist/folder';
  const TABWRITER_CLIENT_ENTRY_FILE_PATH =
    './test/client/dist/folder/index.html';

  process.env.TABWRITER_SERVER_PORT = TABWRITER_SERVER_PORT.toString();
  process.env.TABWRITER_CLIENT_DIST_PATH = TABWRITER_CLIENT_DIST_PATH;
  process.env.TABWRITER_CLIENT_ENTRY_FILE_PATH = TABWRITER_CLIENT_ENTRY_FILE_PATH;

  return {
    TABWRITER_SERVER_PORT,
    TABWRITER_CLIENT_DIST_PATH,
    TABWRITER_CLIENT_ENTRY_FILE_PATH,
  };
};

describe('[tabwriterServerConfig]', () => {
  const INITIAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...INITIAL_ENV };
    jest.resetModules();
  });

  it('should set up property clientDistFolderPath properly', () => {
    const { TabwriterServerConfig } = require('./config');

    const { TABWRITER_CLIENT_DIST_PATH: clientDistFolderPath } = setupTestEnv();
    const expectedResolvedPath = path.resolve(clientDistFolderPath);

    const config = TabwriterServerConfig.getConfig();

    expect(config.clientDistFolderPath).toBe(expectedResolvedPath);
  });

  it('should throw if environment variable TABWRITER_CLIENT_DIST_PATH is not set', () => {
    const { TabwriterServerConfig } = require('./config');

    setupTestEnv();
    delete process.env.TABWRITER_CLIENT_DIST_PATH;

    expect(() => TabwriterServerConfig.getConfig()).toThrow();
  });

  it('should set up property clientDistEntryPath properly', () => {
    const { TabwriterServerConfig } = require('./config');

    const {
      TABWRITER_CLIENT_ENTRY_FILE_PATH: clientDistEntryPath,
    } = setupTestEnv();
    const expectedResolvedPath = path.resolve(clientDistEntryPath);

    const config = TabwriterServerConfig.getConfig();

    expect(config.clientDistEntryPath).toBe(expectedResolvedPath);
  });

  it('should throw if environment variable TABWRITER_CLIENT_ENTRY_FILE_PATH is not set', () => {
    const { TabwriterServerConfig } = require('./config');

    setupTestEnv();
    delete process.env.TABWRITER_CLIENT_ENTRY_FILE_PATH;

    expect(() => TabwriterServerConfig.getConfig()).toThrow();
  });

  it('should set up property serverPort to environment variable TABWRITER_SERVER_PORT when available', () => {
    const { TabwriterServerConfig } = require('./config');

    const { TABWRITER_SERVER_PORT: expectedServerPort } = setupTestEnv();

    const config = TabwriterServerConfig.getConfig();

    expect(config.serverPort).toBe(expectedServerPort);
  });

  it('should set up property serverPort to default port when environment varibale TABWRITER_SERVER_PORT is not available', () => {
    const { TabwriterServerConfig } = require('./config');

    setupTestEnv();
    delete process.env.TABWRITER_SERVER_PORT;

    const config = TabwriterServerConfig.getConfig();

    expect(config.serverPort).toBe(TabwriterServerConfig.DEFAULT_SERVER_PORT);
  });

  it('should set up property isProduction to true when NODE_ENV environment variable is production', () => {
    const { TabwriterServerConfig } = require('./config');

    setupTestEnv();
    process.env.NODE_ENV = TabwriterServerConfig.PRODUCTION_ENVIRONMENT_NAME;

    const config = TabwriterServerConfig.getConfig();

    expect(config.isProduction).toBe(true);
  });

  it('should set up property isProduction to false when NODE_ENV environment variable is not production', () => {
    const { TabwriterServerConfig } = require('./config');

    setupTestEnv();
    process.env.NODE_ENV = 'development';

    const config = TabwriterServerConfig.getConfig();

    expect(config.isProduction).toBe(false);
  });

  it('should configuration from cache after loaded', () => {
    const { TabwriterServerConfig } = require('./config');

    setupTestEnv();
    const oldConfig = TabwriterServerConfig.getConfig();

    delete process.env.TABWRITER_SERVER_PORT;
    delete process.env.TABWRITER_CLIENT_DIST_PATH;
    delete process.env.TABWRITER_CLIENT_ENTRY_FILE_PATH;
    const newConfig = TabwriterServerConfig.getConfig();

    expect(newConfig).toBe(oldConfig);
  });
});
