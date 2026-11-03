/* Run with PLAYWRIGHT_MODULE pointing to the environment's Playwright installation. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { mkdirSync } = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const artifacts = path.resolve(__dirname, "../../artifacts");
const saved = (p) => p.evaluate(() => JSON.parse(localStorage.getItem("winglo-demo-v1")).state.data);
(async () => {
  mkdirSync(artifacts, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  const p = await context.newPage();
  p.setDefaultTimeout(15000);
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(`${base}/dashboard/default`);
  await p.getByRole("button", { name: "Start Demo", exact: true }).waitFor();
  await p.evaluate(() => localStorage.removeItem("winglo-demo-v1"));
  await p.reload();
  await p.getByRole("button", { name: "Start Demo", exact: true }).click();
  await p.getByRole("button", { name: "Next Step", exact: true }).click();
  const dialog = p.getByRole("dialog");
  await dialog.getByRole("button", { name: "Use fictional details" }).click();
  for (let i = 0; i < 9; i++) await dialog.getByRole("button", { name: "Next question", exact: true }).click();
  await dialog.getByRole("button", { name: "Submit enquiry", exact: true }).click();
  await dialog.waitFor({ state: "hidden" });
  let d = await saved(p);
  const enquiry = d.enquiries.find((e) => d.customers.find((c) => c.id === e.customerId)?.name === "Zanele Demo");
  assert.equal(enquiry.status, "Ready for Quote");
  assert.equal(enquiry.answers.size, "120");
  await p.getByRole("button", { name: "Next Step", exact: true }).click();
  await dialog.getByLabel("Base cleaning price", { exact: true }).fill("1000");
  await dialog.getByRole("button", { name: "Save quotation", exact: true }).click();
  await p.getByRole("button", { name: "Next Step", exact: true }).click();
  await dialog.getByRole("button", { name: "Save quotation", exact: true }).click();
  await p.getByRole("button", { name: "Next Step", exact: true }).click();
  await p.getByRole("button", { name: "Next Step", exact: true }).click();
  d = await saved(p);
  const quote = d.quotes.find((q) => q.enquiryId === enquiry.id);
  assert.equal(quote.status, "Accepted (Simulated)");
  assert.equal(quote.base, 1000);
  await p.getByRole("button", { name: "Next Step", exact: true }).click();
  await dialog.getByRole("button", { name: "Save booking", exact: true }).click();
  await dialog.waitFor({ state: "hidden" });
  d = await saved(p);
  const booking = d.bookings.find((b) => b.quoteId === quote.id);
  assert.ok(booking);
  assert.equal(d.enquiries.find((e) => e.id === enquiry.id).status, "Converted");
  await p.getByLabel("Calendar view", { exact: true }).selectOption("timeGridWeek");
  await p.getByRole("button", { name: "Next Step", exact: true }).click();
  await p.getByRole("button", { name: "Next Step", exact: true }).click();
  await dialog.getByRole("heading", { name: "Zanele Demo" }).waitFor();
  await dialog.getByRole("button", { name: "Close", exact: true }).click();
  await p.getByRole("button", { name: "Next Step", exact: true }).click();
  await dialog.getByRole("button", { name: "Simulate message", exact: true }).click();
  await dialog.getByText("Simulation complete. This preview was not sent.").waitFor();
  await dialog.getByRole("button", { name: "Close", exact: true }).click();
  await p.getByRole("button", { name: "Finish demo", exact: true }).click();
  await p.reload();
  assert.ok((await saved(p)).bookings.find((b) => b.id === booking.id));
  for (const route of ["enquiries", "quotations", "bookings", "customers", "settings"]) {
    await p.goto(`${base}/dashboard/${route}`);
    await p.getByRole("heading", { name: route[0].toUpperCase() + route.slice(1), exact: true }).waitFor();
  }
  // Service-specific customer form, same store, no external submission.
  await p.goto(`${base}/enquire`);
  for (const [service, field] of [
    ["carpet", "Number of carpeted areas"],
    ["move", "Move date"],
    ["renovation", "Renovation type"],
    ["office", "Cleaning frequency"],
  ]) {
    await p.getByLabel("Cleaning service", { exact: true }).selectOption(service);
    await p.getByLabel(field, { exact: true }).waitFor();
  }
  await p.getByRole("button", { name: "Use fictional details" }).click();
  await p.getByRole("button", { name: "Submit enquiry", exact: true }).click();
  await p.getByText("Your details are saved in this browser’s demo workspace.").waitFor();
  assert.equal((await saved(p)).customers.filter((c) => c.name === "Zanele Demo").length, 1);
  await p.goto(`${base}/dashboard/bookings`);
  await p.getByLabel("Search bookings").fill("Zanele");
  await p.getByRole("button", { name: "View / reschedule", exact: true }).click();
  await dialog.getByLabel("Booking status", { exact: true }).selectOption("Completed");
  await dialog.getByRole("button", { name: "Save booking", exact: true }).click();
  assert.equal((await saved(p)).bookings.find((b) => b.id === booking.id).status, "Completed");
  await p.goto(`${base}/dashboard/default`);
  await p.getByRole("button", { name: "Start Demo", exact: true }).waitFor();
  await p.screenshot({ path: path.join(artifacts, "winglo-dark.png"), fullPage: true });
  while (await p.locator("html").evaluate((e) => e.classList.contains("dark"))) {
    await p.getByRole("button", { name: /Current theme:/ }).click();
    await p.waitForTimeout(400);
  }
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(artifacts, "winglo-desktop.png"), fullPage: true });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.screenshot({ path: path.join(artifacts, "winglo-mobile.png"), fullPage: true });
  assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await p.getByRole("button", { name: "Toggle Sidebar", exact: true }).click();
  await p.getByRole("link", { name: "Enquiries", exact: true }).click();
  await p.getByRole("heading", { name: "Enquiries", exact: true }).waitFor();
  await p.goto(`${base}/dashboard/settings`);
  await p.getByRole("button", { name: "Reset Demo Data", exact: true }).click();
  await p.getByRole("button", { name: "Confirm reset", exact: true }).click();
  assert.equal(
    (await saved(p)).customers.some((c) => c.name === "Zanele Demo"),
    false,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: guided simulator → quote review/approval/acceptance → booking/calendar → customer → reminder; all six routes; dynamic form; customer deduplication; completion; refresh persistence; reset; light/dark; mobile navigation and width.",
  );
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
