"use client";

import { useEffect, useRef } from "react";

import { number, percent } from "./analytics-data";

export { useReducedMotion } from "@/hooks/use-reduced-motion";

export function CountUp({ value, rate = false, delay = 0 }: { value: number; rate?: boolean; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let started = 0;
    const format = (n: number) => (rate ? percent(n) : number(Math.round(n)));
    const animate = (time: number) => {
      if (!started) started = time;
      const progress = Math.min(1, Math.max(0, (time - started - delay) / 850));
      node.textContent = format(value * (1 - (1 - progress) ** 3));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, rate, delay]);
  return (
    <span ref={ref} className="tabular-nums">
      {rate ? percent(value) : number(value)}
    </span>
  );
}
