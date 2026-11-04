"use client";
import { create } from "zustand";

import { type Data, dataSchema, seed } from "./model";

const KEY = "purestart-os-v1";
type Store = {
  data: Data | null;
  tour: number | null;
  setTour: (tour: number | null) => void;
  storageError: string;
  hydrate: () => void;
  update: (fn: (data: Data) => Data) => void;
};
export const useDemo = create<Store>((set, get) => ({
  data: null,
  tour: null,
  setTour: (tour) => set({ tour }),
  storageError: "",
  hydrate: () => {
    if (get().data) return;
    try {
      const raw = localStorage.getItem(KEY);
      set({ data: raw ? dataSchema.parse(JSON.parse(raw)) : seed() });
    } catch {
      set({
        data: seed(),
        storageError:
          "Saved data could not be read. This session uses fresh fictional data; reset all demo data to replace the saved copy.",
      });
    }
  },
  update: (fn) => {
    const current = get().data;
    if (!current) return;
    const data = dataSchema.parse(fn(current));
    set({ data });
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      set({ storageError: "" });
    } catch {
      set({ storageError: "Browser storage is unavailable. Changes work in this tab but may not survive refresh." });
    }
  },
}));
