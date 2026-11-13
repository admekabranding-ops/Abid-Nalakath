const puppeteer = require('puppeteer-core');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\Digi2025\\.gemini\\antigravity\\brain\\d647c326-5812-4714-b760-a6eb4cb8995b';

async function testPositions() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });

  const configs = [
    { name: 'pos_35_30', x: '35%', y: '30%' },
    { name: 'pos_38_30', x: '38%', y: '30%' },
    { name: 'pos_40_35', x: '40%', y: '35%' },
    { name: 'pos_42_35', x: '42%', y: '35%' },
    { name: 'pos_45_30', x: '45%', y: '30%' },
    { name: 'pos_48_25', x: '48%', y: '25%' }
  ];

  for (const c of configs) {
    await page.evaluate((pos) => {
      const img = document.querySelector('section#home img[alt*="Abid Nalakath"]');
      if (img) {
        img.style.objectPosition = `${pos.x} ${pos.y}`;
      }
    }, c);
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: `${ARTIFACT_DIR}\\${c.name}.png` });
  }

  await browser.close();
  console.log('Tested positions saved');
}
testPositions();
