# PureStart OS · concept by paceIT

The homepage opens PureStart at `/purestart`. The existing `/dashboard/*`, `/enquire` and Winglo storage are preserved. No dependency or lockfile changes are needed.

## Run locally

Use Node 24. From the checkout:

```sh
npm ci
npm run dev
```

Open the `/purestart` path on the development server. Existing `npm run build` and `npm start` commands also serve this application. `vercel.json` already supports Next.js builds, but no deployment was created or updated during implementation. A public preview needs a separately provisioned deployment pointing at this repository and the `/purestart` path. Keep existing client deployments separate.

## Explore

First visit opens the welcome experience. Choose **Explore PureStart OS** or **Take a Guided Tour**. The header help icon reopens the welcome. The sidebar tour button (or the Guided tour button on secondary pages) restarts the optional tour. Tour state survives in-app navigation; a full browser reload exits the tour without losing business data. Next/Back navigate actual routes, and the order step waits until PS-1042 has been collected. Skip exits at any time. The outlined section is the current spotlight; the tour does not lock the page.

**Try a Live Example** opens the ordinary order PS-1042. Use its next-action button to move Scheduled → Collected → Processing → Ready for Delivery → Out for Delivery → Delivered. Each transition updates the order, recorded progress, scheduling completion, derived overview/insights and a simulated notification. **Reset Example** restores only this order and removes its invoice and notification events. It leaves other customers, orders, bookings and settings intact.

The nine modules include searchable/filterable orders; multiple service items; calculated minimum/fee totals; customer creation/editing and notes; day/week collection and delivery planning; optional driver assignments with 30-minute conflict checks; weekly/fortnightly/monthly recurring generation; six selectable automation simulations; invoice previews and simulated paid/unpaid changes; derived charts; and editable example rates, fees, minimums and hours. Create/reschedule stops by creating/editing their order. Unassigned stops may overlap. Issued orders are locked against editing so their invoice details stay stable.

**Settings → Reset All Demo Data → Confirm reset all data** clears only PureStart's fictional data in this browser. Cancel preserves changes. The welcome dismissal is retained on reset.

## Data and boundaries

- Central types, runtime Zod schema, deterministic transition functions, pricing and analytics: `src/app/purestart/_components/model.ts`.
- Zustand persistence boundary: `store.ts`, localStorage key `purestart-os-v1`. Hydration runs only in the browser. Storage errors are surfaced. Data is isolated per browser; simultaneous tabs are not synchronised.
- Next.js server route validates the nine paths and composes the client application. Orders have deep links under `/purestart/orders/<id>`.
- Scoped semantic tokens in `globals.css` keep PureStart light regardless of the inherited workspace theme. Existing UI primitives and bundled Geist fonts are reused without modifications. Motion honours reduced-motion preferences.
- Revenue charts and paid totals use payment dates; invoice/outstanding totals use invoice issue dates; order statistics use order creation dates. Pending value excludes invoiced orders. These are simulated payments, not bank transactions. Changing rates never recalculates historical invoices.
- All identities are fictional, contact emails use example.com, and dates are relative to initial seed/reset. Times follow the browser timezone. Prices are examples, not verified official PureStart rates. No VAT registration or VAT charge is assumed. Printed invoices are labelled **Not a tax invoice**.

## Simulations and limitations

No messages, payments, live GPS, route optimisation, production login or external APIs are connected. Automation records previews locally; replaying a simulation deliberately creates another log. Recurring bookings generate only on request (not a background scheduler), one order per occurrence, and move the rule forward. Monthly dates clamp to the next month's available day. Scheduling offers day/week stop cards rather than drag-and-drop or fleet routing. Service categories are predefined; settings edit their unit rates. Print / Save as PDF uses the browser print dialog. The guided tour uses an outlined real section and a docked panel instead of dimming the entire interface.

Production requires authenticated roles, a persistent backend, server-side validation/concurrency control, real pricing/tax approval, payments/webhooks and reconciliation, an official messaging provider with consent and approved templates/costs, notification delivery tracking, driver operations and an operational recurring scheduler. No such integration is needed to explore this demo.

## Validation

```sh
# Runs each individual test, including all 10 PureStart domain tests:
node --experimental-strip-types --test --test-isolation=none tests/*.test.mjs
npx tsc --noEmit
npm run lint
npm run build

# Existing runtime Playwright/Chromium; no application dependency additions:
BASE_URL=http://127.0.0.1:3000 node tests/browser/purestart.cjs
```

If Playwright is not globally resolvable, set `PLAYWRIGHT_MODULE` to an existing Playwright module and use the available `/usr/bin/chromium`. Screenshots and PDF output go to `/tmp/purestart-artifacts` by default (`PURESTART_ARTIFACTS` overrides it). The browser test covers welcome/dismissal; persistence; the complete order journey; recorded notifications; isolated reset; tour gate/back/next/completion/restart/skip; automation logging; create/edit orders; multiple items; invoice preview/payment; recurring creation/generation; customers; settings/history; confirmed global reset; preservation of Winglo; 360/390/768px route overflow checks; and mobile navigation/tour actions. Screenshots in `artifacts/purestart/` show the implemented UI.

Repository-wide `npm run check` already had formatting in `public/maps/countries-110m.json` and import-order issues in `tests/regional-data.test.mjs` before this feature. They are unrelated and left intact. No tests are represented as passing unless actually executed; see the handoff report for final results.

### Recorded verification

- 32 individual domain/regression tests passed (10 for PureStart, 22 existing tests), no skips or failures.
- Standalone TypeScript check and Next.js production build passed.
- Full repository lint completed successfully with warnings (including inherited warnings and stylistic suggestions in the new code).
- Full repository check reports exactly the two pre-existing map-format/import-order errors identified above.
- Production browser acceptance passed all workflow groups, mobile/tablet sizes, and no page errors. Chromium generated a one-page invoice PDF; text extraction verified the invoice title, disclaimer, customer/items/total and exclusion of dashboard navigation.
- Screenshot artifacts were inspected on desktop and mobile. Existing Winglo overview entry controls were verified alongside PureStart.
