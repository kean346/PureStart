"use client";

import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { useAnalytics } from "./analytics-context";
import { useReducedMotion } from "./analytics-motion";

const chartConfig = {
  engagement: { color: "var(--chart-3)", label: "Engagement %" },
  baseline: { color: "var(--muted-foreground)", label: "Prior period %" },
} satisfies ChartConfig;
export function TrafficQuality() {
  const { daily, range, previousDaily } = useAnalytics();
  const reduced = useReducedMotion();
  const data = daily.map((day, i) => ({
    date: day.date.slice(5).replace("-", "/"),
    engagement: Number(((day.engaged / day.sessions) * 100).toFixed(1)),
    baseline: Number(((previousDaily[i].engaged / previousDaily[i].sessions) * 100).toFixed(1)),
  }));
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Traffic quality</CardTitle>
        <CardDescription>Engaged sessions as a share of all sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-60 w-full">
          <ComposedChart
            data={data}
            key={`${range}-${reduced}`}
            margin={{ top: 10, right: 8, bottom: 0, left: 0 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} className="noreva-axis" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={35} tickMargin={12} />
            <YAxis tickLine={false} axisLine={false} domain={[50, 80]} tickFormatter={(v) => `${v}%`} width={40} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="engagement"
              type="monotone"
              stroke="none"
              fill="var(--color-engagement)"
              fillOpacity={0.06}
              isAnimationActive={!reduced}
              animationBegin={350}
              animationDuration={950}
              animationEasing="ease-out"
              tooltipType="none"
            />
            <Line
              dataKey="baseline"
              type="monotone"
              dot={false}
              stroke="var(--color-baseline)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              isAnimationActive={!reduced}
              animationDuration={850}
              animationBegin={250}
            />
            <Line
              dataKey="engagement"
              type="monotone"
              dot={false}
              activeDot={{ r: 4 }}
              stroke="var(--color-engagement)"
              strokeWidth={2.5}
              isAnimationActive={!reduced}
              animationBegin={350}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ChartContainer>
        <div className="text-muted-foreground mt-3 flex flex-wrap gap-4 text-xs">
          <span>
            <span className="bg-primary mr-2 inline-block size-2 rounded-full" />
            Current period
          </span>
          <span>┄ Prior-period benchmark</span>
        </div>
      </CardContent>
    </Card>
  );
}
