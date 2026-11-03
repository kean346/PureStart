import { numericLabel } from "../src/lib/motion/number-label.ts";
import assert from "node:assert/strict";
import test from "node:test";

for (const label of [
  "+R 2,780",
  "R 1,250.00",
  "R 284,500",
  "$1,250.00",
  "45,678",
  "4.5%",
  "−12.5%",
  "+8.70%",
  "1.2k",
  "€23.99",
  "0",
]) {
  test(`animated counter restores the exact data label: ${label}`, () => {
    const formatter = numericLabel(label);
    assert.ok(formatter);
    assert.equal(formatter(1), label);
    assert.equal(formatter(2), label);
    assert.notEqual(formatter(0.4), label === "0" ? "not a number" : label);
  });
}
test("non-numeric labels are never rewritten", () => {
  for (const text of ["NOREVA", "2026-11-02", "08:45 AM", "#NRV-01", "42 customers", "Infinity", "NaN"])
    assert.equal(numericLabel(text), null);
});
