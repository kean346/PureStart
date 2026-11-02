# NOREVA Insights

A fictional analytics and intelligence platform, designed and built by paceIT on the open-source Studio Admin Analytics dashboard. This is a portfolio concept, not a real company or a representation of business results.

The original Analytics composition, sidebar, component primitives, and Recharts foundation are retained. NOREVA adds original branding, a deterministic dataset, functional analytics tabs and date ranges, CSV export, and a coordinated entrance sequence. No backend, account, or database is required.

## Run locally

Use Node 24 (validated with 24.19.0) and npm.

```bash
npm ci
npm run dev
```

Open the application root; it redirects to `/dashboard/analytics`. Both `localhost` and `127.0.0.1` are supported in development. All fonts are locally bundled through the existing Geist package; no Google Fonts network access is needed.

```bash
npm test            # Five deterministic data-consistency tests
npx tsc --noEmit    # Type check
npm run build      # Production build
npm start          # Production server
```

## Demo behavior

- The fixed dataset ends November 1, 2026 (UTC). Choose 7, 28, or 84 days; every range uses the same daily records and an equally sized preceding comparison period.
- Default totals: 184,290 visitors, 236,840 sessions, 492,680 pageviews, 160,578 engaged sessions, 15,158 activations, and 38,420 active product users. Displayed rates round to 67.8% engagement and 6.4% conversion.
- Both rates use sessions as the denominator. A conversion is a workspace activation. Active users are a subset of visitors. Synthetic visitor cohorts are disjoint between days, so their daily counts reconcile with the range total.
- Device sessions, first-touch visitor sources, regional visitors, and pageviews each reconcile to their own parent total using largest-remainder allocation. Campaigns partition paid-search visitors; referrers partition referral visitors. Displayed percentages and abbreviated chart labels are rounded; CSV exports retain exact counts.
- Realtime visitors, customer activity, and notifications are clearly labeled fixed snapshots, independent of the selected historical range. Their people and `.example` addresses are fictional.
- All five analytics tabs work. Exports download real CSV files. Sharing copies the current URL with its view and date range. Notifications mark themselves read locally; no messages are sent. Account and About controls describe the demo without pretending to provide authentication or billing.

## Motion and accessibility

CSS entrance timing coordinates the shell, staggered KPI cards, trends, and rows. Recharts draws the traffic line and area, expands horizontal bars, and draws the device donut. Realtime bars grow from the baseline with a small stagger. Counters animate for 850ms, chart animations take 850–1000ms, and the overall reveal completes in about 1.6 seconds. The actions menu can replay the dashboard entrance.

`prefers-reduced-motion` disables CSS entrances, chart interpolation, and number counting. Fixed chart heights and tabular numerals keep the layout stable. Existing keyboard-accessible Radix controls and responsive sidebar behavior are retained.

## Deploy to Vercel

Import `kean346/dashboard-2-` into Vercel with the Next.js framework preset, repository root as the project root, Node 24, install command `npm ci`, and build command `npm run build`. No secrets or database are required. This uses the normal Vercel Next.js workflow; the inherited Cloudflare `deploy` script is not needed.

Optionally set `NEXT_PUBLIC_SITE_URL` to the public origin, including `https://`, for canonical metadata. Otherwise the Vercel production-domain variable is used, with `https://noreva.example` as the local fallback. Deploying a preview or production site is a separate action; this task does not publish one.

## Review artifacts

See `artifacts/noreva-desktop.png`, `artifacts/noreva-mobile.png`, `artifacts/noreva-dark.png`, `artifacts/noreva-audience.png`, and `artifacts/noreva-entrance.mp4`. Browser checks cover filters, tabs, campaign switching, export, notifications, About, dark mode, sidebar collapse, mobile navigation, and reduced motion. The original unrelated template routes remain in source, outside NOREVA's curated navigation.

## Licenses

The original MIT copyright notice remains in [LICENSE](LICENSE); a distribution copy is in `public/licenses/Studio-Admin-MIT.txt`. The existing Geist font files are licensed under the SIL Open Font License, retained in `public/licenses/Geist-OFL.txt`. Recharts is MIT-licensed. No additional application libraries, stock photography, paid features, or proprietary media were added. The monogram and social preview artwork are original typography and geometry.
