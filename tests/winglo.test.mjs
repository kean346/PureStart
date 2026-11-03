import {
  estimate,
  overlaps,
  seed,
  serviceQuestions,
  total,
} from "../src/app/(main)/dashboard/_components/winglo/model.ts";
import assert from "node:assert/strict";
import test from "node:test";

test("sample quote calculation applies adjustments, capped discount and configurable VAT", () => {
  const q = { base: 1000, size: 120, extras: 150, travel: 80, discount: 50, vat: 0 };
  assert.equal(total(q), 1300);
  assert.equal(total({ ...q, vat: 15 }), 1495);
  assert.equal(total({ ...q, discount: 9000 }), 0);
  const d = seed();
  const e = { ...d.enquiries[0], answers: { size: "120", extras: "Windows" } };
  const priced = estimate(e, d.settings);
  assert.equal(priced.size, 120);
  assert.equal(priced.vat, 0);
  assert.equal(priced.extras, 150);
  assert.equal(estimate(e, { ...d.settings, sizeRate: 5 }).size, 200);
});
test("cleaner conflicts distinguish overlapping, adjacent, cancelled and other staff bookings", () => {
  const a = { ...seed().bookings[0], id: "a", start: "2026-11-04T09:00", duration: 3, staffId: "s" };
  const b = { ...a, id: "b", start: "2026-11-04T11:00" };
  assert.ok(overlaps(a, b));
  assert.ok(!overlaps(a, { ...b, start: "2026-11-04T12:00" }));
  assert.ok(!overlaps(a, { ...b, status: "Cancelled" }));
  assert.ok(!overlaps(a, { ...b, staffId: "other" }));
  assert.ok(!overlaps(a, { ...b, id: "a" }));
});
test("fictional demo relations and service-specific question sets are coherent", () => {
  const d = seed();
  for (const record of [...d.enquiries, ...d.quotes, ...d.bookings]) {
    assert.ok(d.customers.some((c) => c.id === record.customerId));
    assert.ok(d.settings.services.some((s) => s.id === record.serviceId));
  }
  for (const b of d.bookings.filter((b) => b.quoteId)) {
    const q = d.quotes.find((q) => q.id === b.quoteId);
    assert.equal(q.customerId, b.customerId);
    assert.equal(q.serviceId, b.serviceId);
    assert.equal(total(q), b.amount);
  }
  const sets = Object.values(serviceQuestions).map((q) => q.map((v) => v.key).join(","));
  assert.equal(new Set(sets).size, 5);
});
