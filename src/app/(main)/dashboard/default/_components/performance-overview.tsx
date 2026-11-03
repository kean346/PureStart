"use client";

import { useState } from "react";

import { addHours, format, parseISO, subHours } from "date-fns";
import { Area, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Fixed regional demo activity; deterministic and independent of the render clock.
const chartValues = Array.from({ length: 180 }, (_, index) => ({
  newCustomers: Math.round(
    80 + ((index * 37) % 61) + Math.sin(index * 0.23) * 22 + (index % 17 === 0 ? 210 : 0) + (index % 29 === 0 ? 95 : 0),
  ),
  activeAccounts: 34 + ((index * 11) % 13) + Math.round(index * 0.08),
  returningUsers: 22 + ((index * 7) % 9) + Math.round(index * 0.035),
}));

const endDate = new Date("2026-11-02T00:00:00Z");
const startDate = subHours(endDate, (chartValues.length - 1) * 12);

const chartData = chartValues.map((point, index) => ({
  date: addHours(startDate, index * 12)
    .toISOString()
    .slice(0, 10),
  ...point,
}));

const chartConfig = {
  newCustomers: {
    label: "New client visits",
    color: "var(--chart-1)",
  },
  activeAccounts: {
    label: "Active workspace visits",
    color: "var(--chart-2)",
  },
  returningUsers: {
    label: "Returning visits",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function PerformanceOverview() {
  const [period, setPeriod] = useState("quarter");
  const [segment, setSegment] = useState("all");
  const days = period === "month" ? 30 : 90;
  const scale = segment === "paid" ? 0.38 : segment === "organic" ? 0.62 : 1;
  const visibleData = chartData.slice(-days * 2).map((point) => ({
    ...point,
    newCustomers: Math.round(point.newCustomers * scale),
    activeAccounts: Math.round(point.activeAccounts * scale),
    returningUsers: Math.round(point.returningUsers * scale),
  }));
  const downloadReport = () => {
    const rows = [
      "NOREVA — fictional customer activity",
      `Segment,${segment}`,
      "Date,New customer visits,Active account visits,Returning user visits",
      ...visibleData.map(
        (point) => `${point.date},${point.newCustomers},${point.activeAccounts},${point.returningUsers}`,
      ),
    ];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `noreva-customer-activity-${days}-days.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="leading-none">Customer Activity</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              Customer visits over {period === "month" ? "the last month" : "the last 3 months"}
            </span>
            <span className="@[540px]/card:hidden">Customer activity</span>
          </CardDescription>
        </div>
        <CardAction className="flex flex-wrap items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger size="sm" className="w-28" aria-label="Activity period">
              <SelectValue placeholder="3 months" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Period</SelectLabel>
                <SelectItem value="quarter">3 months</SelectItem>
                <SelectItem value="month">1 month</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={segment} onValueChange={setSegment}>
            <SelectTrigger size="sm" className="w-32" aria-label="Customer segment">
              <SelectValue placeholder="All segments" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Segments</SelectLabel>
                <SelectItem value="all">All segments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={downloadReport}>
            View report
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
          <ComposedChart data={visibleData} key={`${period}-${segment}`} margin={{ top: 0 }}>
            <defs>
              <linearGradient id="fillNewCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-newCustomers)" stopOpacity={0.36} />
                <stop offset="95%" stopColor="var(--color-newCustomers)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.5} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={48}
              tickFormatter={(value) =>
                parseISO(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-50"
                  indicator="line"
                  labelFormatter={(value) => format(parseISO(value), "d MMMM yyyy")}
                />
              }
            />
            <ChartLegend verticalAlign="top" content={<ChartLegendContent className="mb-5 justify-end" />} />

            <Area
              isAnimationActive={false}
              animationDuration={1000}
              animationEasing="ease-out"
              dataKey="newCustomers"
              type="natural"
              fill="url(#fillNewCustomers)"
              stroke="var(--color-newCustomers)"
              strokeWidth={1.25}
              dot={false}
              fillOpacity={1}
            />
            <Line
              isAnimationActive={false}
              animationDuration={1000}
              animationEasing="ease-out"
              dataKey="activeAccounts"
              type="natural"
              stroke="var(--color-activeAccounts)"
              strokeWidth={1.4}
              dot={false}
            />
            <Line
              isAnimationActive={false}
              animationDuration={1000}
              animationEasing="ease-out"
              dataKey="returningUsers"
              type="natural"
              stroke="var(--color-returningUsers)"
              strokeWidth={1.2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
