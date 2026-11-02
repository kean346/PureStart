"use client";

import { flushSync } from "react-dom";

let active: ViewTransition | null = null;
let revision = 0;
let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

/** Animate a palette change without touching route or component state. */
export function transitionTheme(update: () => void) {
  if (typeof document === "undefined") {
    update();
    return;
  }
  const current = ++revision;
  const root = document.documentElement;
  active?.skipTransition();
  clearTimeout(fallbackTimer);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    delete root.dataset.themeTransition;
    update();
    return;
  }
  if (!document.startViewTransition) {
    root.dataset.themeTransition = "fallback";
    // Flush the old palette with CSS transitions installed, before applying the new one.
    void getComputedStyle(root).backgroundColor;
    update();
    fallbackTimer = setTimeout(() => {
      if (current === revision) delete root.dataset.themeTransition;
    }, 450);
    return;
  }
  const trigger = document.activeElement?.getBoundingClientRect();
  const x = trigger?.width ? trigger.left + trigger.width / 2 : window.innerWidth - 80;
  const y = trigger?.height ? trigger.top + trigger.height / 2 : 24;
  root.style.setProperty("--theme-origin-x", `${x}px`);
  root.style.setProperty("--theme-origin-y", `${y}px`);
  root.style.setProperty(
    "--theme-reveal-radius",
    `${Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))}px`,
  );
  root.dataset.themeTransition = "reveal";
  let applied = false;
  try {
    const transition = document.startViewTransition(() => {
      applied = true;
      flushSync(update);
    });
    active = transition;
    void transition.finished
      .catch(() => undefined)
      .finally(() => {
        if (current === revision) {
          active = null;
          delete root.dataset.themeTransition;
        }
      });
  } catch {
    if (!applied) update();
    if (current === revision) delete root.dataset.themeTransition;
  }
}
