const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\Digi2025\\.gemini\\antigravity\\brain\\d647c326-5812-4714-b760-a6eb4cb8995b';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://127.0.0.1:5173/';

async function run() {
  console.log('Launching Edge for verification...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Helper to check horizontal overflow
  const checkOverflow = async () => {
    return await page.evaluate(() => {
      return {
        windowWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
      };
    });
  };

  const results = {
    viewports: {},
    servicesScroll: {},
    desktop: {}
  };

  // 1. Mobile 375px (iPhone SE)
  console.log('Testing Mobile 375px...');
  await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  const hero375 = await page.evaluate(() => {
    const mobileBg = document.querySelector('section#home img[alt*="Abid Nalakath"]');
    const heading = document.querySelector('section#home h1');
    const cta = document.querySelector('section#home a[href*="#projects"]');
    const bgRect = mobileBg ? mobileBg.getBoundingClientRect() : null;
    const headingRect = heading ? heading.getBoundingClientRect() : null;
    const ctaRect = cta ? cta.getBoundingClientRect() : null;
    return {
      bgFound: !!mobileBg,
      bgClasses: mobileBg ? mobileBg.className : '',
      bgRect,
      headingRect,
      ctaRect,
      isUnboxed: !document.querySelector('section#home .aspect-\\[4\\/3\\]')
    };
  });
  results.viewports['375'] = { ...hero375, ...(await checkOverflow()) };
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_hero_mobile_375.png') });

  // 2. Mobile 390px (iPhone 12/13/14)
  console.log('Testing Mobile 390px...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  results.viewports['390'] = await checkOverflow();
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_hero_mobile_390.png') });

  // 3. Mobile 430px (iPhone 14/15/16 Pro Max)
  console.log('Testing Mobile 430px...');
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  results.viewports['430'] = await checkOverflow();
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_hero_mobile_430.png') });

  // 4. Test Mobile Services Section Scrolling (at 390px)
  console.log('Testing Mobile Services Section touch scrolling...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(URL + '#services', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Find services section and scroll track
  const servicesInfo = await page.evaluate(async () => {
    const sec = document.getElementById('services');
    if (!sec) return { error: 'No #services found' };
    const rect = sec.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const totalHeight = sec.offsetHeight;
    return {
      scrollTop,
      totalHeight,
      viewportHeight: window.innerHeight
    };
  });

  const stepCount = 6;
  const scrollSteps = [];

  for (let i = 0; i < stepCount; i++) {
    // Scroll to position corresponding to service i
    const targetY = servicesInfo.scrollTop + (i / (stepCount - 0.5)) * (servicesInfo.totalHeight - servicesInfo.viewportHeight);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), targetY);
    await new Promise(r => setTimeout(r, 600));

    const state = await page.evaluate(() => {
      const activeHeaderBadge = document.querySelector('header span[class*="text-[#FF9D00]"]');
      const activeCenterBadge = document.querySelector('section#services span[class*="text-[#FF9D00]"]');
      const h3 = document.querySelector('section#services div.lg\\:hidden h3');
      const activeTitle = h3 ? h3.innerText.replace(/\n/g, ' ') : '';
      const bgImages = Array.from(document.querySelectorAll('section#services img, section#services video')).map(el => {
        const parent = el.closest('div.transition-opacity');
        return parent ? parent.className.includes('opacity-100') : false;
      });
      return {
        badgeText: activeHeaderBadge ? activeHeaderBadge.innerText : '',
        activeTitle,
        activeBgIndex: bgImages.indexOf(true)
      };
    });

    scrollSteps.push({ step: i, ...state });

    if (i === 0) {
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_services_mobile_01.png') });
    } else if (i === 2) {
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_services_mobile_03.png') });
    } else if (i === 5) {
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_services_mobile_06.png') });
    }
  }
  results.servicesScroll = scrollSteps;

  // 5. Test Desktop 1440px
  console.log('Testing Desktop 1440px...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  const desktopHeroState = await page.evaluate(() => {
    const desktopGrid = document.querySelector('div.lg\\:flex');
    const portrait = document.querySelector('section#home div.lg\\:flex img[alt*="Abid Nalakath"]');
    const h1 = document.querySelector('section#home div.lg\\:flex h1');
    const servicesRightCol = document.querySelector('section#home div.lg\\:flex div.w-80, section#home div.lg\\:flex div.w-88');
    return {
      desktopVisible: !!desktopGrid && window.getComputedStyle(desktopGrid).display !== 'none',
      portraitVisible: !!portrait,
      headingText: h1 ? h1.innerText : '',
      has3Columns: !!desktopGrid
    };
  });
  results.desktop.hero = desktopHeroState;
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_desktop_hero_1440.png') });

  // Scroll to Desktop Services
  await page.evaluate(() => {
    const sec = document.getElementById('services');
    if (sec) sec.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));

  const desktopServicesState = await page.evaluate(() => {
    const centerCircle = document.querySelector('section#services div.hidden.lg\\:flex div.rounded-full');
    const topBar = document.querySelector('section#services header.hidden.lg\\:flex');
    const orbitSvg = document.querySelector('section#services svg animate, section#services svg textPath');
    return {
      centerCircleFound: !!centerCircle,
      topBarFound: !!topBar,
      orbitSvgFound: !!orbitSvg
    };
  });
  results.desktop.services = desktopServicesState;
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_desktop_services_1440.png') });

  await browser.close();
  console.log('Verification completed successfully!');
  console.log(JSON.stringify(results, null, 2));
}

run().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
