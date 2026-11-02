"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAnalytics } from "./analytics-context";
import { number, percent } from "./analytics-data";
import { CountUp } from "./analytics-motion";

export function AnalyticsKpiStrip() {
  const { kpis } = useAnalytics();
  return (
    <div className="bg-card ring-foreground/10 overflow-hidden rounded-xl shadow-xs ring-1">
      <div className="grid divide-y *:data-[slot=card]:rounded-none *:data-[slot=card]:ring-0 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-5">
        {kpis.map((kpi, i) => {
          const change = kpi.rate ? kpi.value - kpi.previous : (kpi.value / kpi.previous - 1) * 100;
          const roundedChange = Math.round(change * 10) / 10;
          let TrendIcon = Minus;
          if (roundedChange > 0) TrendIcon = ArrowUpRight;
          if (roundedChange < 0) TrendIcon = ArrowDownRight;
          return (
            <Card key={kpi.label} className="noreva-reveal" style={{ animationDelay: `${180 + i * 75}ms` }}>
              <CardHeader>
                <CardTitle className="text-sm font-normal">{kpi.label}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-2xl leading-none tracking-tight">
                    <CountUp value={kpi.value} rate={kpi.rate} delay={250 + i * 75} />
                  </div>
                  <Badge variant="secondary" className="noreva-trend" style={{ animationDelay: `${700 + i * 75}ms` }}>
                    <TrendIcon />
                    {roundedChange.toFixed(1)}
                    {kpi.rate ? "pp" : "%"}
                  </Badge>
                </div>
                <div className="text-muted-foreground flex flex-wrap gap-x-1 text-xs">
                  <span>from {kpi.rate ? percent(kpi.previous) : number(kpi.previous)}</span>
                  <span>· prior period</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
