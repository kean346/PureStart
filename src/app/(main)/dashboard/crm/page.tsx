import type { Metadata } from "next";

import { KpiCards } from "./_components/kpi-cards";
import { OpportunitiesSection } from "./_components/opportunities-section";
import { PipelineActivity } from "./_components/pipeline-activity";
import { TaskReminders } from "./_components/task-reminders";

export const metadata: Metadata = {
  title: "NOREVA CRM | Demo workspace",
  description:
    "Explore the NOREVA demo CRM dashboard with pipeline activity, opportunities, sales performance, and task reminders.",
  alternates: {
    canonical: "/dashboard/crm",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <header className="flex flex-col gap-2 border-b pb-5">
        <p className="text-muted-foreground text-xs tracking-widest uppercase">NOREVA · Client relationships</p>
        <h1 className="text-3xl tracking-tight">Relationships worth growing.</h1>
        <p className="text-muted-foreground text-sm">
          Your regional pipeline, next conversations, and new opportunities — in rand.
        </p>
      </header>
      <KpiCards />
      <PipelineActivity />
      <TaskReminders />
      <OpportunitiesSection />
    </div>
  );
}
