"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AnalyticsContext } from "./analytics-context";
import { getAnalytics, type RangeKey } from "./analytics-data";
import { AnalyticsDetail, WebsiteActivity } from "./analytics-detail";
import { AnalyticsKpiStrip } from "./analytics-kpi-strip";
import { AnalyticsToolbar } from "./analytics-toolbar";
import { RealtimeVisitors } from "./realtime-visitors";
import { TopPages } from "./top-pages";
import { TopTrafficSources } from "./top-traffic-sources";
import { TrafficQuality } from "./traffic-quality";

const views = ["overview", "audience", "acquisition", "engagement", "conversions"];
export function AnalyticsDashboard({ initialView, initialRange }: { initialView: string; initialRange: RangeKey }) {
  const [range, setRange] = useState(initialRange);
  const [view, setView] = useState(initialView);
  const data = getAnalytics(range);
  useEffect(() => {
    setView(initialView);
    setRange(initialRange);
  }, [initialView, initialRange]);
  const updateUrl = (nextView: string, nextRange: RangeKey) => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", nextView);
    url.searchParams.set("range", nextRange);
    window.history.replaceState(null, "", url.toString());
  };
  return (
    <AnalyticsContext value={data}>
      <div className="noreva-dashboard flex min-w-0 flex-col gap-4">
        <div className="noreva-reveal flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">NOREVA Insights</p>
            <h1 className="text-3xl tracking-tight">A clearer view of your growth.</h1>
            <p className="text-muted-foreground text-sm">
              Traffic, engagement, and the moments that move your business forward.
            </p>
          </div>
          <Badge variant="outline">Fictional demo</Badge>
        </div>
        <Tabs
          value={view}
          onValueChange={(next) => {
            setView(next);
            updateUrl(next, range);
          }}
          className="flex min-w-0 flex-col gap-4"
        >
          <div
            className="noreva-reveal flex min-w-0 flex-wrap items-center justify-between gap-3"
            style={{ animationDelay: "100ms" }}
          >
            <div className="max-w-full min-w-0 overflow-x-auto pb-1">
              <TabsList className="gap-1">
                {views.map((tab) => (
                  <TabsTrigger key={tab} value={tab} className="capitalize">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <AnalyticsToolbar
              onRangeChange={(next) => {
                setRange(next);
                updateUrl(view, next);
              }}
              onReplay={() => document.querySelector("[data-motion-page]")?.dispatchEvent(new Event("noreva:replay"))}
            />
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-xs">
            <span>
              {data.period} · compared with the preceding {data.days} days
            </span>
            <span>Stable demo dataset · UTC</span>
          </div>
          <div key={range} className="flex min-w-0 flex-col gap-4">
            <AnalyticsKpiStrip />
            <TabsContent value="overview" className="flex flex-col gap-4">
              <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
                <div className="noreva-reveal min-w-0 xl:col-span-7" style={{ animationDelay: "430ms" }}>
                  <TrafficQuality />
                </div>
                <div className="noreva-reveal min-w-0 xl:col-span-5" style={{ animationDelay: "510ms" }}>
                  <RealtimeVisitors />
                </div>
              </div>
              <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
                <div className="noreva-reveal min-w-0 xl:col-span-7" style={{ animationDelay: "590ms" }}>
                  <TopPages />
                </div>
                <div className="noreva-reveal min-w-0 xl:col-span-5" style={{ animationDelay: "670ms" }}>
                  <TopTrafficSources />
                </div>
              </div>
            </TabsContent>
            {["audience", "engagement", "conversions"].map((tab) => (
              <TabsContent key={tab} value={tab} className="noreva-reveal">
                <AnalyticsDetail view={tab} />
              </TabsContent>
            ))}
            <TabsContent value="acquisition" className="noreva-reveal grid gap-4 lg:grid-cols-2">
              <TopTrafficSources />
              <WebsiteActivity />
            </TabsContent>
          </div>
        </Tabs>
        <footer className="text-muted-foreground mt-2 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs">
          <span>
            Fictional concept · Built by <span className="text-foreground font-medium">paceIT</span>
          </span>
          <span>Illustrative data. No real business results.</span>
        </footer>
      </div>
    </AnalyticsContext>
  );
}
