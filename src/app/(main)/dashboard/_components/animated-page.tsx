"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";

import { usePathname } from "next/navigation";

import { createMotionController } from "@/lib/motion/dashboard-motion";

export function AnimatedPage({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return;
    const motion = createMotionController(node);
    const replay = () => motion.replay();
    node.addEventListener("noreva:replay", replay);
    // A short exit plays concurrently with the router request; never delay navigation.
    const exit = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (
        !link ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0 ||
        link.target === "_blank"
      )
        return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== location.origin || !url.pathname.startsWith("/dashboard") || url.pathname === pathname) return;
      if (typeof node.animate === "function" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        node.animate([{ opacity: 1 }, { opacity: 0.65 }], { duration: 120, fill: "none" });
    };
    document.addEventListener("click", exit, true);
    return () => {
      motion.dispose();
      node.removeEventListener("noreva:replay", replay);
      document.removeEventListener("click", exit, true);
    };
  }, [pathname]);
  return (
    <div ref={root} data-motion-page={pathname} className="min-w-0">
      {children}
    </div>
  );
}
