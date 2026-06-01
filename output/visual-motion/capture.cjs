const { chromium } = require("@playwright/test");
const path = require("path");
(async () => {
  const out = process.env.SCREENSHOT_OUT;
  const browser = await chromium.launch();
  for (const item of [
    ["services", "desktop", 1440, 1100],
    ["services", "mobile", 390, 1200],
    ["ai", "desktop", 1440, 1100],
    ["ai", "mobile", 390, 1200],
  ]) {
    const [route, name, width, height] = item;
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`http://localhost:3002/${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(out, `${route}-${name}.png`), fullPage: false });
    await page.close();
  }
  await browser.close();
})();
