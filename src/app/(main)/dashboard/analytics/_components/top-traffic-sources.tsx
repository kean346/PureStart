"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAnalytics } from "./analytics-context";
import { number } from "./analytics-data";
import { useReducedMotion } from "./analytics-motion";

const chartConfig = { value: { color: "var(--chart-1)", label: "Visitors" } } satisfies ChartConfig;
export function SourceChart({ data }: { data: { name: string; value: number }[] }) {
  const reduced = useReducedMotion();
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 0, right: 46 }} key={String(reduced)}>
        <YAxis dataKey="name" type="category" hide />
        <XAxis dataKey="value" type="number" hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar
          dataKey="value"
          barSize={38}
          fill="var(--color-value)"
          fillOpacity={0.3}
          radius={6}
          isAnimationActive={!reduced}
          animationBegin={350}
          animationDuration={950}
          animationEasing="ease-out"
        >
          <LabelList dataKey="name" position="insideLeft" offset={12} fontSize={12} className="fill-foreground" />
          <LabelList
            dataKey="value"
            position="right"
            formatter={(value: unknown) => `${(Number(value) / 1000).toFixed(1)}k`}
            fontSize={11}
            className="fill-muted-foreground"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
export function TopTrafficSources() {
  const { sources, campaigns, referrers, current } = useAnalytics();
  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">Traffic sources</CardTitle>
        <CardDescription>{number(current.visitors)} visitors · first-touch attribution</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs defaultValue="sources" className="gap-3">
          <TabsList variant="line" className="w-full justify-start border-b px-3">
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="referrers">Referrers</TabsTrigger>
          </TabsList>
          <TabsContent value="sources" className="px-4">
            <SourceChart data={sources} />
          </TabsContent>
          <TabsContent value="campaigns" className="px-4">
            <p className="text-muted-foreground mb-2 text-xs">
              Paid-search visitors only · {number(sources[2].value)} total
            </p>
            <SourceChart data={campaigns} />
          </TabsContent>
          <TabsContent value="referrers" className="px-4">
            <p className="text-muted-foreground mb-2 text-xs">
              Referral visitors only · {number(sources[3].value)} total
            </p>
            <SourceChart data={referrers} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
