const puppeteer = require('puppeteer-core');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\Digi2025\\.gemini\\antigravity\\brain\\d647c326-5812-4714-b760-a6eb4cb8995b';

async function testMobileScroll() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });

  // Update section to overflow: visible
  await page.evaluate(() => {
    const sec = document.getElementById('services');
    if (sec) {
      sec.style.overflow = 'visible';
      sec.style.overflowX = 'visible';
    }
  });

  // Test jumping to all 6 services using button clicks
  for (let i = 0; i < 6; i++) {
    await page.evaluate((idx) => {
      const sec = document.getElementById('services');
      const buttons = sec.querySelectorAll('header button');
      if (buttons[idx]) buttons[idx].click();
    }, i);
    await new Promise(r => setTimeout(r, 800));

    const state = await page.evaluate(() => {
      const sec = document.getElementById('services');
      const h3 = sec.querySelector('h3');
      const circle = sec.querySelector('div[class*="rounded-full"][class*="aspect-square"]');
      const rect = circle ? circle.getBoundingClientRect() : null;
      return {
        title: h3 ? h3.innerText.replace(/\n/g, ' ') : '',
        circleRect: rect ? { top: Math.round(rect.top), height: Math.round(rect.height), inView: rect.top >= 0 && rect.bottom <= window.innerHeight } : null
      };
    });
    console.log(`Service 0${i + 1}:`, state);
    await page.screenshot({ path: `${ARTIFACT_DIR}\\verified_services_mobile_0${i + 1}.png` });
  }

  await browser.close();
}

testMobileScroll().catch(console.error);
