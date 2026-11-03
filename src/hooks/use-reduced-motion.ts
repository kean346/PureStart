"use client";

import { useEffect, useState } from "react";

import { motionPreferenceEvent, motionReduced } from "@/lib/motion/preference";

export function useReducedMotion() {
  // The server and initial browser render agree; charts animate only after mount.
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motionReduced());
    sync();
    window.addEventListener(motionPreferenceEvent, sync);
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener(motionPreferenceEvent, sync);
    };
  }, []);
  return reduced;
}
