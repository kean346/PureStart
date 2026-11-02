import type { Metadata } from "next";

import { AnalyticsDashboard } from "./_components/analytics-dashboard";
import type { RangeKey } from "./_components/analytics-data";
import "@/styles/flag-icons/flags.css";

export const metadata: Metadata = {
  title: "NOREVA Insights | Analytics & Intelligence",
  description: "A fictional premium SaaS analytics experience, designed and built by paceIT.",
  alternates: { canonical: "/dashboard/analytics" },
};
export default async function Page({ searchParams }: { searchParams: Promise<{ view?: string; range?: string }> }) {
  const { view, range } = await searchParams;
  const initialView = ["overview", "audience", "acquisition", "engagement", "conversions"].includes(view ?? "")
    ? (view ?? "overview")
    : "overview";
  const initialRange: RangeKey = range === "7" || range === "84" ? range : "28";
  return <AnalyticsDashboard initialView={initialView} initialRange={initialRange} />;
}
