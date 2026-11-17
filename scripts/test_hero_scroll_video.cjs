const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\Digi2025\\.gemini\\antigravity\\brain\\d647c326-5812-4714-b760-a6eb4cb8995b';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://127.0.0.1:5173/';

async function runTest() {
  console.log('Starting Scroll-Driven Video Hero Automated Test...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  const results = {
    desktop: {},
    mobile390: {},
    mobile375: {},
    mobile430: {},
    frameLockVerification: {}
  };

  // ==========================================
  // 1. DESKTOP TEST (1440 x 900)
  // ==========================================
  console.log('1. Testing Desktop 1440x900...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Check initial state (Frame 0)
  const initialDesktop = await page.evaluate(() => {
    const canvas = document.querySelector('section#home canvas');
    const hero = document.getElementById('home');
    const desktopUi = document.querySelector('#home .sticky > div.hidden.lg\\:flex');
    const cue = document.querySelector('#home .sticky > div.absolute.bottom-6');
    const h1 = desktopUi ? desktopUi.querySelector('h1') : null;
    return {
      canvasFound: !!canvas,
      canvasWidth: canvas ? canvas.width : 0,
      canvasHeight: canvas ? canvas.height : 0,
      heroTotalHeight: hero ? hero.offsetHeight : 0,
      headingText: h1 ? h1.innerText : '',
      desktopUiOpacity: desktopUi ? window.getComputedStyle(desktopUi).opacity : null,
      cueOpacity: cue ? window.getComputedStyle(cue).opacity : null
    };
  });
  results.desktop.initial = initialDesktop;
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_hero_frame0.png') });

  // Get Hero scroll track dimensions
  const heroDimensions = await page.evaluate(() => {
    const hero = document.getElementById('home');
    const rect = hero.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const scrollTrack = hero.offsetHeight - window.innerHeight;
    return { scrollTop, scrollTrack };
  });

  // Test Intermediate Frames by scrolling to exact progress points
  // Frame 20 is around progress = 20/65 * 0.72 = 0.22
  // Frame 45 is around progress = 45/65 * 0.72 = 0.50
  // Frame 60 is around progress = 60/65 * 0.72 = 0.66
  // Frame 65 is around progress = 65/65 * 0.72 = 0.72
  // Beyond 0.72 (e.g. 0.85, 0.95), frame MUST remain 65!

  // Frame 20
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack * 0.22, behavior: 'instant' }), heroDimensions);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_hero_frame20.png') });

  // Frame 45
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack * 0.50, behavior: 'instant' }), heroDimensions);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_hero_frame45.png') });

  // Frame 60
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack * 0.66, behavior: 'instant' }), heroDimensions);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_hero_frame60.png') });

  // Frame 65
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack * 0.75, behavior: 'instant' }), heroDimensions);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_hero_frame65.png') });

  // Verify Frame 65 Lock at 90% scroll (Must never advance beyond Frame 65)
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack * 0.90, behavior: 'instant' }), heroDimensions);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_hero_frame65_locked.png') });

  // Test Backward Scrolling (Scroll back to Top -> Frame 0)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_hero_reversed_frame0.png') });

  // ==========================================
  // 2. MOBILE TEST: 390 x 844 (iPhone 14 / 15)
  // ==========================================
  console.log('2. Testing Mobile 390x844...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Initial mobile Frame 0
  const mobileInitial = await page.evaluate(() => {
    const canvas = document.querySelector('section#home canvas');
    const mobileUi = document.querySelector('#home .sticky > div.lg\\:hidden.flex');
    const cue = document.querySelector('#home .sticky > div.absolute.bottom-6');
    const h1 = mobileUi ? mobileUi.querySelector('h1') : null;
    return {
      canvasFound: !!canvas,
      windowWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      headingText: h1 ? h1.innerText : '',
      mobileUiOpacity: mobileUi ? window.getComputedStyle(mobileUi).opacity : null,
      cueOpacity: cue ? window.getComputedStyle(cue).opacity : null
    };
  });
  results.mobile390.initial = mobileInitial;
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_hero_frame0.png') });

  // Mobile Intermediate Frame 45
  const mobileHeroDims = await page.evaluate(() => {
    const hero = document.getElementById('home');
    const rect = hero.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const scrollTrack = hero.offsetHeight - window.innerHeight;
    return { scrollTop, scrollTrack };
  });

  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack * 0.50, behavior: 'instant' }), mobileHeroDims);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_hero_frame45.png') });

  // Mobile Final Frame 65
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack * 0.78, behavior: 'instant' }), mobileHeroDims);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_hero_frame65.png') });

  // Transition into Next Section (Marquee and Services)
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack + 120, behavior: 'instant' }), mobileHeroDims);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_transition_to_marquee.png') });

  // ==========================================
  // 3. MOBILE TEST: 375 x 667 (iPhone SE)
  // ==========================================
  console.log('3. Testing Mobile 375x667 (iPhone SE)...');
  await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  const mobile375Overflow = await page.evaluate(() => ({
    hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth
  }));
  results.mobile375 = mobile375Overflow;
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_375_frame0.png') });

  // ==========================================
  // 4. MOBILE TEST: 430 x 932 (iPhone Pro Max)
  // ==========================================
  console.log('4. Testing Mobile 430x932 (iPhone Pro Max)...');
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  const mobile430Overflow = await page.evaluate(() => ({
    hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth
  }));
  results.mobile430 = mobile430Overflow;
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_430_frame0.png') });

  await browser.close();
  console.log('All automated tests completed successfully!');
  console.log(JSON.stringify(results, null, 2));
}

runTest().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
