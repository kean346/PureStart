# NOREVA Insights

A fictional analytics and intelligence platform, designed and built by paceIT on the open-source Studio Admin Analytics dashboard. This is a portfolio concept, not a real company or a representation of business results.

NOREVA builds on the Studio Admin component and Recharts foundation with a charcoal workspace, its own navigation and headings, a revised business overview, Southern African demo routes and records, rand-denominated amounts, functional analytics views, CSV export, and coordinated motion across the application. No backend, account, or database is required.

## Run locally

Use Node 24 (validated with 24.19.0) and npm.

```bash
npm ci
npm run dev
```

Open the application root; it redirects to `/dashboard/default` (Home). Both `localhost` and `127.0.0.1` are supported in development. All fonts are locally bundled through the existing Geist package; no Google Fonts network access is needed.

```bash
npm test            # 19 data and numeric-formatting tests
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

The shared motion controller animates meaningful page elements on every route visit and newly opened panels, without forced component remounts. It defers offscreen reveals, bounds table work, preserves exact counter values, and retains native Recharts and Radix interactions. The global theme switch uses a circular reveal with a CSS fallback. The default follows the device reduced-motion setting. Appearance settings → Animation offers Follow device, Full animation, and Reduced animation; the saved Full animation choice enables counting, chart drawing, and the screen reveal even when the device requests reduced motion.

See [the motion architecture and verification report](docs/MOTION.md) for implementation details, tested routes, browser checks, and the charcoal/Slate palette refinements. Existing UI component source and licenses are preserved.

## Deploy to Vercel

Import `kean346/dashboard-2-` into Vercel with the Next.js framework preset, repository root as the project root, Node 24, install command `npm ci`, and build command `npm run build`. No secrets or database are required. This uses the normal Vercel Next.js workflow; the inherited Cloudflare `deploy` script is not needed.

Optionally set `NEXT_PUBLIC_SITE_URL` to the public origin, including `https://`, for canonical metadata. Otherwise the Vercel production-domain variable is used, with `https://noreva.example` as the local fallback. Deploying a preview or production site is a separate action; this task does not publish one.

## Review artifacts

See `artifacts/noreva-desktop.png`, `artifacts/noreva-mobile.png`, `artifacts/noreva-dark.png`, `artifacts/noreva-audience.png`, and `artifacts/noreva-entrance.mp4`. Browser checks cover filters, tabs, campaign switching, export, notifications, About, dark mode, sidebar collapse, mobile navigation, and reduced motion. The ten selected dashboard modules are available in the sidebar with NOREVA titles and a charcoal-black default theme. Existing finance, commerce, academy, infrastructure, file manager, productivity, and CRM layouts are portfolio demo modules, not connected backend services. Logistics includes working status/search/transport filters, route and cargo details, activity milestones, and a downloadable demo manifest. The local world atlas uses Natural Earth public-domain map data, with the world-atlas ISC notice in public/licenses/World-Atlas-ISC.txt.

## Licenses

The original MIT copyright notice remains in [LICENSE](LICENSE); a distribution copy is in `public/licenses/Studio-Admin-MIT.txt`. The existing Geist font files are licensed under the SIL Open Font License, retained in `public/licenses/Geist-OFL.txt`. Recharts is MIT-licensed. No additional application libraries, stock photography, paid features, or proprietary media were added. The monogram and social preview artwork are original typography and geometry.

### Regional workspace and motion update

The ten dashboard modules use original workspace labels, including Business pulse, Client relationships, Money overview, Shipment desk, and Cloud operations. The Home header and KPI proportions have changed while retaining Customer Activity and the customer table. Monetary demo values use ZAR (R), including finance, commerce, products, invoices, CRM, and legacy dashboards. These are fictional rand amounts, not live currency conversions.

Shipment routes now connect Southern African airports, ports, and road hubs, with matching country codes and map coordinates. Regional audience breakdowns, fictional client companies, infrastructure locations, invoice addresses, and learning labels provide further customisation. Patient Monitoring remains removed.

Counters and chart drawing replay on route visits. Home and CRM KPI components count explicitly from zero; the shared controller also handles counters, charts, cards, rows, and panels elsewhere. It tracks individual chart elements so areas mounted after lines still animate. The theme reveal expands across the viewport over 1.1 seconds. Choose **Appearance settings → Animation → Full animation** to enable the sequence when your device requests reduced motion.

Current review images are `artifacts/noreva-regional-home.png`, `noreva-regional-crm.png`, `noreva-regional-logistics.png`, and `noreva-regional-mobile.png`. The screen recording is `artifacts/noreva-regional-motion.mp4`. The targeted `tests/browser/regional-workspace.cjs` check samples actual intermediate counter values and chart clipping, then verifies theme reveal, mobile width, regional routes, and motion preference persistence. See `docs/MOTION.md` for validation scope.
