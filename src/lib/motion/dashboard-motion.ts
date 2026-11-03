import { numericLabel } from "@/lib/motion/number-label";
import { motionPreferenceEvent, motionReduced } from "@/lib/motion/preference";
/** DOM enhancement only: React owns the components, their state, data and layout. */
export const motionEase = "cubic-bezier(0.16, 1, 0.3, 1)";
const targets =
  '.noreva-funnel, article, [data-slot="breadcrumb"], [data-slot="button"], [data-slot="select-trigger"], [data-motion-calendar] > *, [data-motion-calendar] [role="gridcell"], [data-slot="field-error"], [role="alert"], h1, h2, [data-slot="card"], [data-slot="chart"], [data-slot="card-action"], [data-slot="card-title"], [data-slot="card-description"], [data-slot="table-header"], tbody > tr, [data-slot="tabs-list"], [data-slot="field"], [data-slot="input-group"], [data-slot="alert"], [data-slot="empty"], [data-slot="progress"], [data-slot="accordion-content"], [data-slot="collapsible-content"], [data-motion-section], .noreva-logistics button[aria-pressed], [data-slot="calendar"], [data-slot="resizable-panel"], iframe, form > div';
let motionSequence = 0;
const panels =
  '[data-motion-panel], [role="tabpanel"], [data-slot="tabs-content"], [data-slot="accordion-content"], [data-slot="collapsible-content"]';
const overlaySelector =
  '[data-slot="dialog-content"], [data-slot="sheet-content"], [data-slot="popover-content"], [data-slot="dropdown-menu-content"], [data-slot="select-content"], [data-slot="tooltip-content"], [data-slot="hover-card-content"]';

function shown(node: Element) {
  return !node.closest('[hidden], [inert], [data-state="inactive"]') && node.getClientRects().length > 0;
}

/** Each controller is scoped to one visit, or one persistent overlay host. */
export function createMotionController(root: HTMLElement, overlays = false) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const seen = new WeakSet<Element>();
  const watched = new WeakSet<Element>();
  const charts = new WeakSet<Element>();
  const numbers = new WeakSet<Element>();
  const animations = new Set<Animation>();
  const counterStops = new Set<() => void>();
  let disposed = false;
  let frame = 0;
  let queued = new Set<Element>();
  let panelQueue = new Set<Element>();

  function animate(node: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    if (motionReduced() || disposed || typeof node.animate !== "function") return;
    const animation = node.animate(keyframes, { duration: 500, easing: motionEase, fill: "backwards", ...options });
    animations.add(animation);
    void animation.finished.catch(() => undefined).finally(() => animations.delete(animation));
    node.setAttribute("data-motion-run", String(++motionSequence));
  }

  function count(node: Element, delay: number) {
    if (
      numbers.has(node) ||
      motionReduced() ||
      node.closest('[data-motion-counter="managed"]') ||
      node.querySelector('[data-motion-counter="managed"]')
    )
      return;
    if (node.childNodes.length !== 1 || node.firstChild?.nodeType !== Node.TEXT_NODE) return;
    const text = node.firstChild as Text;
    const actual = text.data;
    const formatter = numericLabel(actual.trim());
    if (!formatter) return;
    numbers.add(node);
    let raf = 0;
    let start = 0;
    let last = actual;
    const stop = () => {
      cancelAnimationFrame(raf);
      if (text.data === last) text.data = actual;
      counterStops.delete(stop);
    };
    counterStops.add(stop);
    const tick = (time: number) => {
      if (!node.isConnected || text.data !== last || disposed || motionReduced()) {
        stop();
        return;
      }
      if (!start) start = time;
      const p = Math.min(1, Math.max(0, (time - start - delay) / 1400));
      last = formatter(1 - (1 - p) ** 3);
      text.data = last;
      if (p < 1) raf = requestAnimationFrame(tick);
      else stop();
    };
    raf = requestAnimationFrame(tick);
  }

  function drawChart(chart: Element) {
    if (motionReduced()) return;
    const curves = chart.querySelectorAll<SVGPathElement>(".recharts-line-curve, .recharts-area-curve");
    const bars = chart.querySelectorAll<SVGGraphicsElement>(".recharts-bar-rectangle");
    const sectors = chart.querySelectorAll(".recharts-pie, .recharts-radial-bar");
    if (!curves.length && !bars.length && !sectors.length) return; // Recharts may mount after sizing.
    curves.forEach((curve) => {
      if (charts.has(curve)) return;
      const length = curve.getTotalLength();
      if (length <= 0) return;
      charts.add(curve);
      animate(curve, [{ strokeDasharray: `0 ${length}` }, { strokeDasharray: `${length} ${length}` }], {
        duration: 1500,
        delay: 150,
      });
    });
    chart.querySelectorAll(".recharts-area-area").forEach((area) => {
      if (charts.has(area)) return;
      charts.add(area);
      animate(
        area,
        [
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0% 0 0)", opacity: 1 },
        ],
        { duration: 1500, delay: 150 },
      );
    });
    bars.forEach((bar, i) => {
      if (charts.has(bar)) return;
      charts.add(bar);
      const box = bar.getBBox();
      const horizontal = box.width > box.height * 2;
      animate(
        bar,
        [
          {
            transform: horizontal ? "scaleX(0)" : "scaleY(0)",
            transformOrigin: horizontal ? "left center" : "center bottom",
            transformBox: "fill-box",
          },
          {
            transform: "scale(1)",
            transformOrigin: horizontal ? "left center" : "center bottom",
            transformBox: "fill-box",
          },
        ],
        { duration: 1300, delay: 120 + Math.min(i, 20) * 14 },
      );
    });
    // Existing Recharts sector interpolation remains responsible for drawing each arc.
    sectors.forEach((sector) => {
      if (charts.has(sector)) return;
      charts.add(sector);
      animate(
        sector,
        [
          {
            "--motion-angle": "0deg",
            maskImage: "conic-gradient(from -90deg, black var(--motion-angle), transparent 0)",
          },
          {
            "--motion-angle": "360deg",
            maskImage: "conic-gradient(from -90deg, black var(--motion-angle), transparent 0)",
          },
        ],
        { duration: 900, delay: 100 },
      );
    });
    chart
      .querySelectorAll(".recharts-legend-wrapper, .recharts-cartesian-axis, .recharts-cartesian-grid")
      .forEach((node) => {
        if (charts.has(node)) return;
        charts.add(node);
        animate(node, [{ opacity: 0 }, { opacity: 1 }], { duration: 450, delay: 100 });
      });
  }

  function reveal(node: Element) {
    if (seen.has(node) || !shown(node) || disposed) return;
    seen.add(node);
    if (motionReduced()) return;
    const slot = node.getAttribute("data-slot");
    if (slot === "chart") {
      drawChart(node);
      return;
    }
    if (node.matches(".noreva-funnel")) {
      animate(
        node,
        [
          { transform: "scaleX(0)", transformOrigin: "left" },
          { transform: "scaleX(1)", transformOrigin: "left" },
        ],
        { duration: 1300, delay: 120 },
      );
      return;
    }
    if (slot === "progress") {
      const bar = node.firstElementChild;
      if (bar) animate(bar, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0)" }], { duration: 1300 });
      return;
    }
    if (slot === "button" || slot === "select-trigger") {
      animate(node, [{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: 0 });
      return;
    }
    const isCard = slot === "card" || node.matches("article");
    const isRow = node.matches("tbody > tr");
    const parent = node.parentElement;
    const index = parent ? [...parent.children].indexOf(node) : 0;
    // Limit row work to the visible page, never thousands of records.
    if (isRow && index >= 16) return;
    const insideCard =
      !isCard &&
      (!!node.closest('[data-slot="card"]') ||
        !!node.querySelector('[data-slot="card"]') ||
        node.matches('[role="gridcell"]'));
    const title = node.matches("h1, h2");
    let delay = 80;
    if (title) delay = 0;
    if (isCard) delay = 120 + Math.min(index, 5) * 70;
    if (isRow) delay = 100 + Math.min(index, 11) * 45;
    animate(
      node,
      [
        {
          opacity: 0,
          transform: insideCard && !isRow ? "none" : `translateY(${isRow ? 8 : 16}px)${isCard ? " scale(0.98)" : ""}`,
        },
        { opacity: 1, transform: insideCard && !isRow ? "none" : "translateY(0) scale(1)" },
      ],
      { delay, duration: isRow ? 380 : 540 },
    );
    if (title && node.nextElementSibling?.matches("p"))
      animate(
        node.nextElementSibling,
        [
          { opacity: 0, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { delay: 100, duration: 400 },
      );
    if (isCard) {
      node.querySelectorAll(".text-xl, .text-2xl, .text-3xl, .text-4xl").forEach((number) => {
        count(number, delay + 80);
      });
      node.querySelectorAll('[data-slot="badge"]').forEach((badge) => {
        animate(badge, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: delay + 450 });
      });
    }
  }

  const intersection =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                intersection?.unobserve(entry.target);
                reveal(entry.target);
              }
            });
          },
          { rootMargin: "0px 0px 24px 0px", threshold: 0.04 },
        )
      : null;

  function watch(node: Element) {
    if (seen.has(node) || watched.has(node) || !shown(node)) return;
    watched.add(node);
    if (motionReduced()) {
      seen.add(node);
      return;
    }
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) reveal(node);
    else if (intersection) intersection.observe(node);
    else reveal(node);
  }

  function scan(scope: Element) {
    if (disposed || !scope.isConnected) return;
    if (overlays) {
      const found = scope.matches(overlaySelector) ? [scope] : [...scope.querySelectorAll(overlaySelector)];
      found.forEach((overlay) => {
        if (seen.has(overlay) || !shown(overlay)) return;
        seen.add(overlay);
        // Radix already animates its surfaces; add a short child stagger without overriding positioning.
        overlay
          .querySelectorAll(
            '[role^="menuitem"], [role="option"], [data-slot="dialog-header"], [data-slot="field"], [data-slot="popover-content"] > *',
          )
          .forEach((node, i) => {
            seen.add(node);
            animate(
              node,
              [
                { opacity: 0, transform: "translateY(5px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 240, delay: Math.min(i, 6) * 25 },
            );
          });
      });
      const itemSelector = '[data-slot="command-item"], [role^="menuitem"], [role="option"], [data-slot="field-error"]';
      const items = scope.matches(itemSelector) ? [scope] : [...scope.querySelectorAll(itemSelector)];
      items.forEach((item, index) => {
        if (!seen.has(item) && shown(item) && item.closest(overlaySelector)) {
          seen.add(item);
          animate(
            item,
            [
              { opacity: 0, transform: "translateY(4px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 220, delay: Math.min(index, 5) * 20 },
          );
        }
      });
      return;
    }
    if (scope.matches(targets)) watch(scope);
    scope.querySelectorAll(targets).forEach(watch);
    // ResponsiveContainer inserts its SVG after its parent has already revealed.
    const chart = scope.closest('[data-slot="chart"]');
    if (chart && shown(chart) && seen.has(chart)) drawChart(chart);
  }

  function replayPanel(panel: Element) {
    panel.querySelectorAll("svg *, .recharts-legend-wrapper").forEach((node) => {
      charts.delete(node);
    });
    [panel, ...panel.querySelectorAll(targets)].forEach((node) => {
      seen.delete(node);
      watched.delete(node);
      charts.delete(node);
      numbers.delete(node);
    });
    panel.querySelectorAll('[data-motion-counter="managed"]').forEach((node) => {
      node.dispatchEvent(new Event("noreva:counter-replay"));
    });
    scan(panel);
  }

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      const node = record.target;
      if (!(node instanceof Element)) continue;
      if (record.type === "attributes") {
        if (
          node.matches(`${panels}, ${overlaySelector}`) &&
          shown(node) &&
          node.getAttribute("data-state") !== "closed"
        ) {
          panelQueue.add(node);
        }
      } else {
        record.addedNodes.forEach((child) => {
          if (child instanceof Element) queued.add(child);
        });
      }
    }
    if (!frame)
      frame = requestAnimationFrame(() => {
        frame = 0;
        const batch = queued;
        queued = new Set();
        const opened = panelQueue;
        panelQueue = new Set();
        opened.forEach((panel) => {
          if (!shown(panel)) return;
          if (overlays) {
            seen.delete(panel);
            scan(panel);
          } else replayPanel(panel);
        });
        batch.forEach(scan);
      });
  });
  observer.observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["data-state", "hidden", "aria-expanded", "data-motion-panel"],
  });
  const reduce = () => {
    if (motionReduced()) {
      animations.forEach((animation) => {
        animation.cancel();
      });
      counterStops.forEach((stop) => {
        stop();
      });
    }
  };
  media.addEventListener("change", reduce);
  const preferenceChanged = () => {
    if (motionReduced()) reduce();
    else if (!overlays) replayPanel(root);
  };
  window.addEventListener(motionPreferenceEvent, preferenceChanged);
  scan(root);
  return {
    replay: () => replayPanel(root),
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection?.disconnect();
      media.removeEventListener("change", reduce);
      window.removeEventListener(motionPreferenceEvent, preferenceChanged);
      animations.forEach((animation) => {
        animation.cancel();
      });
      counterStops.forEach((stop) => {
        stop();
      });
    },
  };
}
