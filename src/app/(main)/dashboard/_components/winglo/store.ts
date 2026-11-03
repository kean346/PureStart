"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { type Booking, type Customer, type DemoData, type Enquiry, id, seed } from "./model";

type DemoStore = {
  data: DemoData | null;
  ready: boolean;
  storageError: boolean;
  init: () => void;
  update: (fn: (data: DemoData) => DemoData) => void;
  reset: () => void;
  submit: (
    customer: Omit<Customer, "id">,
    enquiry: Omit<Enquiry, "id" | "customerId" | "date" | "status">,
    existing?: string,
  ) => string;
  book: (booking: Booking) => void;
};
export const useDemo = create<DemoStore>()(
  persist(
    (set, get) => ({
      data: null,
      ready: false,
      storageError: false,
      init: () => {
        if (!get().data) set({ data: seed() });
        set({ ready: true });
      },
      update: (fn) => {
        const data = get().data;
        if (data) set({ data: fn(data) });
      },
      reset: () => set({ data: seed() }),
      submit: (input, details, existing) => {
        const data = get().data;
        if (!data) throw new Error("Demo not loaded");
        const normalize = (s: string) => s.replace(/\D/g, "");
        const known = data.customers.find(
          (c) =>
            normalize(c.phone) === normalize(input.phone) ||
            (!!input.email && c.email.toLowerCase() === input.email.toLowerCase()),
        );
        const customerId = existing
          ? (data.enquiries.find((e) => e.id === existing)?.customerId ?? known?.id ?? id("C"))
          : (known?.id ?? id("C"));
        const enquiryId = existing ?? id("E");
        const customer = { ...input, notes: input.notes || known?.notes || "", id: customerId };
        const prior = data.enquiries.find((e) => e.id === existing);
        const enquiry: Enquiry = {
          ...details,
          id: enquiryId,
          customerId,
          date: prior?.date ?? new Date().toISOString(),
          status: prior?.status ?? "Ready for Quote",
        };
        set({
          data: {
            ...data,
            customers: [...data.customers.filter((c) => c.id !== customerId), customer],
            enquiries: existing
              ? data.enquiries.map((e) => (e.id === existing ? enquiry : e))
              : [enquiry, ...data.enquiries],
          },
        });
        return enquiryId;
      },
      book: (booking) =>
        get().update((d) => ({
          ...d,
          bookings: d.bookings.some((b) => b.id === booking.id)
            ? d.bookings.map((b) => (b.id === booking.id ? booking : b))
            : [booking, ...d.bookings],
          enquiries: d.enquiries.map((e) =>
            d.quotes.some((q) => q.id === booking.quoteId && q.enquiryId === e.id) ? { ...e, status: "Converted" } : e,
          ),
        })),
    }),
    {
      name: "winglo-demo-v1",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            return localStorage.getItem(name);
          } catch {
            storageUnavailable();
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch {
            storageUnavailable();
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch {
            storageUnavailable();
          }
        },
      })),
      skipHydration: true,
      partialize: (s) => ({ data: s.data }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) useDemo.setState({ storageError: true });
      },
    },
  ),
);

/** Feature components render only after the workspace hydration gate. */
export function useDemoData() {
  const data = useDemo((s) => s.data);
  if (!data) throw new Error("Winglo demo must be hydrated before rendering records");
  return data;
}

function storageUnavailable() {
  queueMicrotask(() => {
    if (!useDemo.getState().storageError) useDemo.setState({ storageError: true });
  });
}
