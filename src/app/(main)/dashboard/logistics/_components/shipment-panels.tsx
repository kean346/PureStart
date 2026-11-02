"use client";

import { ArrowRight, CheckCircle2, Download, MapPin, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { Shipment } from "./shipment-data";

function downloadManifest(shipment: Shipment) {
  const text = [
    "NOREVA LOGISTICS — FICTIONAL DEMO",
    "Not a valid shipping or customs document.",
    "",
    `Shipment: ${shipment.id}`,
    `Customer: ${shipment.customer.name}`,
    `Origin: ${shipment.origin.display}, ${shipment.origin.country}`,
    `Destination: ${shipment.destination.display}, ${shipment.destination.country}`,
    `Cargo: ${shipment.cargo}`,
    `Weight: ${shipment.weight}`,
    `Transport: ${shipment.mode} — ${shipment.transportNumber}`,
    `Status: ${shipment.status} (${shipment.progress}%)`,
    `Handling: ${shipment.handling.note}`,
    "",
    "Fictional concept · Built by paceIT",
  ].join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${shipment.id}-demo-manifest.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ShipmentPanel({ shipment, view }: { shipment: Shipment; view: string }) {
  if (view === "route")
    return (
      <section className="flex flex-col gap-5">
        <h2 className="font-medium">Route itinerary</h2>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <div className="flex flex-col gap-2">
            <MapPin className="text-muted-foreground size-4" />
            <p className="font-medium">{shipment.origin.display}</p>
            <p className="text-muted-foreground text-sm">{shipment.origin.country} · Origin</p>
            <p className="text-muted-foreground text-xs">{shipment.origin.coordinates.join(", ")}</p>
          </div>
          <ArrowRight className="text-muted-foreground size-4 self-center" />
          <div className="flex flex-col gap-2">
            <MapPin className="text-muted-foreground size-4" />
            <p className="font-medium">{shipment.destination.display}</p>
            <p className="text-muted-foreground text-sm">{shipment.destination.country} · Destination</p>
            <p className="text-muted-foreground text-xs">{shipment.destination.coordinates.join(", ")}</p>
          </div>
        </div>
        <Separator />
        <p className="text-muted-foreground text-sm">
          {shipment.mode.toUpperCase()} · {shipment.transportNumber} · {shipment.progress}% complete. Map shows the
          direct connection between endpoints, not live vehicle positioning.
        </p>
      </section>
    );
  if (view === "cargo")
    return (
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Package className="size-4" />
          <h2 className="font-medium">{shipment.cargo}</h2>
        </div>
        <dl className="grid grid-cols-2 gap-5 text-sm">
          <div>
            <dt className="text-muted-foreground">Total weight</dt>
            <dd className="mt-1">{shipment.weight}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Account</dt>
            <dd className="mt-1">{shipment.customer.name}</dd>
          </div>
        </dl>
        <Separator />
        <p className="font-medium">{shipment.handling.label}</p>
        <p className="text-muted-foreground text-sm">{shipment.handling.note}</p>
        <div className="flex flex-wrap gap-2">
          {shipment.handling.tags.map(({ label, icon: Icon }) => (
            <Badge key={label} variant="outline">
              <Icon />
              {label}
            </Badge>
          ))}
        </div>
      </section>
    );
  if (view === "documents")
    return (
      <section className="flex flex-col gap-4">
        <h2 className="font-medium">Shipment documents</h2>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
          <div>
            <p className="text-sm">Demo shipment manifest</p>
            <p className="text-muted-foreground mt-1 text-xs">{shipment.id} · TXT · generated from this shipment</p>
          </div>
          <Button variant="outline" onClick={() => downloadManifest(shipment)}>
            <Download data-icon="inline-start" />
            Download
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">
          Illustrative document only. No real bills of lading, customs records, or private documents are stored.
        </p>
      </section>
    );
  const events = [
    { label: "Shipment booked", threshold: 0 },
    { label: "Cargo collected", threshold: 15 },
    { label: "Departed origin", threshold: 30 },
    { label: "Arrived at destination hub", threshold: 80 },
    { label: "Delivered", threshold: 100 },
  ];
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-medium">Shipment activity</h2>
      <p className="text-muted-foreground text-xs">Simulated milestones · current status: {shipment.status}</p>
      <ol className="flex flex-col gap-5">
        {events.map((event) => (
          <li key={event.label} className="flex items-center gap-3">
            <CheckCircle2
              className={
                event.threshold <= shipment.progress ? "text-primary size-4" : "text-muted-foreground/40 size-4"
              }
            />
            <span className="flex-1 text-sm">{event.label}</span>
            <Badge variant="secondary">{event.threshold <= shipment.progress ? "Complete" : "Upcoming"}</Badge>
          </li>
        ))}
      </ol>
    </section>
  );
}
