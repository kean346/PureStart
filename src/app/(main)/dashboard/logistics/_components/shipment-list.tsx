"use client";

import { useState } from "react";

import { cn } from "cn";
import { Plane, Search, Ship, SlidersHorizontal, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Shipment } from "./shipment-data";

const modeIcons = {
  air: Plane,
  land: Truck,
  sea: Ship,
} as const;

const progressRingClasses: Record<Shipment["status"], string> = {
  Scheduled: "text-muted-foreground",
  "In Transit": "text-primary",
  "Out for Delivery": "text-primary",
  Delivered: "text-green-600",
  Delayed: "text-destructive",
  "On Hold": "text-amber-500",
  "Customs Hold": "text-amber-500",
};

function getProgressRingClass(status: Shipment["status"]) {
  return cn(
    "grid size-3 place-items-center rounded-full bg-[conic-gradient(currentColor_0deg_var(--angle),transparent_var(--angle)_360deg)] p-[0.5px]",
    progressRingClasses[status],
  );
}

type ShipmentCardProps = {
  active?: boolean;
  onSelectShipment: (shipmentId: Shipment["id"]) => void;
  shipment: Shipment;
};

type ShipmentListProps = {
  onSelectShipment: (shipmentId: Shipment["id"]) => void;
  selectedShipmentId: Shipment["id"] | null;
  shipments: Shipment[];
};

function ShipmentCard({ shipment, active, onSelectShipment }: ShipmentCardProps) {
  const angle = (shipment.progress / 100) * 360;
  const Icon = modeIcons[shipment.mode];

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={(event) => {
        event.currentTarget.blur();
        onSelectShipment(shipment.id);
      }}
      className={cn(
        "flex w-full flex-col gap-5 rounded-xl border p-3 text-left transition-colors",
        "hover:bg-muted/50 focus-visible:ring-ring/50 focus-visible:ring-3 focus-visible:outline-none",
        active && "border-primary bg-muted/50",
      )}
    >
      <div className="flex items-center justify-between">
        <div>#{shipment.id}</div>

        <div className="flex items-center gap-1">
          <div
            style={{ "--angle": `${angle}deg` } as React.CSSProperties}
            className={getProgressRingClass(shipment.status)}
          >
            <div className="bg-card grid size-2 place-items-center rounded-full">
              <div className="size-1 rounded-full bg-current" />
            </div>
          </div>
          <div className="text-muted-foreground text-xs">{shipment.status}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className={cn(`flag:${shipment.origin.countryCode.toUpperCase()}`, "rounded-xs text-3xl outline")} />
          <div className="flex flex-col gap-0.5">
            <div className="text-xs leading-none font-medium">{shipment.origin.country},</div>
            <div className="text-muted-foreground text-xs">{shipment.origin.display}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-right">
          <div className="flex flex-col gap-0.5">
            <div className="text-xs leading-none font-medium">{shipment.destination.country},</div>
            <div className="text-muted-foreground text-xs">{shipment.destination.display}</div>
          </div>
          <div
            className={cn(`flag:${shipment.destination.countryCode.toUpperCase()}`, "rounded-xs text-3xl outline")}
          />
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <span
          className="border-foreground h-px min-w-0 border-t border-dashed"
          style={{ flexGrow: shipment.progress, flexBasis: 0 }}
        />
        <Icon className={cn("size-3.5", shipment.mode === "air" && "rotate-45")} />
        <span
          className="border-border h-px min-w-0 border-t border-dashed"
          style={{ flexGrow: 100 - shipment.progress, flexBasis: 0 }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-muted-foreground text-xs leading-none">Cargo</div>
          <div className="truncate text-sm tracking-tight">{shipment.cargo}</div>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground text-xs leading-none">ETA</div>
          <div className="text-sm tracking-tight tabular-nums">
            {shipment.eta}
            {shipment.etaMeta && (
              <span className="text-muted-foreground ml-1 text-xs font-normal">{shipment.etaMeta}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export function ShipmentList({ shipments, selectedShipmentId, onSelectShipment }: ShipmentListProps) {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("all");
  const matchesStatus = (shipment: Shipment, value: string) => value === "all" || shipment.status === value;
  const filtered = shipments.filter(
    (shipment) =>
      matchesStatus(shipment, status) &&
      (mode === "all" || shipment.mode === mode) &&
      [
        shipment.id,
        shipment.cargo,
        shipment.customer.name,
        shipment.origin.country,
        shipment.origin.display,
        shipment.destination.country,
        shipment.destination.display,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <Card className="h-full rounded-none ring-0">
      <CardHeader>
        <CardTitle className="text-xl font-normal">Shipments</CardTitle>
        <p className="text-muted-foreground text-xs">Fictional fleet · {shipments.length} shipments</p>
        <CardAction>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon-sm" variant="ghost" aria-label="Filter transport mode">
                <SlidersHorizontal />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56">
              <p className="mb-3 text-sm font-medium">Transport mode</p>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger aria-label="Transport mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All transport</SelectItem>
                    <SelectItem value="air">Air freight</SelectItem>
                    <SelectItem value="land">Road freight</SelectItem>
                    <SelectItem value="sea">Sea freight</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden px-0">
        <Tabs value={status} onValueChange={setStatus}>
          <TabsList className="w-full border-b px-4" variant="line">
            {[
              { value: "all", label: "All" },
              { value: "In Transit", label: "In Transit" },
              { value: "Delivered", label: "Delivered" },
              { value: "Delayed", label: "Delayed" },
            ].map((tab) => (
              <TabsTrigger className="text-xs" key={tab.value} value={tab.value}>
                {tab.label} ({shipments.filter((shipment) => matchesStatus(shipment, tab.value)).length})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="px-4">
          <InputGroup className="h-8">
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-8"
              aria-label="Search shipments"
              placeholder="Search shipments..."
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <ScrollArea className="h-0 flex-1">
          <div className="flex flex-col gap-4 px-4">
            {!filtered.length && (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No matching shipments</EmptyTitle>
                  <EmptyDescription>Try another search or transport filter.</EmptyDescription>
                </EmptyHeader>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setMode("all");
                    setStatus("all");
                  }}
                >
                  Reset filters
                </Button>
              </Empty>
            )}

            {filtered.map((shipment) => (
              <ShipmentCard
                active={shipment.id === selectedShipmentId}
                key={shipment.id}
                shipment={shipment}
                onSelectShipment={onSelectShipment}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
