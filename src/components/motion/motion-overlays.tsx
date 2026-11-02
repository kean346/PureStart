"use client";

import { useEffect } from "react";

import { createMotionController } from "@/lib/motion/dashboard-motion";

export function MotionOverlays() {
  useEffect(() => {
    const controller = createMotionController(document.body, true);
    return () => controller.dispose();
  }, []);
  return null;
}
