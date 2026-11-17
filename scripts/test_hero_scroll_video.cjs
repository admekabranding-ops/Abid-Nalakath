const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\Digi2025\\.gemini\\antigravity\\brain\\d647c326-5812-4714-b760-a6eb4cb8995b';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://127.0.0.1:5173/';

async function runTest() {
  console.log('Starting Synchronized Hero & Rising Typography Automated Test...');
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
    mobile430: {}
  };

  // ==========================================
  // 1. DESKTOP TEST (1440 x 900)
  // ==========================================
  console.log('1. Testing Desktop 1440x900...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Check initial state (0% scroll)
  const initialDesktop = await page.evaluate(() => {
    const canvas = document.querySelector('section#home canvas');
    const hero = document.getElementById('home');
    const desktopUi = document.querySelector('#home .sticky > div.hidden.lg\\:flex');
    const marqueeSec = document.querySelector('#home #marquee');
    const marqueeContainer = marqueeSec ? marqueeSec.closest('.absolute.inset-x-0.bottom-0') : null;
    const h1 = desktopUi ? desktopUi.querySelector('h1') : null;
    return {
      canvasFound: !!canvas,
      heroTotalHeight: hero ? hero.offsetHeight : 0,
      headingText: h1 ? h1.innerText : '',
      desktopUiOpacity: desktopUi ? window.getComputedStyle(desktopUi).opacity : null,
      marqueeFound: !!marqueeSec,
      marqueeOpacity: marqueeContainer ? window.getComputedStyle(marqueeContainer).opacity : null,
      marqueeTransform: marqueeContainer ? window.getComputedStyle(marqueeContainer).transform : null
    };
  });
  results.desktop.initial = initialDesktop;
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_timeline_00_initial.png') });

  // Get Hero scroll track dimensions
  const heroDimensions = await page.evaluate(() => {
    const hero = document.getElementById('home');
    const rect = hero.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const scrollTrack = hero.offsetHeight - window.innerHeight;
    return { scrollTop, scrollTrack };
  });

  // Stage 1: 30% scroll (Timeline 20% - 45%)
  // Head begins lowering, hero UI fading, marquee starts rising
  console.log('Testing Desktop 30% scroll...');
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack * 0.30, behavior: 'instant' }), heroDimensions);
  await new Promise(r => setTimeout(r, 600));
  const stage1State = await page.evaluate(() => {
    const desktopUi = document.querySelector('#home .sticky > div.hidden.lg\\:flex');
    const marqueeSec = document.querySelector('#home #marquee');
    const marqueeContainer = marqueeSec ? marqueeSec.closest('.absolute.inset-x-0.bottom-0') : null;
    return {
      desktopUiOpacity: desktopUi ? window.getComputedStyle(desktopUi).opacity : null,
      marqueeOpacity: marqueeContainer ? window.getComputedStyle(marqueeContainer).opacity : null,
      marqueeTransform: marqueeContainer ? window.getComputedStyle(marqueeContainer).transform : null
    };
  });
  results.desktop.stage1_30 = stage1State;
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_timeline_30_rising.png') });

  // Stage 2: 55% scroll (Timeline 45% - 75%)
  // Head lowering further, marquee moving further upward, typography increasingly prominent
  console.log('Testing Desktop 55% scroll...');
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack * 0.55, behavior: 'instant' }), heroDimensions);
  await new Promise(r => setTimeout(r, 600));
  const stage2State = await page.evaluate(() => {
    const marqueeSec = document.querySelector('#home #marquee');
    const marqueeContainer = marqueeSec ? marqueeSec.closest('.absolute.inset-x-0.bottom-0') : null;
    return {
      marqueeOpacity: marqueeContainer ? window.getComputedStyle(marqueeContainer).opacity : null,
      marqueeTransform: marqueeContainer ? window.getComputedStyle(marqueeContainer).transform : null
    };
  });
  results.desktop.stage2_55 = stage2State;
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_timeline_55_prominent.png') });

  // Stage 3: 80% scroll (Timeline 75% - 100%)
  // Head reached Frame 65, frozen in lowered pose, marquee in main visible area with lowered head
  console.log('Testing Desktop 80% scroll (Frame 65 + Marquee)...');
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack * 0.80, behavior: 'instant' }), heroDimensions);
  await new Promise(r => setTimeout(r, 600));
  const stage3State = await page.evaluate(() => {
    const marqueeSec = document.querySelector('#home #marquee');
    const marqueeContainer = marqueeSec ? marqueeSec.closest('.absolute.inset-x-0.bottom-0') : null;
    return {
      marqueeOpacity: marqueeContainer ? window.getComputedStyle(marqueeContainer).opacity : null,
      marqueeTransform: marqueeContainer ? window.getComputedStyle(marqueeContainer).transform : null
    };
  });
  results.desktop.stage3_80 = stage3State;
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_timeline_80_frame65_marquee.png') });

  // Stage 4: 95% scroll (Verify Frame 65 Lock)
  console.log('Testing Desktop 95% scroll (Locked Frame 65)...');
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack * 0.95, behavior: 'instant' }), heroDimensions);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_timeline_95_locked.png') });

  // Stage 5: Scroll Past 100% (Transition directly into Services)
  console.log('Testing Desktop transition into Services section...');
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack + 200, behavior: 'instant' }), heroDimensions);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_transition_to_services.png') });

  // Reverse Scroll back to Top
  console.log('Testing Desktop reverse scroll to 0%...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_desktop_reversed_to_top.png') });

  // ==========================================
  // 2. MOBILE TEST: 390 x 844 (iPhone 14 / 15)
  // ==========================================
  console.log('2. Testing Mobile 390x844...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Initial mobile Frame 0
  const mobileInitial = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    windowWidth: window.innerWidth,
    hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
  }));
  results.mobile390.initial = mobileInitial;
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_timeline_00_initial.png') });

  const mobileHeroDims = await page.evaluate(() => {
    const hero = document.getElementById('home');
    const rect = hero.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const scrollTrack = hero.offsetHeight - window.innerHeight;
    return { scrollTop, scrollTrack };
  });

  // Mobile 35% scroll (Rising Marquee)
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack * 0.35, behavior: 'instant' }), mobileHeroDims);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_timeline_35_rising.png') });

  // Mobile 75% scroll (Frame 65 + Marquee prominent)
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack * 0.78, behavior: 'instant' }), mobileHeroDims);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_timeline_78_frame65_marquee.png') });

  // Mobile Transition into Services
  await page.evaluate((pos) => window.scrollTo({ top: pos.scrollTop + pos.scrollTrack + 150, behavior: 'instant' }), mobileHeroDims);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_transition_to_services.png') });

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
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_375_layout.png') });

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
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_430_layout.png') });

  await browser.close();
  console.log('All synchronized tests completed successfully!');
  console.log(JSON.stringify(results, null, 2));
}

runTest().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
