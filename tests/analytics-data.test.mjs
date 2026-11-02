import { allocate, getAnalytics, snapshot } from "../src/app/(main)/dashboard/analytics/_components/analytics-data.ts";
import assert from "node:assert/strict";
import test from "node:test";

for (const range of ["7", "28", "84"]) {
  test(`${range}-day range reconciles every breakdown and funnel`, () => {
    const data = getAnalytics(range);
    const total = (rows) => rows.reduce((sum, row) => sum + row.value, 0);
    assert.equal(total(data.sources), data.current.visitors);
    assert.equal(total(data.countries), data.current.visitors);
    assert.equal(total(data.devices), data.current.sessions);
    assert.equal(total(data.pages), data.current.pageviews);
    assert.equal(total(data.campaigns), data.sources[2].value);
    assert.equal(total(data.referrers), data.sources[3].value);
    for (const metric of Object.keys(data.current)) {
      assert.equal(
        data.daily.reduce((sum, row) => sum + row[metric], 0),
        data.current[metric],
      );
      assert.equal(
        data.previousDaily.reduce((sum, row) => sum + row[metric], 0),
        data.previous[metric],
      );
    }
    for (let i = 1; i < data.funnel.length; i++) assert.ok(data.funnel[i].value <= data.funnel[i - 1].value);
    for (const row of [...data.daily, ...data.previousDaily]) {
      assert.ok(row.engaged <= row.sessions);
      assert.ok(row.conversions <= row.engaged);
      assert.ok(row.active <= row.visitors);
      assert.ok(row.visitors <= row.sessions);
    }
    assert.equal(data.engagement, (data.current.engaged / data.current.sessions) * 100);
    assert.equal(data.conversion, (data.current.conversions / data.current.sessions) * 100);
    assert.deepEqual(data, getAnalytics(range));
    assert.equal(data.daily.length, Number(range));
    assert.ok(data.previousDaily.at(-1).date < data.daily[0].date);
  });
}
test("default period matches the fictional brief and changes with range", () => {
  assert.deepEqual(getAnalytics("28").current, {
    visitors: 184290,
    sessions: 236840,
    pageviews: 492680,
    engaged: 160578,
    conversions: 15158,
    active: 38420,
  });
  assert.equal(getAnalytics("28").engagement.toFixed(1), "67.8");
  assert.equal(getAnalytics("28").conversion.toFixed(1), "6.4");
  assert.ok(getAnalytics("7").current.sessions < getAnalytics("28").current.sessions);
  assert.ok(getAnalytics("84").current.sessions > getAnalytics("28").current.sessions);
});
test("allocation preserves integers and the realtime snapshot reconciles", () => {
  for (const total of [0, 1, 11, 100, 184290])
    assert.equal(
      allocate(total, [42, 26, 16, 10, 6]).reduce((a, b) => a + b, 0),
      total,
    );
  assert.equal(
    snapshot.countries.reduce((sum, row) => sum + row.value, 0),
    snapshot.minutes.at(-1).visitors,
  );
});
