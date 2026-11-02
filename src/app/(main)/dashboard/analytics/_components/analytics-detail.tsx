"use client";

import { Cell, Pie, PieChart } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useAnalytics } from "./analytics-context";
import { activity, number, percent } from "./analytics-data";
import { CountUp, useReducedMotion } from "./analytics-motion";
import { TopPages } from "./top-pages";
import { SourceChart } from "./top-traffic-sources";
import { TrafficQuality } from "./traffic-quality";

function Audience() {
  const { countries, devices, current } = useAnalytics();
  const reduced = useReducedMotion();
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Audience by region</CardTitle>
          <CardDescription>{number(current.visitors)} unique visitors across all regions</CardDescription>
        </CardHeader>
        <CardContent>
          <SourceChart data={countries} />
          <div className="text-muted-foreground mt-3 text-sm">
            Active product users:{" "}
            <span className="text-foreground">
              <CountUp value={current.active} />
            </span>{" "}
            · subset of unique visitors
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sessions by device</CardTitle>
          <CardDescription>Every session belongs to one device category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ value: { label: "Sessions" } }} className="mx-auto h-56 w-full">
            <PieChart accessibilityLayer key={String(reduced)}>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
              <Pie
                data={devices}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                strokeWidth={0}
                isAnimationActive={!reduced}
                animationBegin={200}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {devices.map((device, i) => (
                  <Cell key={device.name} fill={`var(--chart-${i + 1})`} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex flex-col gap-3">
            {devices.map((device, i) => (
              <div
                key={device.name}
                className="noreva-row flex items-center gap-2 text-sm"
                style={{ animationDelay: `${400 + i * 80}ms` }}
              >
                <span className="size-2 rounded-full" style={{ background: `var(--chart-${i + 1})` }} />
                <span className="flex-1">{device.name}</span>
                <span className="text-muted-foreground">{number(device.value)}</span>
                <span className="w-14 text-right">
                  <CountUp value={(device.value / current.sessions) * 100} rate delay={300} />
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function Conversions() {
  const { funnel, current, conversion } = useAnalytics();
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Conversion funnel</CardTitle>
          <CardDescription>Session-based journey · each stage is a subset of the previous stage</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {funnel.map((step, i) => (
            <div key={step.name} className="noreva-row flex flex-col gap-2" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span>{step.name}</span>
                <span>
                  {number(step.value)}{" "}
                  <span className="text-muted-foreground">· {percent((step.value / current.sessions) * 100)}</span>
                </span>
              </div>
              <div className="bg-muted h-3 overflow-hidden rounded">
                <div
                  className="noreva-funnel bg-primary h-full origin-left rounded"
                  style={{ width: `${(step.value / current.sessions) * 100}%`, animationDelay: `${200 + i * 80}ms` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Activation intelligence</CardTitle>
          <CardDescription>A conversion is a newly activated workspace</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="text-4xl tracking-tight">
            <CountUp value={conversion} rate />
          </div>
          <p className="text-muted-foreground text-sm">
            {number(current.conversions)} of {number(current.sessions)} sessions resulted in activation. Rates are
            calculated from the same session totals shown in Overview.
          </p>
          <div className="border-border rounded-lg border p-4">
            <p className="text-sm font-medium">A clear next step</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Review trial onboarding with the NOREVA growth team. This is a fictional recommendation for the portfolio
              demo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export function AnalyticsDetail({ view }: { view: string }) {
  if (view === "audience") return <Audience />;
  if (view === "conversions") return <Conversions />;
  if (view === "engagement")
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        <TrafficQuality />
        <TopPages />
      </div>
    );
  return null;
}
export function WebsiteActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace activity</CardTitle>
        <CardDescription>Fictional customer events · snapshot from Nov 1, 2026</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Customer</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activity.map((event, i) => (
              <TableRow key={event.email} className="noreva-row" style={{ animationDelay: `${i * 75}ms` }}>
                <TableCell className="pl-4">
                  <div className="font-medium">{event.name}</div>
                  <div className="text-muted-foreground text-xs">{event.email}</div>
                </TableCell>
                <TableCell>
                  <div>{event.action}</div>
                  <div className="text-muted-foreground text-xs">{event.company}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{event.status}</Badge>
                </TableCell>
                <TableCell className="pr-4 text-right text-xs whitespace-nowrap">{event.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
