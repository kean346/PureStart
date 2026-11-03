"use client";

import { useEffect, useRef } from "react";

import { usePathname } from "next/navigation";

import { numericLabel } from "@/lib/motion/number-label";
import { motionPreferenceEvent, motionReduced } from "@/lib/motion/preference";

export function AnimatedValue({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const path = usePathname();
  useEffect(() => {
    // A pathname change is a new visit even when React retains this component.
    if (!path) return;
    const node = ref.current;
    const format = numericLabel(text);
    if (!node || !format) return;
    let frame = 0;
    let start = 0;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      cancelAnimationFrame(frame);
      node.textContent = text;
    };
    const tick = (time: number) => {
      if (!start) start = time;
      const p = Math.min(1, (time - start) / 1500);
      node.textContent = format(1 - (1 - p) ** 3);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        if (!motionReduced()) {
          node.textContent = format(0);
          frame = requestAnimationFrame(tick);
        }
      }
    });
    const preferenceChanged = () => {
      stop();
      start = 0;
      if (!motionReduced()) observer.observe(node);
    };
    window.addEventListener(motionPreferenceEvent, preferenceChanged);
    observer.observe(node);
    media.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      window.removeEventListener(motionPreferenceEvent, preferenceChanged);
      stop();
      media.removeEventListener("change", stop);
    };
  }, [path, text]);
  return (
    <span ref={ref} data-motion-counter="managed" className="tabular-nums">
      {text}
    </span>
  );
}
