// Optional browser verification. Uses an existing Playwright installation; no app dependency is added.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const base = process.env.BASE_URL || "http://127.0.0.1:3001";

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 650 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push({ url: page.url(), message: error.message }));
  await page.addInitScript(() => {
    window.motionCLS = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.motionCLS += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(`${base}/dashboard/default`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  const first = page.locator('[data-motion-page] [data-slot="card"]').first();
  const originalRun = await first.getAttribute("data-motion-run");
  assert.ok(originalRun);
  assert.ok((await first.textContent()).includes("$1,250.00"));
  const lower = page.locator('[data-motion-page] [data-slot="card"]').last();
  assert.equal(await lower.getAttribute("data-motion-run"), null, "below-fold table waits for scrolling");
  await lower.scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  assert.ok(await lower.getAttribute("data-motion-run"));
  const lowerRun = await lower.getAttribute("data-motion-run");
  await page.evaluate(() => window.scrollTo(0, 0));
  await lower.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  assert.equal(await lower.getAttribute("data-motion-run"), lowerRun, "scrolling back does not replay within a visit");
  await page.getByPlaceholder("Search customers...").fill("Mira");
  await page.waitForTimeout(200);
  assert.equal(await first.getAttribute("data-motion-run"), originalRun, "typing does not restart page");
  console.log("PASS initial cards/counters, scroll reveal once per visit, search isolation");

  for (const label of ["CRM", "Finance", "Analytics", "Home", "CRM", "Home"]) {
    await page.getByRole("link", { name: label, exact: true }).click();
    await page.waitForTimeout(1400);
    const card = page.locator('[data-motion-page] [data-slot="card"]').first();
    assert.ok(await card.getAttribute("data-motion-run"), `${label} enters`);
    if (label === "Home") assert.notEqual(await card.getAttribute("data-motion-run"), originalRun, "return replays");
  }
  await page.goBack();
  await page.waitForTimeout(1400);
  assert.ok((await page.locator("[data-motion-page]").getAttribute("data-motion-page")).includes("crm"));
  await page.goForward();
  await page.waitForTimeout(1400);
  console.log("PASS sidebar revisits and browser back/forward");

  await page.getByRole("link", { name: "Analytics", exact: true }).click();
  await page.waitForTimeout(1400);
  const analyticsCard = page.locator('[data-motion-page] [data-slot="card"]').first();
  const analyticsRun = await analyticsCard.getAttribute("data-motion-run");
  await page.getByRole("tab", { name: "Audience", exact: true }).click();
  await page.waitForTimeout(1400);
  assert.ok(await page.getByText("Sessions by device", { exact: true }).isVisible());
  assert.equal(await analyticsCard.getAttribute("data-motion-run"), analyticsRun, "only the new tab panel animates");
  await page.getByRole("tab", { name: "Overview", exact: true }).click();
  await page.waitForTimeout(1400);
  console.log("PASS tab panels animate without remounting KPI state");

  const beforeTheme = await analyticsCard.getAttribute("data-motion-run");
  await page.getByRole("button", { name: /Current theme: dark/ }).click();
  await page.waitForFunction(() => document.documentElement.dataset.themeTransition === "reveal");
  assert.equal(
    await page.evaluate(() => getComputedStyle(document.documentElement, "::view-transition-new(root)").animationName),
    "noreva-theme-reveal",
  );
  await page.waitForFunction(() => !document.documentElement.dataset.themeTransition);
  assert.equal(await analyticsCard.getAttribute("data-motion-run"), beforeTheme, "theme does not replay page");
  await page.getByRole("button", { name: "About NOREVA" }).click();
  assert.ok(await page.getByRole("dialog").isVisible());
  await page.waitForTimeout(100);
  assert.ok(await page.getByRole("dialog").locator('[data-slot="dialog-header"]').getAttribute("data-motion-run"));
  await page.keyboard.press("Escape");
  console.log("PASS radial theme reveal and modal child stagger");

  await page.goto(`${base}/dashboard/logistics`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const panel = page.locator("[data-motion-panel]").first();
  await page.locator("button[aria-pressed]").nth(1).click();
  await page.waitForTimeout(150);
  assert.ok((await panel.getAttribute("data-motion-panel")).includes("02"));
  await page.getByRole("tab", { name: "Documents", exact: true }).click();
  await page.waitForTimeout(150);
  assert.ok(await page.getByText("Demo shipment manifest", { exact: true }).isVisible());
  console.log("PASS selected shipment and internal panels");

  for (const slug of [
    "productivity",
    "ecommerce",
    "academy",
    "infrastructure",
    "file-manager",
    "calendar",
    "invoice",
    "kanban",
    "tasks",
    "products",
    "profile",
    "roles",
    "users",
    "chat",
    "mail",
    "default-v1",
    "crm-v1",
    "finance-v1",
    "analytics-v1",
  ]) {
    const response = await page.goto(`${base}/dashboard/${slug}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    assert.equal(response.status(), 200, slug);
    await page.waitForTimeout(1100);
    assert.ok(
      (await page.locator("[data-motion-page] [data-motion-run]").count()) > 0,
      `${slug} has individual animated elements`,
    );
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
      `${slug} overflow`,
    );
    console.log("PASS route", slug);
  }
  for (const url of ["/auth/v1/login", "/auth/v1/register", "/auth/v2/login", "/auth/v2/register", "/chat", "/mail"]) {
    const response = await page.goto(`${base}${url}`, { waitUntil: "domcontentloaded" });
    assert.equal(response.status(), 200);
    await page.waitForTimeout(900);
    assert.ok((await page.locator("[data-motion-run]").count()) > 0, `${url} motion coverage`);
    console.log("PASS standalone", url);
  }

  // A disabled native API exercises the CSS palette fallback.
  const fallback = await browser.newPage();
  await fallback.addInitScript(() => {
    document.startViewTransition = undefined;
  });
  await fallback.goto(`${base}/dashboard/default`, { waitUntil: "networkidle" });
  await fallback.getByRole("button", { name: /Current theme: dark/ }).click();
  assert.equal(await fallback.locator("html").getAttribute("data-theme-transition"), "fallback");
  await fallback.waitForFunction(() => !document.documentElement.dataset.themeTransition, {}, { timeout: 5000 });
  assert.equal(await fallback.locator("html").getAttribute("data-theme-transition"), null);
  console.log("PASS CSS theme fallback");
  const reduced = await browser.newPage({
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  await reduced.goto(`${base}/dashboard/default`, { waitUntil: "networkidle" });
  assert.equal(
    await reduced.locator('[data-motion-page] [data-slot="card"]').first().getAttribute("data-motion-run"),
    null,
  );
  assert.ok(await reduced.getByText("$1,250.00", { exact: true }).isVisible());
  await reduced.getByRole("button", { name: /Current theme: dark/ }).click();
  assert.equal(await reduced.locator("html").getAttribute("data-theme-transition"), null);
  assert.equal(await reduced.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  console.log("PASS reduced motion and mobile");
  console.log("BROWSER_ERRORS", JSON.stringify(errors));
  assert.deepEqual(errors, []);
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
