import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';

let browserPromise: Promise<Browser> | null = null;

async function launchBrowser(): Promise<Browser> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  browser.on('disconnected', () => {
    browserPromise = null;
  });
  return browser;
}

/** Réutilise une instance Chromium (évite launch/close à chaque PDF). */
export async function getSharedBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = launchBrowser().catch((err) => {
      browserPromise = null;
      throw err;
    });
  }
  return browserPromise;
}

export async function closeSharedBrowser(): Promise<void> {
  if (!browserPromise) return;
  try {
    const browser = await browserPromise;
    await browser.close();
  } catch {
    /* ignore */
  } finally {
    browserPromise = null;
  }
}
