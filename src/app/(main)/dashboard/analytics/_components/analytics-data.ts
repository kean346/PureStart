export type RangeKey = "7" | "28" | "84";
export const rangeLabels: Record<RangeKey, string> = {
  "7": "Last 7 days",
  "28": "Last 4 weeks",
  "84": "Last 12 weeks",
};
export const number = (value: number) => new Intl.NumberFormat("en-US").format(value);
export const percent = (value: number) => `${value.toFixed(1)}%`;

// Largest-remainder allocation: every displayed breakdown reconciles to its parent total.
export function allocate(total: number, weights: number[]) {
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((weight) => (total * weight) / sum);
  const result = raw.map(Math.floor);
  const order = raw.map((value, i) => ({ i, remainder: value - result[i] })).sort((a, b) => b.remainder - a.remainder);
  const remainder = total - result.reduce((a, b) => a + b, 0);
  for (let i = 0; i < remainder; i++) result[order[i].i]++;
  return result;
}

const totals = {
  visitors: 184290,
  sessions: 236840,
  pageviews: 492680,
  engaged: 160578,
  conversions: 15158,
  active: 38420,
};
type Metric = keyof typeof totals;
const metrics = Object.keys(totals) as Metric[];
const dailyWeights = Array.from({ length: 28 }, (_, i) => 80 + ((i * 17) % 29) + i * 1.4 + Math.sin(i * 0.8) * 12);
const blocks = Array.from({ length: 6 }, (_, block) => {
  const scale = [0.66, 0.72, 0.79, 0.85, 0.92, 1][block];
  const values = Object.fromEntries(
    metrics.map((key) => [
      key,
      allocate(
        Math.round(totals[key] * scale * (key === "engaged" || key === "conversions" ? 1 - (5 - block) * 0.025 : 1)),
        dailyWeights.map((weight, i) =>
          key === "engaged"
            ? weight * (1 + Math.sin(i * 0.62 + block * 0.12) * 0.09 + (((i * 11 + block * 3) % 17) - 8) * 0.009)
            : weight,
        ),
      ),
    ]),
  ) as Record<Metric, number[]>;
  return dailyWeights.map((_, i) => ({
    date: new Date(Date.UTC(2026, 10, 2 - 168 + block * 28 + i)).toISOString().slice(0, 10),
    ...(Object.fromEntries(metrics.map((key) => [key, values[key][i]])) as Record<Metric, number>),
  }));
}).flat();
function sum(rows: typeof blocks) {
  return Object.fromEntries(metrics.map((key) => [key, rows.reduce((total, row) => total + row[key], 0)])) as Record<
    Metric,
    number
  >;
}
function breakdown(total: number, names: string[], weights: number[]) {
  return allocate(total, weights).map((value, index) => ({ name: names[index], value }));
}
export function getAnalytics(range: RangeKey) {
  const days = Number(range);
  const daily = blocks.slice(-days);
  const current = sum(daily);
  const previousDaily = blocks.slice(-days * 2, -days);
  const previous = sum(previousDaily);
  const engagement = (current.engaged / current.sessions) * 100;
  const conversion = (current.conversions / current.sessions) * 100;
  const sources = breakdown(
    current.visitors,
    ["Organic search", "Direct", "Paid search", "Referral", "Email"],
    [42, 26, 16, 10, 6],
  );
  const paid = sources[2].value;
  const referral = sources[3].value;
  return {
    range,
    days,
    daily,
    previousDaily,
    current,
    previous,
    engagement,
    conversion,
    period: `${daily[0].date} — ${daily[daily.length - 1].date}`,
    sources,
    campaigns: breakdown(
      paid,
      ["Insights launch", "Intelligence for teams", "Autumn retargeting", "Brand discovery", "Partner spotlight"],
      [34, 26, 19, 13, 8],
    ),
    referrers: breakdown(
      referral,
      ["northstar.example", "fieldwork.example", "stackwise.example", "folio.example", "Other referrals"],
      [38, 25, 18, 12, 7],
    ),
    countries: breakdown(
      current.visitors,
      ["United States", "United Kingdom", "Germany", "Canada", "South Africa", "Other regions"],
      [38, 21, 15, 11, 8, 7],
    ),
    devices: breakdown(current.sessions, ["Desktop", "Mobile", "Tablet"], [68, 27, 5]),
    pages: breakdown(
      current.pageviews,
      ["/", "/insights", "/pricing", "/guides/getting-started", "/customers", "Other pages"],
      [30, 24, 18, 13, 9, 6],
    ).map((page, i) => ({ ...page, time: [192, 248, 128, 284, 156, 112][i] })),
    funnel: [
      { name: "Sessions", value: current.sessions },
      { name: "Engaged sessions", value: current.engaged },
      { name: "Trial started", value: Math.round(current.sessions * 0.14) },
      { name: "Workspace activated", value: current.conversions },
    ],
    kpis: [
      { label: "Unique visitors", value: current.visitors, previous: previous.visitors, rate: false },
      { label: "Sessions", value: current.sessions, previous: previous.sessions, rate: false },
      { label: "Pageviews", value: current.pageviews, previous: previous.pageviews, rate: false },
      {
        label: "Engagement rate",
        value: engagement,
        previous: (previous.engaged / previous.sessions) * 100,
        rate: true,
      },
      {
        label: "Conversion rate",
        value: conversion,
        previous: (previous.conversions / previous.sessions) * 100,
        rate: true,
      },
    ],
  };
}
export type AnalyticsData = ReturnType<typeof getAnalytics>;
export const snapshot = {
  minutes: Array.from({ length: 30 }, (_, i) => ({ minute: i + 1, visitors: 18 + ((i * 13) % 25) })),
  countries: [
    { name: "United States", flag: "US", value: 21 },
    { name: "United Kingdom", flag: "GB", value: 9 },
    { name: "Germany", flag: "DE", value: 7 },
    { name: "South Africa", flag: "ZA", value: 5 },
  ],
};
snapshot.minutes[29].visitors = 42;
export const activity = [
  {
    name: "Mira Ellery",
    email: "mira@northstar.example",
    company: "Northstar Labs",
    action: "Activated a workspace",
    time: "10:42 UTC",
    status: "Activated",
  },
  {
    name: "Jonah Vale",
    email: "jonah@fieldwork.example",
    company: "Fieldwork",
    action: "Started an Insights trial",
    time: "10:38 UTC",
    status: "Trial",
  },
  {
    name: "Ada Rowan",
    email: "ada@stackwise.example",
    company: "Stackwise",
    action: "Invited a teammate",
    time: "10:31 UTC",
    status: "Engaged",
  },
];
