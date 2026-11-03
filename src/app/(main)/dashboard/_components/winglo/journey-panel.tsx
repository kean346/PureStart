"use client";
import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { ArrowLeft, ArrowRight, Minimize2, Pause, Play, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { type Journey, stageReady, stages } from "./journey";
import { hydrateDemo, useDemo } from "./store";

export function JourneyPanel() {
  const { data, journey: j, ready } = useDemo();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    void hydrateDemo();
  }, []);
  useEffect(() => {
    if (ready && j?.active && j.route !== pathname) useDemo.getState().patchJourney({ route: pathname });
  }, [pathname, ready, j?.active, j?.route]);
  if (!ready || !data || !j?.active) return null;
  const store = useDemo.getState();
  const quote = data.quotes.find((q) => q.id === j.quoteId);
  const customer = data.customers.find((c) => c.id === quote?.customerId);
  function focus(current: Journey) {
    const route = current.completed ? "/dashboard/demo" : stages[current.step].route;
    router.push(route);
    if (current.completed) return;
    if (current.step === 3 && (current.quoteId || current.enquiryId))
      store.requestEditor({ kind: "quote", recordId: current.quoteId ?? current.enquiryId ?? "", route });
    if (current.step === 5 && (current.bookingId || current.quoteId))
      store.requestEditor({ kind: "booking", recordId: current.bookingId ?? current.quoteId ?? "", route });
    if (current.step === 7 && current.bookingId)
      store.requestEditor({ kind: "booking", recordId: current.bookingId, route });
  }
  const resume = () => {
    store.patchJourney({ paused: false, minimized: false });
    focus(j);
  };
  const restart = () => {
    store.startJourney(true);
    router.push("/dashboard/demo");
    toast.info("New isolated scenario started. All existing business records are retained.");
  };
  if (j.minimized || j.paused)
    return (
      <aside className="pointer-events-none sticky bottom-3 mx-4 mb-4" aria-label="Guided demo progress">
        <Card className="pointer-events-auto ml-auto w-full max-w-xl">
          <CardContent className="flex flex-wrap items-center gap-3 pt-4">
            <span className="text-muted-foreground text-xs">
              Demo {j.paused ? "paused" : "minimised"} · Stage {j.step + 1}/8
            </span>
            <Button size="sm" onClick={resume}>
              <Play data-icon="inline-start" />
              Resume Demo
            </Button>
            <Button
              size="sm"
              variant="ghost"
              aria-label="Exit Demo"
              onClick={() => store.patchJourney({ active: false })}
            >
              <X />
            </Button>
          </CardContent>
        </Card>
      </aside>
    );
  return (
    <aside className="pointer-events-none sticky bottom-3 mx-4 mb-4" aria-label="Guided demo progress">
      <Card className="pointer-events-auto ml-auto w-full max-w-xl">
        <CardContent className="flex flex-col gap-3 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-primary text-xs">
                {j.completed ? "Journey complete" : `Stage ${j.step + 1} of ${stages.length}`} · Browser-local demo
              </p>
              <h2 className="mt-1 text-sm font-medium">
                {j.completed ? "A complete Winglo customer journey" : stages[j.step].title}
              </h2>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Minimise demo"
                onClick={() => store.patchJourney({ minimized: true })}
              >
                <Minimize2 />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Exit Demo"
                onClick={() => store.patchJourney({ active: false })}
              >
                <X />
              </Button>
            </div>
          </div>
          {j.step === 4 && !j.completed && quote && (
            <div className="bg-muted flex flex-col gap-3 rounded-lg p-3">
              <p className="text-sm font-medium">
                Quotation for {customer?.name} · {quote.id}
              </p>
              <p className="text-muted-foreground text-xs">Current status: {quote.status}</p>
              {["Draft", "Awaiting Approval"].includes(quote.status) && (
                <>
                  <p className="text-sm">1. Approve the sample quotation below. Sending is simulated.</p>
                  <Button
                    onClick={() => {
                      store.quoteStatus(quote.id, "Sent (Simulated)");
                      toast.success("Quotation approved · Sending simulated. Now simulate customer acceptance.");
                    }}
                  >
                    Approve quotation & simulate sending
                  </Button>
                </>
              )}
              {quote.status === "Sent (Simulated)" && (
                <>
                  <p className="text-sm">2. The quotation is approved. Now simulate the customer accepting it.</p>
                  <Button
                    onClick={() => {
                      store.quoteStatus(quote.id, "Accepted (Simulated)");
                      toast.success("Customer acceptance simulated. Select Next Step to create the booking.");
                    }}
                  >
                    Simulate customer accepting quotation
                  </Button>
                </>
              )}
              {quote.status === "Accepted (Simulated)" && (
                <p className="text-sm" role="status">
                  ✓ Quotation accepted. Select Next Step below to schedule the cleaning.
                </p>
              )}
              {["Rejected", "Expired"].includes(quote.status) && (
                <>
                  <p className="text-sm">This quotation needs another review before approval.</p>
                  <Button variant="outline" onClick={() => store.quoteStatus(quote.id, "Awaiting Approval")}>
                    Return quotation to review
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  router.push("/dashboard/quotations");
                  store.requestEditor({ kind: "quote", recordId: quote.id, route: "/dashboard/quotations" });
                }}
              >
                View or edit quotation prices
              </Button>
              <p className="text-muted-foreground text-xs">Simulation Only · No real messages sent.</p>
            </div>
          )}
          <Progress value={j.completed ? 100 : (j.completedSteps.length / 8) * 100} />
          <p className="text-muted-foreground text-xs">
            {j.completed
              ? "Your linked enquiry, quotation, booking and customer history are saved. Nothing was sent externally."
              : stages[j.step].instruction}
          </p>
          {!j.completed && !stageReady(j, data) && (
            <p className="text-muted-foreground text-xs" role="status">
              Complete the required action above to unlock the next stage.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={j.step === 0}
              onClick={() => {
                store.previousStage();
                const previous = useDemo.getState().journey;
                if (previous) focus(previous);
              }}
            >
              <ArrowLeft data-icon="inline-start" />
              Previous Step
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (j.completed) {
                  focus(j);
                  return;
                }
                if (pathname !== stages[j.step].route) {
                  focus(j);
                  return;
                }
                if (!store.advanceJourney()) {
                  toast.info(stages[j.step].instruction);
                  focus(j);
                  return;
                }
                const next = useDemo.getState().journey;
                if (next) focus(next);
              }}
            >
              {j.completed ? "View summary" : "Next Step"}
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => store.patchJourney({ paused: true })}>
              <Pause data-icon="inline-start" />
              Pause
            </Button>
            <Button size="sm" variant="ghost" onClick={restart}>
              <RotateCcw data-icon="inline-start" />
              Restart Demo
            </Button>
            {pathname !== stages[j.step].route && !j.completed && (
              <Button size="sm" variant="outline" onClick={resume}>
                Resume Demo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
