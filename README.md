# Winglo Cleaning Services — interactive demo

A browser-local cleaning business demo customised from the existing Studio Admin / NOREVA dashboard. The original layout, UI primitives, calendar styling, typography, theme switcher and motion system are retained. No backend or messaging provider is connected.

## Develop

Use Node 24 (validated with 24.19.0) and npm:

```sh
npm ci
npm run dev
```

The application root redirects to `/dashboard/default`. The sidebar exposes Overview, Enquiries, Quotations, Bookings, Customers and Settings. `/enquire` is a separate customer-facing demo form.

Choose **Start Demo** on Overview to follow the actual simulator → enquiry → quotation review → simulated acceptance → booking → calendar → customer history → reminder preview workflow. Each stage uses the same records as the six management screens. The walkthrough can be exited at any point; saved records remain.

## Demo behaviour

- A Zustand store persists linked customers, enquiries, quotes, bookings and settings under `winglo-demo-v1` in localStorage. A hydration gate avoids server/client mismatches. Storage failures display a warning. Settings includes a confirmed reset action.
- Five central service-specific question sets power both the simulator and customer form. Customers are matched by normalised contact number or email where possible. Photo attachments are previews only (three images up to 5 MB each); they are never uploaded or retained.
- Central sample pricing: base + size adjustment + extras package + travel − discount, floored at zero, then configurable VAT. VAT starts at 0%; no Winglo VAT registration or real price approval is assumed. Settings affect new estimates; saved quotes retain their reviewed values.
- Quote status, owner approval, send and customer acceptance are simulations. Accepted quotes convert once into linked bookings. Print / PDF opens a printable quotation; choose **Save as PDF** in the browser print dialog. No PDF service or additional dependency is used.
- Bookings support month/week calendar views, editing, rescheduling, cleaner assignment, duration, job value and status. Overlapping non-cancelled assignments to the same cleaner are rejected; adjacent jobs are allowed. Completed jobs update customer history and the revenue chart/KPI.
- Dates are relative to initial demo creation/reset. Times use the browser's local timezone. All seed identities and contacts are fictional. Revenue means the value of completed demo jobs, not verified payments or accounting revenue.
- All six editable automation templates support `{name}`, `{service}` and `{date}`. Previews and simulations send nothing. There are no application calls to WhatsApp, email, SMS or paid services.
- Customer submissions from another browser/device do **not** reach an owner elsewhere. This is local storage, not shared business infrastructure.

## Architecture

Feature code lives in `src/app/(main)/dashboard/_components/winglo/`. `model.ts` owns domain types, seed data, question sets, pricing and overlap calculations. `store.ts` is the single persistence/mutation boundary. Forms, editors, overview, booking calendar and settings compose the existing shared primitives. Route pages remain small server components.

A future database/API adapter should replace the local persistence boundary and add authentication, authorisation, validation, shared record IDs, concurrency handling and server-side scheduling checks. Messaging, PDF delivery, real customer consent, pricing approval and payment/accounting integrations are separate production work. No secret values belong in browser storage.

## Validation

```sh
npm test
npx tsc --noEmit
npm run build
npm run lint
npm run check
```

Run Next.js once before a standalone type check on a fresh checkout so its image and route declarations are generated. Browser tests use an available Playwright installation and Chromium, without adding application dependencies:

```sh
BASE_URL=http://127.0.0.1:3000 PLAYWRIGHT_MODULE=/path/to/playwright node tests/browser/winglo-workflow.cjs
BASE_URL=http://127.0.0.1:3000 PLAYWRIGHT_MODULE=/path/to/playwright node tests/browser/winglo-actions.cjs
```

The workflow test covers the guided flow, all six sections, dynamic service forms, deduplication, completed jobs, refresh persistence, reset, theme switching and mobile navigation/width. The actions test covers editable pricing/VAT/staff, quotation prefilling, printable output, week calendar view, cleaner conflicts and enquiry status filters. Review images are `artifacts/winglo-desktop.png`, `artifacts/winglo-dark.png` and `artifacts/winglo-mobile.png`.

The inherited regional/motion browser scripts target the previous NOREVA screens and are historical verification artifacts, not Winglo acceptance tests. Existing repository-wide formatting issues in the world map JSON and regional data test are outside this feature.

## Licences

The original MIT notice remains in [LICENSE](LICENSE), with a distribution copy at `public/licenses/Studio-Admin-MIT.txt`. Bundled Geist fonts retain their SIL Open Font License at `public/licenses/Geist-OFL.txt`. The existing map data and licensing notices are retained. No original Dashboard 2 repository or deployment is changed by this work.
