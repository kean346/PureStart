"use client";
import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type MotionPreference, motionPreferenceEvent } from "@/lib/motion/preference";

export function MotionPreferences() {
  const [value, setValue] = useState<MotionPreference>("system");
  const [deviceReduced, setDeviceReduced] = useState(false);
  useEffect(() => {
    const current = document.documentElement.dataset.motionPreference;
    if (current === "full" || current === "reduced") setValue(current);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setDeviceReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const change = (next: string) => {
    const preference = next as MotionPreference;
    setValue(preference);
    document.documentElement.dataset.motionPreference = preference;
    try {
      localStorage.setItem("noreva-motion", preference);
    } catch {
      /* Session preference still works. */
    }
    window.dispatchEvent(new Event(motionPreferenceEvent));
  };
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="motion-preference">Animation</Label>
      <Select value={value} onValueChange={change}>
        <SelectTrigger id="motion-preference" aria-label="Animation preference">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="system">Follow device</SelectItem>
            <SelectItem value="full">Full animation</SelectItem>
            <SelectItem value="reduced">Reduced animation</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-xs">
        {value === "system" && deviceReduced
          ? "Your device requests reduced motion. Choose Full animation to enable the complete experience."
          : "Page reveals, counting numbers, chart drawing, and theme transitions."}
      </p>
    </div>
  );
}
