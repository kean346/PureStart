"use client";
import { useSyncExternalStore } from "react";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { analytics, type Data, money } from "./model";
import { Panel } from "./ui";

const subscribe = (callback: () => void) => {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
function useReduced() {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}
export function Revenue({ data, days = 7 }: { data: Data; days?: number }) {
  const a = analytics(data, days);
  const reduced = useReduced();
  return (
    <Panel
      title="A fresh perspective on revenue"
      description={`Demo payments received · last ${days} days`}
      action={<span className="ps-chart-total">{money(a.paid)}</span>}
    >
      <ChartContainer className="h-56 w-full" config={{ paid: { label: "Paid revenue", color: "var(--primary)" } }}>
        <AreaChart data={a.revenue} accessibilityLayer margin={{ left: 0, right: 12, top: 15 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 5" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={20} />
          <YAxis width={45} tickLine={false} axisLine={false} tickFormatter={(v) => `R${v}`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="paid"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.08}
            strokeWidth={2.5}
            isAnimationActive={!reduced}
            animationDuration={350}
          />
        </AreaChart>
      </ChartContainer>
    </Panel>
  );
}
export function ServiceChart({ data, days }: { data: Data; days: number }) {
  const a = analytics(data, days);
  const reduced = useReduced();
  return (
    <Panel title="What customers are booking" description="Orders containing each service">
      <ChartContainer className="h-56 w-full" config={{ orders: { label: "Orders", color: "var(--primary)" } }}>
        <BarChart data={a.services} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="orders" fill="var(--primary)" radius={6} isAnimationActive={!reduced} animationDuration={350} />
        </BarChart>
      </ChartContainer>
    </Panel>
  );
}
