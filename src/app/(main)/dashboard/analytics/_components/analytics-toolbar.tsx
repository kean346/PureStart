"use client";

import { Ellipsis, FileDown, RefreshCw, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useAnalytics } from "./analytics-context";
import { type RangeKey, rangeLabels } from "./analytics-data";
export function AnalyticsToolbar({
  onRangeChange,
  onReplay,
}: {
  onRangeChange: (range: RangeKey) => void;
  onReplay: () => void;
}) {
  const data = useAnalytics();
  const exportReport = () => {
    const rows = [
      "NOREVA Insights — fictional concept by paceIT",
      `Period,${data.period}`,
      "Metric,Value",
      ...data.kpis.map((kpi) => `${kpi.label},${kpi.value.toFixed(kpi.rate ? 1 : 0)}`),
      "",
      "Date,Visitors,Sessions,Pageviews,Engaged sessions,Conversions",
      ...data.daily.map(
        (day) => `${day.date},${day.visitors},${day.sessions},${day.pageviews},${day.engaged},${day.conversions}`,
      ),
    ];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `noreva-insights-${data.days}-days.csv`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Your demo report has been exported.");
  };
  const share = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("range", data.range);
    try {
      await navigator.clipboard.writeText(url.toString());
      toast.success("Dashboard link copied, including the selected range.");
    } catch {
      toast.info("Copy the dashboard URL from your browser to share this demo.");
    }
  };
  return (
    <div className="flex items-center gap-2">
      <Select value={data.range} onValueChange={(value) => onRangeChange(value as RangeKey)}>
        <SelectTrigger className="w-36" aria-label="Date range">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(rangeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={exportReport}>
        <FileDown data-icon="inline-start" />
        <span className="hidden sm:inline">Export</span>
        <span className="sr-only sm:hidden">Export report</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" aria-label="More analytics actions">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Demo actions</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => {
                void share();
              }}
            >
              <Share2 />
              Copy dashboard link
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onReplay}>
              <RefreshCw />
              Replay entrance
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
