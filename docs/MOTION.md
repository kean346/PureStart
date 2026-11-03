# NOREVA regional workspace and motion

## Shared motion architecture

`src/lib/motion/dashboard-motion.ts` enhances existing semantic elements through the Web Animations API. It enhances the existing components without requiring a motion library. Regional demo data is maintained separately in each module. The controller detects cards, headings, breadcrumbs, controls, charts, table rows, fields, progress bars, articles, calendar regions, and meaningful panels.

`AnimatedPage` lives in the persistent dashboard layout and resynchronizes the controller on pathname changes. The old keyed template was removed: animation replay no longer needs a forced React remount. Every visit gets fresh tracking, including back/forward navigation. A 120ms content exit runs alongside the router request without delaying navigation or animating the persistent shell.

`ApplicationMotion` applies the same vocabulary to standalone auth, chat, and mail routes. A single overlay controller observes existing Radix dialogs, drawers, popovers, menus, selects, and command results. Existing surface positioning and open/close animations are retained; newly visible children receive a short stagger.

A scoped MutationObserver handles new DOM elements and active tabs/accordions/collapsible panels. Explicit `data-motion-panel` identities support shipment changes that reuse the same DOM. It observes meaningful panel attributes and added elements, not arbitrary text/style changes, mouse movement, or ordinary keystrokes. The Analytics replay action calls the controller instead of replacing the page subtree.

IntersectionObserver defers below-fold sections until they approach the viewport. Each element reveals once within a visit; returning to the page creates a new visit. Table motion is bounded to the first 16 rendered rows per table. Detached nodes, observers, animation frames, and pending animations are cleaned up. Static content remains visible without JavaScript; there are no permanently hidden CSS entrance states.

Entrances use opacity and 8–16px translation, with card scale 0.98→1, approximately 380–540ms durations, and bounded stagger. Charts retain Recharts interactions, supplemented with stroke drawing, area clipping, baseline bar growth, and a circular mask sweep. Home and CRM disable native entry interpolation so the shared controller owns their draw sequence. Individual SVG elements are tracked independently, including areas inserted after the first chart line. Counters preserve exact final formatting and restore their real values on cancellation or reduced-motion changes.

## Theme transitions

The existing circular reveal expands from the active control across the viewport using the native View Transition API. Its revision guard handles overlapping requests. A CSS colour-transition fallback supports browsers without that API. The toggle icon animates independently; neither mechanism restarts the page entrance. The default follows device reduced motion and switches immediately when requested. Appearance settings → Animation supports a persistent Full animation override and an explicit Reduced animation mode. The reveal lasts 1.1 seconds in full mode.

## Regional design changes

NOREVA uses charcoal-black surfaces with Slate accents, original workspace labels and module headings, and a revised Home header and KPI grid. Customer Activity remains, using deterministic fictional visit records. Financial demo amounts use rand throughout, including legacy screens, invoices, products, and commerce. These are native fictional ZAR amounts rather than live exchange-rate conversions.

Shipment data uses Southern African airports, ports, and road hubs with consistent country codes and coordinates. Audience regions, infrastructure locations, fictional clients, invoice addresses, and learning labels were customised. MIT acknowledgements remain intact. No protected UI/calendar component source or application dependency was changed.

Home and CRM use a shared explicit `AnimatedValue` component for KPI counting from zero on each visit. Other numeric cards use the shared element controller. Exact formatted values are restored on completion, interruption, or reduced motion.

## Validation

- Production build and TypeScript: passed.
- Unit tests: 19 passed (data reconciliation, exact numeric formatting, default ZAR currency, and all shipment coordinates/country codes).
- Repository lint: passed with two existing warnings and five informational notices.
- Chromium production browser audit: 24 dashboard routes, including legacy routes, and six standalone auth/chat/mail routes passed without page errors.
- Verified repeated sidebar visits, browser back/forward, scroll reveals once per visit, search isolation, tab changes without KPI remounts, selected shipment panels, dialog children, native radial reveal, simulated unsupported-API fallback, reduced motion, and mobile width.
- Additional visual checks verified appearance controls, rapid navigation, the mobile sidebar, and exact before/after positions and dimensions for all six Home cards. Measured Home CLS was 0.
- The regional browser check sampled Home revenue at R 93,795.22 and R 179,808.44 before the final R 184,250.00, and observed the chart area moving from fully clipped to filled. CRM mutation samples included R 0 before reaching R 2,845,000. It also verified the native screen reveal and a saved Full animation preference on a device requesting reduced motion.
- Current dark Home, CRM, logistics, and mobile screenshots are `artifacts/noreva-regional-*.png`; the recording is `artifacts/noreva-regional-motion.mp4`.

Real Safari/Firefox runs and the live Vercel deployment were not tested. The CSS fallback was tested by disabling the native API in Chromium. Accordion handling follows the existing component conventions; there is no exposed accordion flow in the audited screens to exercise separately.

Run `npm test`, `npm run lint`, and `npm run build` normally. The optional `tests/browser/dashboard-motion.cjs` and `tests/browser/regional-workspace.cjs` harnesses uses an existing Playwright installation and a running production server. Set `PLAYWRIGHT_MODULE` to its module path if it is installed outside the project, `CHROMIUM_PATH` for another Chromium executable, and `BASE_URL` for another server. No browser tooling was added to production dependencies.
