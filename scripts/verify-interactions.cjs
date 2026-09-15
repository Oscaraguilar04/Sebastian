/* Functional smoke checks. Run with: node scripts/verify-interactions.cjs */
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "playwright",
);
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const baseURL = process.env.SITE_TEST_URL || "http://localhost:5173/sebastian-alvarez/";
const results = [];
const browserErrors = [];
const browserWarnings = [];
const dataRequests = [];
let page;

async function check(name, action) {
  const started = Date.now();
  try {
    await action();
    results.push({
      name,
      status: "passed",
      milliseconds: Date.now() - started,
    });
    process.stdout.write(`PASS ${name}\n`);
  } catch (error) {
    results.push({
      name,
      status: "failed",
      milliseconds: Date.now() - started,
      error: error.message,
    });
    process.stdout.write(`FAIL ${name}: ${error.message}\n`);
    await page.keyboard.press("Escape").catch(() => {});
  }
}

async function activeMatches(selector) {
  await page.waitForFunction(
    (match) => document.activeElement?.matches(match),
    selector,
  );
}

async function inquiryMatches(interest, messagePart) {
  await page.locator("#contact-name").waitFor({ state: "visible" });
  await page.waitForFunction(
    ({ interest, messagePart }) => {
      const message = document.querySelector("#contact-message")?.value ?? "";
      return (
        document.querySelector("#contact-interest")?.value === interest &&
        (!messagePart || message.includes(messagePart))
      );
    },
    { interest, messagePart },
  );
  assert.equal(await page.locator("#contact-interest").inputValue(), interest);
  if (messagePart) {
    assert.ok(
      (await page.locator("#contact-message").inputValue()).includes(
        messagePart,
      ),
    );
  }
  await activeMatches("#contact-heading, #contact-name");
}

async function completeDemoForm() {
  await page.locator("#contact-name").fill("Test Visitor");
  await page.locator("#contact-email").fill("visitor@example.com");
  await page.locator("#contact-phone").fill("");
  await page
    .getByRole("button", { name: "Start the Conversation", exact: true })
    .click();
  await page.locator(".contact-confirmation").waitFor({ state: "visible" });
  await activeMatches(".contact-confirmation h3");
}

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch {
    browser = await chromium.launch({ headless: true, channel: "chrome" });
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page = await context.newPage();
  page.setDefaultTimeout(7000);
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
    if (message.type() === "warning") browserWarnings.push(message.text());
  });
  page.on("request", (request) => {
    if (
      !["GET", "HEAD"].includes(request.method()) ||
      ["fetch", "xhr"].includes(request.resourceType())
    ) {
      dataRequests.push({
        method: request.method(),
        type: request.resourceType(),
        url: request.url(),
      });
    }
  });
  try {
    await page.goto(baseURL, { waitUntil: "networkidle", timeout: 30000 });
    await page.locator("#contact").waitFor();

    await check("desktop navigation anchors resolve", async () => {
      const missing = await page
        .locator('a[href^="#"]')
        .evaluateAll((links) =>
          links
            .map((link) => link.getAttribute("href"))
            .filter(
              (href) =>
                href && href !== "#" && !document.getElementById(href.slice(1)),
            ),
        );
      assert.deepEqual(missing, []);
    });

    const properties = [
      ["Riverlakes Residence", "$489,000", "4", "2.5", "2,180"],
      ["Rosedale Residence", "$559,000", "4", "3", "2,470"],
      ["Highgate Residence", "$649,000", "4", "3.5", "2,930"],
      ["Seven Oaks Residence", "$749,000", "5", "3.5", "3,240"],
    ];
    for (const [name, price, beds, baths, size] of properties) {
      await check(
        `${name}: modal details, image, Tab trap, Escape and focus restore`,
        async () => {
          const trigger = page.getByRole("button", {
            name: `View ${name}`,
            exact: true,
          });
          await trigger.click();
          const modal = page.locator("dialog.property-modal[open]");
          await modal.waitFor({ state: "visible" });
          assert.equal(await modal.locator("h2").innerText(), name);
          assert.equal(
            await modal.locator(".property-modal__price").innerText(),
            price,
          );
          assert.deepEqual(await modal.locator("dd").allTextContents(), [
            beds,
            baths,
            size,
          ]);
          assert.match(
            await modal.innerText(),
            /Property imagery is used for demonstration purposes/,
          );
          await modal.locator("img").evaluate((img) => img.decode());
          assert.ok(
            await modal.locator("img").evaluate((img) => img.naturalWidth > 0),
          );
          await activeMatches(".property-modal__close");
          await page.keyboard.press("Shift+Tab");
          await activeMatches(".property-modal__schedule");
          await page.keyboard.press("Tab");
          await activeMatches(".property-modal__close");
          await page.keyboard.press("Escape");
          await modal.waitFor({ state: "hidden" });
          assert.equal(
            await trigger.evaluate(
              (element) => element === document.activeElement,
            ),
            true,
          );
          assert.notEqual(
            await page
              .locator("body")
              .evaluate((element) => element.style.overflow),
            "hidden",
          );
        },
      );
    }

    await check(
      "property modal closes from backdrop and close button",
      async () => {
        await page
          .getByRole("button", {
            name: "View Riverlakes Residence",
            exact: true,
          })
          .click();
        await page.locator("dialog.property-modal[open]").waitFor();
        await page.mouse.click(5, 5);
        await page
          .locator("dialog.property-modal")
          .waitFor({ state: "hidden" });
        await activeMatches(".residence__image");
        await page
          .getByRole("button", {
            name: "View Riverlakes Residence",
            exact: true,
          })
          .click();
        await page
          .getByRole("button", { name: "Close property details", exact: true })
          .click();
        await page
          .locator("dialog.property-modal")
          .waitFor({ state: "hidden" });
      },
    );

    await check("contact required and optional-phone validation", async () => {
      await page
        .getByRole("button", { name: "Start the Conversation", exact: true })
        .click();
      await activeMatches("#contact-name");
      assert.equal(
        await page.locator("#contact-name").getAttribute("aria-invalid"),
        "true",
      );
      assert.equal(
        await page.locator("#contact-email").getAttribute("aria-invalid"),
        "true",
      );
      await page.locator("#contact-name").fill("Test Visitor");
      await page.locator("#contact-email").fill("invalid-address");
      await page
        .getByRole("button", { name: "Start the Conversation", exact: true })
        .click();
      await activeMatches("#contact-email");
      assert.match(
        await page.locator("#contact-email-error").innerText(),
        /valid email/,
      );
      await page.locator("#contact-email").fill("visitor@example.com");
      await page.locator("#contact-phone").fill("12");
      await page
        .getByRole("button", { name: "Start the Conversation", exact: true })
        .click();
      await activeMatches("#contact-phone");
      assert.equal(
        await page.locator("#contact-phone").getAttribute("aria-invalid"),
        "true",
      );
    });

    await check(
      "demo submission, confirmation focus and no data request",
      async () => {
        const before = dataRequests.length;
        await completeDemoForm();
        assert.match(
          await page.locator(".contact-confirmation").innerText(),
          /not been sent or saved/,
        );
        assert.match(
          await page.locator(".contact-confirmation").innerText(),
          /no conversation has been scheduled/,
        );
        assert.equal(dataRequests.length, before);
        assert.equal(await page.evaluate(() => localStorage.length), 0);
        assert.equal(await page.evaluate(() => sessionStorage.length), 0);
      },
    );

    await check(
      "residence CTA reopens completed form with property intent and focus",
      async () => {
        await page
          .getByRole("button", {
            name: "View Highgate Residence",
            exact: true,
          })
          .click();
        await page
          .getByRole("button", {
            name: "Looking for something like this?",
            exact: true,
          })
          .click();
        await page
          .locator("dialog.property-modal")
          .waitFor({ state: "hidden" });
        await inquiryMatches("Buying", "Highgate Residence");
        assert.equal(
          await page.locator("#contact-name").inputValue(),
          "Test Visitor",
        );
        assert.equal(
          await page.locator("#contact-email").inputValue(),
          "visitor@example.com",
        );
      },
    );

    await check(
      "confirmation Edit preserves fields, New inquiry resets fields",
      async () => {
        await completeDemoForm();
        await page
          .getByRole("button", { name: "Edit inquiry", exact: true })
          .click();
        await activeMatches("#contact-name");
        assert.equal(
          await page.locator("#contact-name").inputValue(),
          "Test Visitor",
        );
        assert.ok(
          (await page.locator("#contact-message").inputValue()).includes(
            "Highgate Residence",
          ),
        );
        await completeDemoForm();
        await page
          .getByRole("button", { name: "Start a new inquiry", exact: true })
          .click();
        await activeMatches("#contact-name");
        assert.equal(await page.locator("#contact-name").inputValue(), "");
        assert.equal(await page.locator("#contact-email").inputValue(), "");
        assert.equal(await page.locator("#contact-message").inputValue(), "");
        assert.equal(
          await page.locator("#contact-interest").inputValue(),
          "Buying",
        );
      },
    );

    await check("buying and selling pathways prefill inquiry", async () => {
      await page.getByRole("link", { name: "Explore Buying →" }).click();
      await inquiryMatches("Buying");
      await page.getByRole("link", { name: "Plan Your Sale →" }).click();
      await inquiryMatches("Selling");
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(baseURL, { waitUntil: "networkidle" });

    await check(
      "mobile menu is initially closed, traps focus, closes on Escape",
      async () => {
        const toggle = page.getByRole("button", {
          name: "Open navigation menu",
          exact: true,
        });
        const menu = page.getByRole("dialog", {
          name: "Navigation menu",
          exact: true,
        });
        assert.equal(await toggle.getAttribute("aria-expanded"), "false");
        assert.equal(await menu.isVisible(), false);
        await toggle.click();
        await menu.waitFor({ state: "visible" });
        await activeMatches(
          'dialog.nav__dialog button[aria-label="Close navigation menu"]',
        );
        for (let index = 0; index < 13; index++) {
          await page.keyboard.press("Tab");
          assert.equal(
            await page.evaluate(() =>
              document
                .querySelector("dialog.nav__dialog")
                ?.contains(document.activeElement),
            ),
            true,
          );
        }
        await page.keyboard.press("Escape");
        await menu.waitFor({ state: "hidden" });
        await activeMatches(
          '.nav__bar button[aria-label="Open navigation menu"]',
        );
        assert.notEqual(
          await page
            .locator("body")
            .evaluate((element) => element.style.overflow),
          "hidden",
        );
      },
    );

    await check(
      "mobile navigation destinations close menu and focus the section",
      async () => {
        for (const [label, hash, heading] of [
          ["About", "#about", "#about h2"],
          ["Residences", "#residences", "#residences h2"],
          ["Bakersfield", "#bakersfield", "#bakersfield h2"],
          ["Buying", "#buying", "#buying h2"],
          ["Selling", "#selling", "#selling h2"],
          ["Contact", "#contact", "#contact h2"],
        ]) {
          await page
            .getByRole("button", { name: "Open navigation menu", exact: true })
            .click();
          await page
            .getByRole("navigation", { name: "Mobile navigation", exact: true })
            .getByRole("link", { name: label, exact: true })
            .click();
          await page.locator("dialog.nav__dialog").waitFor({ state: "hidden" });
          await page.waitForFunction(
            (expected) => location.hash === expected,
            hash,
          );
          await activeMatches(heading);
        }
      },
    );

    await check(
      "mobile menu closes cleanly when resized to desktop",
      async () => {
        await page
          .getByRole("button", { name: "Open navigation menu", exact: true })
          .click();
        await page.locator("dialog.nav__dialog[open]").waitFor();
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.locator("dialog.nav__dialog").waitFor({ state: "hidden" });
        assert.notEqual(
          await page
            .locator("body")
            .evaluate((element) => element.style.overflow),
          "hidden",
        );
      },
    );

    await check(
      "no browser runtime errors or unexpected data requests",
      async () => {
        assert.deepEqual(browserErrors, []);
        assert.deepEqual(dataRequests, []);
      },
    );
  } finally {
    const output = {
      url: baseURL,
      testedAt: new Date().toISOString(),
      totals: {
        passed: results.filter((item) => item.status === "passed").length,
        failed: results.filter((item) => item.status === "failed").length,
      },
      results,
      browserErrors,
      browserWarnings,
      dataRequests,
    };
    const directory = path.resolve(__dirname, "..", ".tmp-screens");
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(
      path.join(directory, "interactions.json"),
      JSON.stringify(output, null, 2),
    );
    await browser.close();
  }
  if (results.some((item) => item.status === "failed")) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
