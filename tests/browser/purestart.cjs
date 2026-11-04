const assert = require("node:assert/strict");
const { mkdirSync } = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const output = process.env.PURESTART_ARTIFACTS || "/tmp/purestart-artifacts";
const state = (p) => p.evaluate(() => JSON.parse(localStorage.getItem("purestart-os-v1")));
(async () => {
  mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.setDefaultTimeout(20000);
  await page.goto(`${base}/purestart`);
  await page.getByRole("heading", { name: /Welcome to/ }).waitFor();
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${output}/welcome-desktop.png`, fullPage: true });
  await page.getByRole("button", { name: "Explore PureStart OS", exact: true }).click();
  assert.equal((await state(page)).welcomed, true);
  await page.reload();
  await page.getByRole("heading", { name: "Your day, beautifully organised." }).waitFor();
  assert.equal(await page.getByRole("dialog").count(), 0);
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${output}/overview-desktop.png`, fullPage: true });
  await page.getByRole("button", { name: "Try a Live Example", exact: true }).click();
  await page.getByRole("button", { name: "Mark as Collected", exact: true }).click();
  assert.equal((await state(page)).orders.find((o) => o.id === "PS-1042").status, "Collected");
  await page.getByText("Simulated notification · nothing sent").waitFor();
  await page.reload();
  await page.getByRole("button", { name: "Start Processing", exact: true }).waitFor();
  for (const name of ["Start Processing", "Mark Ready for Delivery", "Dispatch Order", "Mark Delivered"])
    await page.getByRole("button", { name, exact: true }).click();
  await page.getByRole("heading", { name: "Order Delivered Successfully" }).waitFor();
  assert.equal((await state(page)).events.filter((e) => e.orderId === "PS-1042").length, 5);
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${output}/order-delivered.png`, fullPage: true });
  const other = (await state(page)).orders.filter((o) => o.id !== "PS-1042");
  await page.getByRole("button", { name: "Reset Example", exact: true }).click();
  assert.deepEqual(
    (await state(page)).orders.filter((o) => o.id !== "PS-1042"),
    other,
  );
  assert.equal((await state(page)).events.filter((e) => e.orderId === "PS-1042").length, 0);
  console.log("PASS welcome, persistence, live journey, connected notifications, isolated reset");
  await page.getByRole("button", { name: "Guided tour", exact: true }).click();
  const tour = page.getByRole("complementary", { name: "Guided tour" });
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Mark as Collected", exact: true }).waitFor();
  assert.equal(await tour.getByRole("button", { name: "Next", exact: true }).isDisabled(), true);
  await page.getByRole("button", { name: "Mark as Collected", exact: true }).click();
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await tour.getByRole("button", { name: "Back", exact: true }).click();
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByLabel("Calendar view", { exact: true }).waitFor();
  await page.getByLabel("Calendar view", { exact: true }).selectOption("Week");
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Simulate Automation", exact: true }).click();
  assert.ok((await state(page)).events.some((e) => e.text.startsWith("Simulation:")));
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${output}/automation-desktop.png`, fullPage: true });
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByLabel("Insight period").waitFor();
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await tour.getByRole("heading", { name: "That's just the beginning." }).waitFor();
  await tour.getByRole("button", { name: "Restart Tour", exact: true }).click();
  await tour.getByRole("button", { name: "Skip Tour", exact: true }).click();
  console.log("PASS guided tour, action gate, back/next, real page navigation, automation, completion/restart/skip");
  await page.goto(`${base}/purestart/orders`);
  await page.getByRole("button", { name: "New order", exact: true }).click();
  await page.getByRole("button", { name: "Add service item", exact: true }).click();
  await page.getByRole("button", { name: "Create order", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  const created = (await state(page)).orders[0];
  assert.equal(created.items.length, 2);
  await page.goto(`${base}/purestart/orders/${created.id}`);
  await page.getByRole("button", { name: "Edit order", exact: true }).click();
  await page.getByLabel("Order notes", { exact: true }).fill("Handle with care — browser test");
  await page.getByRole("button", { name: "Save order", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  assert.equal((await state(page)).orders[0].notes, "Handle with care — browser test");
  await page.getByRole("button", { name: "Create invoice", exact: true }).click();
  await page.goto(`${base}/purestart/billing`);
  await page.getByRole("button", { name: "Preview", exact: true }).first().click();
  await page.getByRole("button", { name: "Print / Save as PDF", exact: true }).click();
  await page.emulateMedia({ media: "print" });
  const printBounds = await page.locator(".ps-print-invoice").boundingBox();
  assert.ok(printBounds && printBounds.x >= 0 && printBounds.y >= 0, "Invoice must print inside the page");
  await page.pdf({ path: `${output}/sample-invoice.pdf`, format: "A4" });
  await page.emulateMedia({ media: "screen" });
  await page.getByRole("button", { name: "Close", exact: true }).click();
  const beforePaid = (await state(page)).invoices[0];
  await page.getByRole("button", { name: "Mark paid", exact: true }).first().click();
  assert.equal((await state(page)).invoices.find((i) => i.orderId === beforePaid.orderId).paid, true);
  await page.goto(`${base}/purestart/recurring`);
  const count = (await state(page)).orders.length;
  await page.getByRole("button", { name: "Generate Next Booking", exact: true }).first().click();
  assert.equal((await state(page)).orders.length, count + 1);
  await page.getByRole("button", { name: "New recurring booking", exact: true }).click();
  await page.getByRole("button", { name: "Create recurring booking", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  assert.equal((await state(page)).recurring.length, 2);
  await page.goto(`${base}/purestart/customers`);
  await page.getByRole("button", { name: "New customer", exact: true }).click();
  await page.getByLabel("Name", { exact: true }).fill("Demo Test Customer");
  await page.getByLabel("Email", { exact: true }).fill("demo@example.com");
  await page.getByLabel("Address", { exact: true }).fill("10 Fictional Road");
  await page.getByRole("button", { name: "Save customer", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  assert.ok((await state(page)).customers.some((c) => c.name === "Demo Test Customer"));
  await page.getByRole("button", { name: /Demo Test Customer/ }).click();
  await page.getByRole("button", { name: "Edit customer and notes", exact: true }).click();
  await page.getByLabel("Internal notes", { exact: true }).fill("Fictional note saved by browser test");
  await page.getByRole("button", { name: "Save customer", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  assert.equal(
    (await state(page)).customers.find((c) => c.name === "Demo Test Customer").notes,
    "Fictional note saved by browser test",
  );
  await page.goto(`${base}/purestart/settings`);
  await page.getByLabel("Delivery fee (R)", { exact: true }).fill("75");
  await page.getByRole("button", { name: "Save settings", exact: true }).click();
  await page.reload();
  await page.getByLabel("Delivery fee (R)", { exact: true }).waitFor();
  assert.equal(await page.getByLabel("Delivery fee (R)", { exact: true }).inputValue(), "75");
  assert.equal((await state(page)).invoices.find((i) => i.orderId === created.id).amount, created.total);
  console.log(
    "PASS create/edit orders, multi-item pricing, invoice preview/payment, recurring generation/creation, customers, settings/history",
  );
  await page.getByRole("button", { name: "Reset All Demo Data", exact: true }).click();
  await page.getByRole("button", { name: "Keep my demo data", exact: true }).click();
  assert.equal((await state(page)).settings.fee, 75);
  await page.getByRole("button", { name: "Reset All Demo Data", exact: true }).click();
  await page.getByRole("button", { name: "Confirm reset all data", exact: true }).click();
  assert.equal((await state(page)).settings.fee, 40);
  await page.goto(`${base}/dashboard/default`);
  await page.getByRole("button", { name: "Start Interactive Demo", exact: true }).waitFor();
  console.log("PASS confirmed global reset and preserved Winglo application");
  for (const width of [390, 360, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ["", "/orders/PS-1042", "/scheduling", "/automation", "/insights", "/billing"]) {
      await page.goto(`${base}/purestart${route}`);
      await page.locator(".ps-content h1").waitFor();
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `overflow ${width} ${route}`,
      );
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/purestart`);
  await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  await page
    .getByRole("navigation", { name: "PureStart navigation" })
    .getByRole("link", { name: "Orders", exact: false })
    .click();
  await page.getByLabel("Search orders", { exact: true }).waitFor();
  await page.goto(`${base}/purestart`);
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${output}/overview-mobile.png`, fullPage: true });
  await page.getByRole("button", { name: "Reopen welcome", exact: true }).click();
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${output}/welcome-mobile.png`, fullPage: true });
  await page.getByRole("button", { name: "Take a Guided Tour", exact: true }).click();
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Mark as Collected", exact: true }).click();
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${output}/tour-mobile.png`, fullPage: true });
  await tour.getByRole("button", { name: "Skip Tour", exact: true }).click();
  assert.deepEqual(errors, []);
  console.log("PASS 360/390/768px routes, mobile navigation and guided interaction; no page errors");
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
