import type { Metadata } from "next";

import { MetricCards } from "./_components/metric-cards";
import { PerformanceOverview } from "./_components/performance-overview";
import { SubscriberOverview } from "./_components/subscriber-overview";

export const metadata: Metadata = {
  title: "NOREVA Business overview | Demo workspace",
  description:
    "Explore the NOREVA demo admin dashboard with business metrics, customer activity, performance charts, and customer data.",
  alternates: {
    canonical: "/dashboard/default",
  },
};

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-5">
        <div>
          <p className="text-muted-foreground text-xs tracking-widest uppercase">NOREVA · South Africa</p>
          <h1 className="mt-2 text-3xl tracking-tight">Your business, in focus.</h1>
          <p className="text-muted-foreground mt-2 text-sm">Revenue, relationships, and the next opportunity.</p>
        </div>
        <span className="text-muted-foreground text-xs">Demo workspace · ZAR</span>
      </header>
      <MetricCards />
      <PerformanceOverview />
      <SubscriberOverview />
    </div>
  );
}
