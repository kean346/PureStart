"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";

import { usePathname } from "next/navigation";

import { createMotionController } from "@/lib/motion/dashboard-motion";

import { MotionOverlays } from "./motion-overlays";

/** Standalone auth, chat, mail and public screens share the same motion vocabulary. */
export function ApplicationMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useLayoutEffect(() => {
    if (!root.current || pathname.startsWith("/dashboard")) return;
    const controller = createMotionController(root.current);
    return () => controller.dispose();
  }, [pathname]);
  return (
    <>
      <MotionOverlays />
      <div ref={root} className="contents">
        {children}
      </div>
    </>
  );
}
