import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if(m.type() === 'error' && !m.text().includes('net::ERR')) errors.push(m.text()); });
try {
  const response = await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('video, iframe').count(), 0, 'Videos must not load before interaction');
  await fs.mkdir('docs/screenshots', { recursive: true });
  for (let y=0; y < await page.evaluate(() => document.body.scrollHeight); y+=700) { await page.evaluate(y => window.scrollTo(0,y), y); await page.waitForTimeout(80); }
  await page.evaluate(() => window.scrollTo(0,0));
  await page.screenshot({ path: 'docs/screenshots/desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Family animation', exact: true }).click();
  assert.equal(await page.locator('.gallery-card').count(), 3);
  await page.getByRole('button', { name: 'Comic stories', exact: true }).click();
  assert.equal(await page.locator('.gallery-card').count(), 1);
  await page.getByRole('button', { name: 'All creations', exact: true }).click();
  await page.locator('summary').first().click();
  assert.equal(await page.locator('details[open]').count(), 1);
  await page.getByRole('tab', { name: 'Comic sample', exact: true }).click();
  await page.locator('#demo-panel .play-button').click();
  await page.locator('#demo-panel video').evaluate(v => new Promise((resolve, reject) => { if (v.readyState >= 1) return resolve(); v.addEventListener('loadedmetadata', resolve, {once:true}); v.addEventListener('error', () => reject(new Error('Sample playback failed')), {once:true}); setTimeout(() => reject(new Error('Sample loading timed out')), 15000); }));
  assert.equal(await page.locator('#demo-panel video').getAttribute('controls'), '');
  await page.getByRole('tab', { name: 'App walkthrough', exact: true }).click();
  await page.getByRole('button', { name: 'Play official walkthrough' }).click();
  assert.match(await page.locator('#demo-panel iframe').getAttribute('src'), /1232486302/);
  for (const a of await page.locator('a[rel*="sponsored"]').all()) { assert.equal(await a.getAttribute('target'), '_blank'); assert.match(await a.getAttribute('rel'), /noopener/); assert.match(await a.getAttribute('href'), /^https:\/\//); }
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `Overflow at ${width}px`);
    if (width === 390) { for (let y=0; y < await page.evaluate(() => document.body.scrollHeight); y+=700) { await page.evaluate(y => window.scrollTo(0,y), y); await page.waitForTimeout(80); } await page.evaluate(() => window.scrollTo(0,0)); await page.screenshot({ path: 'docs/screenshots/mobile.png', fullPage: true }); }
  }
  for (const route of ['/privacy', '/disclaimer']) { assert.equal((await page.goto(`http://localhost:3000${route}`)).status(), 200); }
  assert.deepEqual(errors, []);
  console.log('PASS: desktop/mobile layout, lazy media, actual video metadata, gallery filters, demo controls, FAQ, affiliate links, and legal routes.');
} finally { await browser.close(); }
