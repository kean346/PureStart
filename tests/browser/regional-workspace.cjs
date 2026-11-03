const path = require("node:path");
const baseURL = process.env.BASE_URL || "http://127.0.0.1:3001";
const artifactRoot = path.resolve(__dirname, "../../artifacts");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const c = await b.newContext({
    viewport: { width: 1440, height: 1000 },
    recordVideo: { dir: "/tmp/noreva-regional-video", size: { width: 1440, height: 1000 } },
    reducedMotion: "no-preference",
  });
  const p = await c.newPage();
  let errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(`${baseURL}/dashboard/default`, { waitUntil: "domcontentloaded" });
  const counter = p.locator('[data-motion-counter="managed"]').first();
  await p.waitForFunction(() =>
    document.querySelector('[data-motion-page] [data-slot="card"]')?.hasAttribute("data-motion-run"),
  );
  await p.waitForTimeout(120);
  const early = await counter.textContent();
  const line = p.locator(".recharts-area-area").first();
  const clipEarly = await line.evaluate((e) => getComputedStyle(e).clipPath);
  await p.waitForTimeout(650);
  const middle = await counter.textContent();
  await p.waitForTimeout(1200);
  const final = await counter.textContent();
  assert.equal(final, "R 184,250.00");
  assert.notEqual(early, final);
  assert.notEqual(early, middle);
  assert.notEqual(clipEarly, await line.evaluate((e) => getComputedStyle(e).clipPath));
  console.log("COUNTER_AND_GRAPH", JSON.stringify({ early, middle, final, clipEarly }));
  await p.screenshot({ path: `${artifactRoot}/noreva-regional-home.png`, fullPage: true, animations: "disabled" });
  await p.evaluate(() => {
    window.crmSamples = [];
    window.crmObserver = new MutationObserver((records) => {
      for (const r of records) {
        const n = r.target.nodeType === 3 ? r.target.parentElement : r.target;
        if (n?.closest?.("[data-motion-counter=managed]")) window.crmSamples.push(n.textContent);
      }
    });
    window.crmObserver.observe(document.body, { subtree: true, childList: true, characterData: true });
  });
  await p.getByRole("link", { name: "Client relationships", exact: true }).click();
  await p.waitForTimeout(350);
  const crm = p.locator('[data-motion-counter="managed"]').first();
  await p.waitForTimeout(1600);
  assert.equal(await crm.textContent(), "R 2,845,000");
  const samples = await p.evaluate(() => window.crmSamples);
  console.log("CRM_SAMPLES", JSON.stringify(samples.slice(0, 12)));
  assert.ok(samples.some((s) => /^R [0-9,]+$/.test(s) && s !== "R 2,845,000" && s !== "R 184,250.00"));
  console.log("PASS CRM zero-to-rand counter and charts");
  await p.screenshot({ path: `${artifactRoot}/noreva-regional-crm.png`, fullPage: true, animations: "disabled" });
  await p.getByRole("link", { name: "Shipment desk", exact: true }).click();
  await p.waitForTimeout(1400);
  assert.ok(await p.getByText("OR Tambo Airport", { exact: true }).first().isVisible());
  assert.ok(await p.getByText("Hosea Kutako Airport", { exact: true }).first().isVisible());
  await p.screenshot({ path: `${artifactRoot}/noreva-regional-logistics.png`, fullPage: true, animations: "disabled" });
  await p.getByRole("button", { name: /Current theme: dark/ }).click();
  await p.waitForFunction(() => document.documentElement.dataset.themeTransition === "reveal");
  assert.equal(
    await p.evaluate(() => getComputedStyle(document.documentElement, "::view-transition-new(root)").animationName),
    "noreva-theme-reveal",
  );
  await p.waitForFunction(() => !document.documentElement.dataset.themeTransition);
  console.log("PASS screen-covering theme reveal");
  const video = p.video();
  await c.close();
  await video.saveAs("/tmp/noreva-regional-motion.webm");
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await m.goto(`${baseURL}/dashboard/default`, { waitUntil: "networkidle" });
  await m.waitForTimeout(1800);
  assert.equal(await m.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await m.screenshot({ path: `${artifactRoot}/noreva-regional-mobile.png`, fullPage: true, animations: "disabled" });
  console.log("PASS regional mobile layout");
  const override = await b.newPage({ reducedMotion: "reduce" });
  await override.goto(`${baseURL}/dashboard/default`, { waitUntil: "networkidle" });
  await override.getByRole("button", { name: "Appearance settings" }).click();
  await override.getByRole("combobox", { name: "Animation preference" }).click();
  await override.getByRole("option", { name: "Full animation", exact: true }).click();
  assert.equal(await override.locator("html").getAttribute("data-motion-preference"), "full");
  await override.keyboard.press("Escape");
  await override.getByRole("button", { name: /Current theme: dark/ }).click();
  await override.waitForFunction(() => document.documentElement.dataset.themeTransition === "reveal");
  assert.equal(
    await override.evaluate(
      () => getComputedStyle(document.documentElement, "::view-transition-new(root)").animationName,
    ),
    "noreva-theme-reveal",
  );
  await override.waitForFunction(() => !document.documentElement.dataset.themeTransition);
  await override.reload({ waitUntil: "networkidle" });
  assert.equal(await override.locator("html").getAttribute("data-motion-preference"), "full");
  console.log("PASS explicit full-motion preference overrides device reduction and persists");
  console.log("ERRORS", errors);
  assert.deepEqual(errors, []);
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
