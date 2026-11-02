"use client";

import { useEffect, useRef } from "react";

import { number, percent } from "./analytics-data";

export { useReducedMotion } from "@/hooks/use-reduced-motion";

export function CountUp({ value, rate = false, delay = 0 }: { value: number; rate?: boolean; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const format = (n: number) => (rate ? percent(n) : number(Math.round(n)));
    let frame = 0;
    let started = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      node.textContent = format(value);
    };
    const animate = (time: number) => {
      if (!started) started = time;
      const p = Math.min(1, Math.max(0, (time - started - delay) / 850));
      node.textContent = format(value * (1 - (1 - p) ** 3));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    const run = () => {
      stop();
      started = 0;
      if (!media.matches) frame = requestAnimationFrame(animate);
    };
    if (typeof IntersectionObserver === "undefined") {
      run();
      return stop;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.unobserve(node);
        run();
      }
    });
    const replay = () => {
      observer.unobserve(node);
      observer.observe(node);
    };
    observer.observe(node);
    node.addEventListener("noreva:counter-replay", replay);
    media.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      stop();
      node.removeEventListener("noreva:counter-replay", replay);
      media.removeEventListener("change", stop);
    };
  }, [value, rate, delay]);
  return (
    <span ref={ref} data-motion-counter="managed" className="tabular-nums">
      {rate ? percent(value) : number(value)}
    </span>
  );
}
