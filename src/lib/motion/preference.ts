export type MotionPreference = "system" | "full" | "reduced";
export const motionPreferenceEvent = "noreva:motion-preference";
export function motionReduced() {
  if (typeof window === "undefined") return true;
  const preference = document.documentElement.dataset.motionPreference;
  if (preference === "full") return false;
  if (preference === "reduced") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
