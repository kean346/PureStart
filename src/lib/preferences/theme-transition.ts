"use client";

import { flushSync } from "react-dom";

let changing = false;

/** Capture the old UI, apply the new palette, then reveal it across the viewport. */
export function transitionTheme(update: () => void) {
  if (
    typeof document === "undefined" ||
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    changing
  ) {
    update();
    return;
  }
  const root = document.documentElement;
  const trigger = document.activeElement?.getBoundingClientRect();
  const x = trigger?.width ? trigger.left + trigger.width / 2 : window.innerWidth - 80;
  const y = trigger?.height ? trigger.top + trigger.height / 2 : 24;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty("--theme-origin-x", `${x}px`);
  root.style.setProperty("--theme-origin-y", `${y}px`);
  root.style.setProperty("--theme-reveal-radius", `${radius}px`);
  root.dataset.themeTransition = "reveal";
  changing = true;
  const transition = document.startViewTransition(() => flushSync(update));
  void transition.finished
    .catch(() => undefined)
    .finally(() => {
      changing = false;
      delete root.dataset.themeTransition;
    });
}
