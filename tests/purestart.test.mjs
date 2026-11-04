import {
  advance,
  analytics,
  dataSchema,
  generate,
  issueInvoice,
  price,
  resetExample,
  saveOrder,
  seed,
  stages,
} from "../src/app/purestart/_components/model.ts";
import assert from "node:assert/strict";
import test from "node:test";

test("PureStart seed is valid and isolated from other clients", () => {
  const data = dataSchema.parse(seed());
  assert.equal(data.orders[0].id, "PS-1042");
  assert.equal(data.orders[0].status, "Scheduled");
  assert.equal(
    data.invoices.some((i) => i.orderId === "PS-1042"),
    false,
  );
  assert.ok(data.customers.every((c) => c.email.endsWith("@example.com")));
});
test("one-click order journey records each transition and notification once", () => {
  let data = seed();
  for (const status of stages.slice(1, -1)) {
    const next = advance(data, "PS-1042", status);
    assert.equal(advance(next, "PS-1042", status), next);
    data = next;
  }
  assert.equal(data.orders[0].status, "Delivered");
  assert.equal(data.events.length, 5);
  assert.equal(new Set(data.events.map((e) => e.id)).size, 5);
  assert.equal(advance(data, "PS-1042", "Delivered"), data);
  assert.equal(dataSchema.safeParse(data).success, true);
});
test("example reset preserves unrelated records and removes only linked events and invoice", () => {
  let data = advance(seed(), "PS-1042", "Scheduled");
  data = issueInvoice(data, "PS-1042");
  data.events.push({
    id: "other",
    orderId: "PS-1043",
    text: "Other event",
    message: "Other message",
    at: new Date().toISOString(),
  });
  const reset = resetExample(data);
  assert.equal(reset.orders[0].status, "Scheduled");
  assert.deepEqual(reset.orders.slice(1), data.orders.slice(1));
  assert.deepEqual(reset.settings, data.settings);
  assert.deepEqual(reset.customers, data.customers);
  assert.equal(reset.events.length, 1);
  assert.equal(reset.events[0].id, "other");
  assert.equal(reset.invoices.length, data.invoices.length - 1);
});
test("pricing applies minimum once then fee and rounds to cents", () => {
  assert.equal(price([{ service: "Wash", quantity: 1, rate: 35 }], 150, 40), 190);
  assert.equal(
    price(
      [
        { service: "Wash", quantity: 5, rate: 35 },
        { service: "Bedding", quantity: 2, rate: 45 },
      ],
      150,
      40,
    ),
    305,
  );
});
test("recurring generation creates one order per occurrence and advances the rule", () => {
  const data = seed();
  const next = data.recurring[0].next;
  const generated = generate(data, "r1", next);
  assert.equal(generated.orders.length, data.orders.length + 1);
  assert.equal(generate(generated, "r1", next), generated);
  assert.notEqual(generated.recurring[0].next, next);
  assert.equal(generated.recurring[0].occurrences[0], generated.orders[0].id);
  assert.equal(dataSchema.safeParse(generated).success, true);
});
test("monthly recurrence clamps the day at month end", () => {
  const data = seed();
  data.recurring[0].next = "2027-01-31T09:00:00";
  data.recurring[0].frequency = "Monthly";
  assert.equal(generate(data, "r1", data.recurring[0].next).recurring[0].next, "2027-02-28T09:00:00");
});
test("order validation rejects invalid dates and driver conflicts", () => {
  const data = seed();
  const sample = data.orders[0];
  assert.throws(() => saveOrder(data, { ...sample, id: "bad", delivery: sample.collection }), /after collection/);
  assert.throws(() => saveOrder(data, { ...sample, id: "conflict" }), /Driver conflict/);
  assert.throws(() => saveOrder(data, { ...sample, id: "bad", items: [{ service: "Wash", quantity: -1, rate: 35 }] }));
});
test("invoice issue is idempotent and historical totals are protected", () => {
  let data = issueInvoice(seed(), "PS-1042");
  assert.equal(issueInvoice(data, "PS-1042"), data);
  const amount = data.invoices[0].amount;
  data = { ...data, settings: { ...data.settings, fee: 999 } };
  assert.equal(data.invoices[0].amount, amount);
  assert.throws(() => saveOrder(data, { ...data.orders[0], notes: "Changed", driver: "Unassigned" }), /locked/);
});
test("financial selectors distinguish paid, outstanding and pending value", () => {
  const data = seed();
  const a = analytics(data, 30);
  assert.equal(a.invoiced, a.paid + a.outstanding);
  assert.equal(
    a.pending,
    data.orders.filter((o) => !data.invoices.some((i) => i.orderId === o.id)).reduce((s, o) => s + o.total, 0),
  );
  const unpaid = data.invoices.find((i) => !i.paid);
  const paid = {
    ...data,
    invoices: data.invoices.map((i) => (i === unpaid ? { ...i, paid: true, paidAt: new Date().toISOString() } : i)),
  };
  assert.equal(analytics(paid, 30).paid, a.paid + unpaid.amount);
});

test("revenue uses the payment date even when the invoice was issued earlier", () => {
  const data = seed();
  const old = new Date();
  old.setDate(old.getDate() - 60);
  const invoice = {
    orderId: "PS-1042",
    amount: 210,
    issued: old.toISOString(),
    paid: true,
    paidAt: new Date().toISOString(),
  };
  data.invoices = [invoice];
  const a = analytics(data, 7);
  assert.equal(a.paid, 210);
  assert.equal(a.invoiced, 0);
  assert.equal(
    a.revenue.reduce((sum, point) => sum + point.paid, 0),
    210,
  );
});
