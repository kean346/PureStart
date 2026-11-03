import assert from "node:assert/strict";
import test from "node:test";

import { shipments } from "../src/app/(main)/dashboard/logistics/_components/shipment-data.ts";
import { formatCurrency } from "../src/lib/utils.ts";

test("shared currency formatting defaults to rand, including negative and decimal values", () => {
  for (const amount of [0, 12.5, 1234.56, -2845]) {
    const formatted = formatCurrency(amount);
    assert.ok(formatted.includes("R"));
    assert.ok(!/[\u0024€£]|USD/.test(formatted));
  }
});
test("every demo shipment uses coherent regional country codes and coordinates", () => {
  const countries = {
    ZA: "South Africa",
    NA: "Namibia",
    BW: "Botswana",
    MZ: "Mozambique",
    MU: "Mauritius",
    ZM: "Zambia",
    SZ: "Eswatini",
  };
  assert.equal(new Set(shipments.map((shipment) => shipment.id)).size, shipments.length);
  for (const shipment of shipments) {
    for (const location of [shipment.origin, shipment.destination]) {
      assert.equal(location.country, countries[location.countryCode]);
      assert.ok(location.coordinates[0] >= 10 && location.coordinates[0] <= 70);
      assert.ok(location.coordinates[1] >= -35 && location.coordinates[1] <= 0);
    }
  }
  assert.equal(shipments[0].origin.display, "OR Tambo Airport");
  assert.equal(shipments[0].destination.display, "Hosea Kutako Airport");
});
