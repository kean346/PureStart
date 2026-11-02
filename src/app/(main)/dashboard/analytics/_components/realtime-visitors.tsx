"use client";

import { Bar, BarChart, type BarShapeProps, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { snapshot } from "./analytics-data";
import { CountUp, useReducedMotion } from "./analytics-motion";

const chartConfig = { visitors: { color: "var(--chart-3)", label: "Visitors" } } satisfies ChartConfig;
function VisitorBar({ x, y, width, height, index, fill }: BarShapeProps) {
  return (
    <rect
      x={Number(x)}
      y={Number(y)}
      width={Number(width)}
      height={Number(height)}
      rx={2}
      fill={fill}
      fillOpacity={0.65}
      className="noreva-visitor-bar"
      style={{ animationDelay: `${450 + index * 12}ms` }}
    />
  );
}
export function RealtimeVisitors() {
  const reduced = useReducedMotion();
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Realtime visitors</CardTitle>
        <CardDescription>Simulated snapshot · Nov 1, 10:42 UTC</CardDescription>
        <CardAction>
          <Badge variant="outline">Demo live</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl tracking-tight">
            <CountUp value={42} delay={500} />
          </span>
          <span className="text-muted-foreground text-sm">visitors in the latest minute</span>
        </div>
        <ChartContainer config={chartConfig} className="h-28 w-full">
          <BarChart data={snapshot.minutes} accessibilityLayer key={String(reduced)} barCategoryGap={3}>
            <XAxis dataKey="minute" hide />
            <YAxis hide domain={[0, 45]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(v) => `Minute ${v}`} />} />
            <Bar
              dataKey="visitors"
              fill="var(--color-visitors)"
              shape={VisitorBar}
              isAnimationActive={false}
              animationBegin={450}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </BarChart>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-x-5">
          {snapshot.countries.map((country) => (
            <div key={country.flag} className="border-border/50 flex min-w-0 items-center gap-2 border-b py-3 text-sm">
              <span aria-hidden="true" className={`flag:${country.flag} shrink-0 rounded-xs`} />
              <span className="min-w-0 flex-1 truncate">{country.name}</span>
              <span className="tabular-nums">{country.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
