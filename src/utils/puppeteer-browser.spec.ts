const launch = jest.fn();

jest.mock('puppeteer', () => ({
  __esModule: true,
  default: {
    launch: (...args: unknown[]) => launch(...args),
  },
}));

import {
  closeSharedBrowser,
  getSharedBrowser,
} from './puppeteer-browser';

describe('puppeteer-browser', () => {
  const previousExecutablePath = process.env.PUPPETEER_EXECUTABLE_PATH;

  beforeEach(() => {
    launch.mockReset();
    delete process.env.PUPPETEER_EXECUTABLE_PATH;
    launch.mockResolvedValue({
      on: jest.fn(),
      close: jest.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(async () => {
    await closeSharedBrowser();
    if (previousExecutablePath === undefined) {
      delete process.env.PUPPETEER_EXECUTABLE_PATH;
    } else {
      process.env.PUPPETEER_EXECUTABLE_PATH = previousExecutablePath;
    }
  });

  it('lance Chromium headless avec les args sandbox Docker', async () => {
    await getSharedBrowser();

    expect(launch).toHaveBeenCalledWith({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
  });

  it('utilise PUPPETEER_EXECUTABLE_PATH quand defini', async () => {
    process.env.PUPPETEER_EXECUTABLE_PATH = '/usr/bin/chromium';

    await getSharedBrowser();

    expect(launch).toHaveBeenCalledWith(
      expect.objectContaining({
        executablePath: '/usr/bin/chromium',
      }),
    );
  });

  it('reutilise la meme instance browser', async () => {
    const first = await getSharedBrowser();
    const second = await getSharedBrowser();

    expect(first).toBe(second);
    expect(launch).toHaveBeenCalledTimes(1);
  });
});
