const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "playwright",
);
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const widths = [320, 375, 390, 393, 414, 430, 768, 1024, 1280, 1440, 1920];
  const output = path.join(process.cwd(), ".tmp-screens");
  fs.mkdirSync(output, { recursive: true });
  const results = [];
  const errors = [];
  const page = await browser.newPage({
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: width > 700 ? 1000 : 844 });
    await page.goto(process.env.SITE_URL || "http://127.0.0.1:5173/sebastian-alvarez/", {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      for (const img of document.images) {
        img.loading = "eager";
      }
      await Promise.all(
        [...document.images].map((img) => img.decode().catch(() => {})),
      );
    });
    const data = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return (
            r.width &&
            (r.right > innerWidth + 1 || r.left < -1) &&
            s.position !== "fixed"
          );
        })
        .map((el) => ({
          tag: el.tagName,
          className: el.className,
          width: el.getBoundingClientRect().width,
        }))
        .slice(0, 15),
      brokenImages: [...document.images]
        .filter((img) => !img.complete || !img.naturalWidth)
        .map((img) => img.src),
      fonts:
        document.fonts.check('400 16px "Manrope"') &&
        document.fonts.check('400 16px "Cormorant Garamond"'),
      headings: document.querySelectorAll("h1").length,
      heroHeight: document.querySelector(".hero").getBoundingClientRect()
        .height,
      menuClosed: !document.querySelector(".nav__dialog")?.open,
      brokenAnchors: [...document.querySelectorAll('a[href^="#"]')]
        .filter((a) => !document.getElementById(a.hash.slice(1)))
        .map((a) => a.hash),
    }));
    results.push(data);
    if ([320, 390, 1440, 1920].includes(width)) {
      await page.screenshot({
        path: path.join(output, `viewport-${width}.png`),
      });
      await page.screenshot({
        path: path.join(output, `full-${width}.png`),
        fullPage: true,
      });
    }
  }
  fs.writeFileSync(
    path.join(output, "layouts.json"),
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(JSON.stringify({ results, errors }, null, 2));
  await browser.close();
  if (errors.length || results.some(result => result.scrollWidth > result.width || result.overflow.length || result.brokenImages.length || result.brokenAnchors.length || !result.fonts || !result.menuClosed || result.headings !== 1)) {
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
