"use client";
import { useEffect, useState } from "react";

import { useCalendarController } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { EventCalendarViews } from "@/components/calendar/event-calendar-views";
import { Button } from "@/components/ui/button";

import type { Booking } from "./model";
import { Choice } from "./shared";
import { useDemo, useDemoData } from "./store";
export function BookingCalendar({ onEdit }: { onEdit: (b: Booking) => void }) {
  const d = useDemoData();
  const controller = useCalendarController();
  const journey = useDemo((s) => s.journey);
  const focusedStart = journey?.active ? d.bookings.find((b) => b.id === journey.bookingId)?.start : undefined;
  useEffect(() => {
    if (focusedStart) controller.gotoDate(focusedStart);
  }, [controller, focusedStart]);
  const [title, setTitle] = useState("");
  const [view, setView] = useState("dayGridMonth");
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="bg-card flex flex-wrap items-center justify-between gap-3 p-4">
        <h2 className="font-medium">{title}</h2>
        <div className="flex flex-wrap items-end gap-2">
          <Button aria-label="Previous calendar period" variant="outline" size="icon" onClick={() => controller.prev()}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" onClick={() => controller.today()}>
            Today
          </Button>
          <Button aria-label="Next calendar period" variant="outline" size="icon" onClick={() => controller.next()}>
            <ChevronRight />
          </Button>
          <Choice
            label="Calendar view"
            value={view}
            options={[
              { id: "dayGridMonth", name: "Month" },
              { id: "timeGridWeek", name: "Week" },
            ]}
            onChange={(v) => {
              setView(v);
              controller.changeView(v);
            }}
          />
        </div>
      </div>
      <EventCalendarViews
        controller={controller}
        initialView={view}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        height="auto"
        popoverCloseContent={() => <X />}
        datesSet={(info) => setTitle(info.view.title)}
        events={d.bookings
          .filter((b) => b.status !== "Cancelled")
          .map((b) => ({
            id: b.id,
            title: `${d.customers.find((c) => c.id === b.customerId)?.name} · ${b.status}`,
            start: b.start,
            end: new Date(new Date(b.start).getTime() + b.duration * 3600000).toISOString(),
          }))}
        eventClick={(info) => {
          const b = d.bookings.find((b) => b.id === info.event.id);
          if (b) onEdit(b);
        }}
      />
    </div>
  );
}
