# NOREVA motion and approved visual refinements

## Shared motion architecture

`src/lib/motion/dashboard-motion.ts` enhances existing semantic elements through the Web Animations API. It does not replace components, change their data, or require a motion library. The controller detects cards, headings, breadcrumbs, controls, charts, table rows, fields, progress bars, articles, calendar regions, and meaningful panels.

`AnimatedPage` lives in the persistent dashboard layout and resynchronizes the controller on pathname changes. The old keyed template was removed: animation replay no longer needs a forced React remount. Every visit gets fresh tracking, including back/forward navigation. A 120ms content exit runs alongside the router request without delaying navigation or animating the persistent shell.

`ApplicationMotion` applies the same vocabulary to standalone auth, chat, and mail routes. A single overlay controller observes existing Radix dialogs, drawers, popovers, menus, selects, and command results. Existing surface positioning and open/close animations are retained; newly visible children receive a short stagger.

A scoped MutationObserver handles new DOM elements and active tabs/accordions/collapsible panels. Explicit `data-motion-panel` identities support shipment changes that reuse the same DOM. It observes meaningful panel attributes and added elements, not arbitrary text/style changes, mouse movement, or ordinary keystrokes. The Analytics replay action calls the controller instead of replacing the page subtree.

IntersectionObserver defers below-fold sections until they approach the viewport. Each element reveals once within a visit; returning to the page creates a new visit. Table motion is bounded to the first 16 rendered rows per table. Detached nodes, observers, animation frames, and pending animations are cleaned up. Static content remains visible without JavaScript; there are no permanently hidden CSS entrance states.

Entrances use opacity and 8–16px translation, with card scale 0.98→1, approximately 380–540ms durations, and bounded stagger. Charts retain Recharts interactions and native interpolation, supplemented with stroke drawing, area clipping, baseline bar growth, and a circular mask sweep. Counters preserve exact final formatting and restore their real values on cancellation or reduced-motion changes.

## Theme transitions

The existing circular reveal expands from the active control across the viewport using the native View Transition API. Its revision guard handles overlapping requests. A CSS colour-transition fallback supports browsers without that API. The toggle icon animates independently; neither mechanism restarts the page entrance. Reduced motion switches immediately.

## Approved design changes

Only the default NOREVA palette was refined. Primary accents use Slate 800 in light mode and Slate 200 in dark mode. Existing chart shades use corresponding Slate 300/500/700 tones. A 2px inset Slate 400 edge marks active navigation. The existing monogram uses the primary colour and the existing paceIT attribution uses the foreground colour.

The optional card-outline change was not applied. Backgrounds, card surfaces, dimensions, fonts, labels, data, navigation, and alternate presets were preserved. No protected UI/calendar component source or application dependency was changed.

## Validation

- Production build and TypeScript: passed.
- Unit tests: 14 passed (data reconciliation and exact numeric formatting).
- Repository lint: passed with two existing warnings and five informational notices.
- Chromium production browser audit: 24 dashboard routes, including legacy routes, and six standalone auth/chat/mail routes passed without page errors.
- Verified repeated sidebar visits, browser back/forward, scroll reveals once per visit, search isolation, tab changes without KPI remounts, selected shipment panels, dialog children, native radial reveal, simulated unsupported-API fallback, reduced motion, and mobile width.
- Additional visual checks verified appearance controls, rapid navigation, the mobile sidebar, and exact before/after positions and dimensions for all six Home cards. Measured Home CLS was 0.
- Reviewed light, dark, and mobile screenshots in `artifacts/noreva-refined-*.png` and recorded navigation/theme transitions in `artifacts/noreva-motion-system.mp4`.

Real Safari/Firefox runs and the live Vercel deployment were not tested. The CSS fallback was tested by disabling the native API in Chromium. Accordion handling follows the existing component conventions; there is no exposed accordion flow in the audited screens to exercise separately.

Run `npm test`, `npm run lint`, and `npm run build` normally. The optional `tests/browser/dashboard-motion.cjs` harness uses an existing Playwright installation and a running production server. Set `PLAYWRIGHT_MODULE` to its module path if it is installed outside the project, `CHROMIUM_PATH` for another Chromium executable, and `BASE_URL` for another server. No browser tooling was added to production dependencies.
