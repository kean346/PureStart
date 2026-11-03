"use client";
import { Panel } from "./shared";
import { useDemo, useDemoData } from "./store";
export function DemoActivity() {
  const activity = useDemo((s) => s.activity);
  const d = useDemoData();
  return (
    <Panel title="Demo Activity" description="Actions actually performed in this browser · No messages sent">
      {activity.length ? (
        <ol className="flex max-h-72 flex-col gap-4 overflow-y-auto">
          {activity.slice(0, 15).map((e) => (
            <li key={e.id} className="flex flex-wrap items-start justify-between gap-2 border-b pb-3 last:border-0">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{e.label}</span>
                <span className="text-muted-foreground text-xs">
                  {d.customers.find((c) => c.id === e.customerId)?.name} · {e.recordId}
                </span>
              </div>
              <time className="text-muted-foreground text-xs" dateTime={e.time}>
                {new Date(e.time).toLocaleString("en-ZA")}
              </time>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-muted-foreground text-sm">
          Your next enquiry, quotation, booking or reminder preview will appear here.
        </p>
      )}
    </Panel>
  );
}
