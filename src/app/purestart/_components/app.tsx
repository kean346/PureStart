"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  Menu,
  Package,
  Play,
  Plus,
  Repeat2,
  Settings2,
  Shirt,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  X,
  Zap,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { Revenue } from "./charts";
import { analytics, type Data, day, displayDate, money, stages } from "./model";
import { Automation, Billing, Customers, Insights, Recurring, Scheduling, Settings } from "./operations";
import { OrderDetail, OrderEditor, Orders } from "./orders";
import { useDemo } from "./store";
import { Badge, Button, icons, OrderLink, Panel, Status } from "./ui";

const navigation = [
  { slug: "overview", title: "Overview", icon: LayoutDashboard },
  { slug: "orders", title: "Orders", icon: Shirt },
  { slug: "customers", title: "Customers", icon: Users },
  { slug: "scheduling", title: "Scheduling", icon: CalendarDays },
  { slug: "recurring", title: "Recurring Bookings", icon: Repeat2 },
  { slug: "automation", title: "Automation", icon: Zap },
  { slug: "billing", title: "Billing", icon: CreditCard },
  { slug: "insights", title: "Insights", icon: TrendingUp },
  { slug: "settings", title: "Settings", icon: Settings2 },
];
const tourSteps = [
  {
    path: "/purestart",
    target: "overview-metrics",
    title: "Your day, at a glance",
    text: "See what's happening across your business, all in one place. Orders, collections, deliveries and paid revenue.",
  },
  {
    path: "/purestart",
    target: "live-example",
    title: "Let's follow a real demo order",
    text: "Click Try a Live Example, or Next, to open PS-1042. It is the same order you will find in Orders.",
  },
  {
    path: "/purestart/orders/PS-1042",
    target: "order-progress",
    title: "A clear next step",
    text: "Click Mark as Collected to progress the order. Each update changes the shared order, scheduling and notification history.",
  },
  {
    path: "/purestart/orders/PS-1042",
    target: "order-activity",
    title: "One update keeps everything connected",
    text: "Your order activity and simulated customer notification were recorded together. Nothing was sent to a real customer.",
  },
  {
    path: "/purestart/scheduling",
    target: "schedule-calendar",
    title: "A calmer collection day",
    text: "Keep collections and deliveries organised throughout the day. Open a stop to view the connected order.",
  },
  {
    path: "/purestart/automation",
    target: "automation-flow",
    title: "Thoughtful updates, less repetition",
    text: "Choose a trigger and click Simulate Automation to record a customer update. This is a simulation; no message is sent.",
  },
  {
    path: "/purestart/insights",
    target: "insights-charts",
    title: "Everyday activity. Useful insights.",
    text: "See paid revenue, service demand and outstanding payments, calculated from the same fictional records.",
  },
];
function Overview({ data, openNew, live }: { data: Data; openNew: () => void; live: () => void }) {
  const a = analytics(data, 3650);
  const today = day();
  const schedule = data.orders
    .flatMap((o) => [
      { order: o, type: "Collection", time: o.collection, due: ["New", "Scheduled"].includes(o.status) },
      { order: o, type: "Delivery", time: o.delivery, due: o.status !== "Delivered" },
    ])
    .filter((e) => e.due)
    .sort((a, b) => a.time.localeCompare(b.time));
  const todaySchedule = schedule.filter((e) => e.time.startsWith(today));
  return (
    <div className="flex flex-col gap-7">
      <div className="ps-overview-heading">
        <div>
          <p className="ps-eyebrow">A LITTLE CLARITY. A FRESH START.</p>
          <h1>Your day, beautifully organised.</h1>
          <p>From the first collection to the last delivery. All in one place.</p>
        </div>
        <Button size="lg" onClick={openNew}>
          <Plus data-icon="inline-start" />
          New order
        </Button>
      </div>
      <section id="live-example" className="ps-live-card">
        <div className="ps-live-icon">
          <Shirt size={30} />
        </div>
        <div>
          <Badge variant="secondary">YOUR INTERACTIVE WORKSPACE</Badge>
          <h2>See PureStart OS in action</h2>
          <p>Follow a laundry order from collection to delivery and see how the system works.</p>
        </div>
        <Button size="lg" onClick={live}>
          Try a Live Example
          <ArrowRight data-icon="inline-end" />
        </Button>
        <div className="ps-live-decoration" aria-hidden>
          <span />
          <span />
          <span />
          <Check size={20} />
        </div>
      </section>
      <div id="overview-metrics" className="ps-metrics">
        {[
          {
            label: "ORDERS TODAY",
            value: data.orders.filter((o) => o.created.startsWith(today)).length,
            hint: "A fresh load of possibility",
            icon: Shirt,
          },
          {
            label: "AWAITING COLLECTION",
            value: data.orders.filter((o) => ["New", "Scheduled"].includes(o.status)).length,
            hint: `${todaySchedule.filter((e) => e.type === "Collection").length} collections planned today`,
            icon: Truck,
          },
          {
            label: "IN PROCESSING",
            value: data.orders.filter((o) => o.status === "Processing").length,
            hint: `${data.orders.filter((o) => o.status === "Ready for Delivery").length} ready for delivery`,
            icon: Sparkles,
          },
          {
            label: "PAID REVENUE",
            value: money(a.paid),
            hint: `${data.orders.filter((o) => o.status === "Delivered").length} completed orders · all demo dates`,
            icon: TrendingUp,
          },
        ].map((m) => (
          <div key={m.label}>
            <span className="ps-metric-icon">
              <m.icon size={18} />
            </span>
            <small>{m.label}</small>
            <strong>{m.value}</strong>
            <p>{m.hint}</p>
          </div>
        ))}
      </div>
      <Panel
        title="The rhythm of your operations"
        description="Every order has a place. Every stage has a next step."
        action={
          <Button asChild variant="ghost">
            <Link href="/purestart/orders">
              All orders
              <ArrowUpRight />
            </Link>
          </Button>
        }
      >
        <div className="ps-pipeline">
          {stages.map((s, i) => {
            const Icon = icons[i];
            return (
              <Link href={`/purestart/orders?status=${encodeURIComponent(s)}`} key={s}>
                <Icon size={20} />
                <strong>{data.orders.filter((o) => o.status === s).length}</strong>
                <span>{s === "Ready for Delivery" ? "Ready" : s === "Out for Delivery" ? "Out for delivery" : s}</span>
                <ChevronRight size={14} className="ps-pipeline-arrow" />
              </Link>
            );
          })}
        </div>
      </Panel>
      <div className="ps-dashboard-grid">
        <Revenue data={data} />
        <Panel
          title="Today's schedule"
          description={new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" })}
          action={
            <Button asChild variant="ghost" size="icon" aria-label="View today's schedule">
              <Link href="/purestart/scheduling">
                <ArrowUpRight />
              </Link>
            </Button>
          }
        >
          <div className="ps-agenda">
            {todaySchedule.slice(0, 4).map((e) => (
              <div key={`${e.order.id}-${e.type}`}>
                <span>{e.time.slice(11, 16)}</span>
                <div>
                  <small>{e.type}</small>
                  <OrderLink id={e.order.id}>{data.customers.find((c) => c.id === e.order.customerId)?.name}</OrderLink>
                  <p>
                    {e.order.driver} · {e.order.items[0].service}
                  </p>
                </div>
              </div>
            ))}
            {!todaySchedule.length && (
              <p className="text-muted-foreground">A clear schedule today. Plan the next collection in Orders.</p>
            )}
          </div>
        </Panel>
      </div>
      <div className="ps-two-col">
        <Panel title="A little attention goes a long way" description="Your next operational priorities">
          <div className="ps-priorities">
            {schedule.slice(0, 3).map((e) => (
              <div key={`${e.order.id}-${e.type}`}>
                <span className="ps-priority-dot" />
                <div>
                  <strong>
                    {e.type} {e.time.slice(0, 10) < today ? "overdue" : "due"}
                  </strong>
                  <p>
                    {e.order.id} · {displayDate(e.time)}
                  </p>
                </div>
                <OrderLink id={e.order.id}>Open</OrderLink>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Built for the way you work" description="Explore a more connected working day">
          <div className="ps-shortcuts">
            <Link href="/purestart/recurring">
              <Repeat2 size={20} />
              <span>
                Put repeat bookings on a rhythm<small>Generate the next connected order</small>
              </span>
              <ArrowRight size={18} />
            </Link>
            <Link href="/purestart/automation">
              <Zap size={20} />
              <span>
                Make every update feel personal<small>Explore automation simulations</small>
              </span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}
export function PureStart({ section, orderId }: { section: string; orderId?: string }) {
  const data = useDemo((s) => s.data);
  const hydrate = useDemo((s) => s.hydrate);
  const update = useDemo((s) => s.update);
  const storageError = useDemo((s) => s.storageError);
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [creating, setCreating] = useState(false);
  const tour = useDemo((s) => s.tour);
  const setTour = useDemo((s) => s.setTour);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  useEffect(() => {
    if (data && !data.welcomed) setWelcome(true);
  }, [data]);
  useEffect(() => {
    if (tour === null || tour >= tourSteps.length) return;
    const step = tourSteps[tour];
    const expectedSection = step.path.split("/")[2] ?? "overview";
    if (section !== expectedSection || (expectedSection === "orders" && orderId !== "PS-1042")) return;
    let element: HTMLElement | null = null;
    const timer = setTimeout(() => {
      element = document.getElementById(step.target);
      if (element) {
        element.classList.add("ps-tour-target");
        element.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
          block: "center",
        });
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      element?.classList.remove("ps-tour-target");
    };
  }, [tour, section, orderId]);
  const dismiss = () => {
    update((d) => ({ ...d, welcomed: true }));
    setWelcome(false);
  };
  const startTour = () => {
    dismiss();
    setTour(0);
    router.push(tourSteps[0].path);
  };
  const moveTour = (next: number) => {
    setTour(next);
    if (next < tourSteps.length) router.push(tourSteps[next].path);
  };
  const live = () => {
    if (tour === 1) setTour(2);
    router.push("/purestart/orders/PS-1042");
  };
  if (!data)
    return (
      <div className="ps-theme min-h-screen p-8">
        <Skeleton className="mb-6 h-12 w-60" />
        <Skeleton className="h-80 w-full" />
        <p className="mt-4">Preparing your PureStart workspace…</p>
      </div>
    );
  const title = navigation.find((n) => n.slug === section)?.title ?? "Overview";
  const collected = stages.indexOf(data.orders.find((o) => o.id === "PS-1042")?.status ?? "Scheduled") >= 2;
  const gated = tour === 2 && !collected;
  return (
    <div className="ps-theme" data-tour={tour !== null}>
      <aside className="ps-sidebar" data-open={mobile}>
        <Link href="/purestart" className="ps-brand" onClick={() => setMobile(false)}>
          <span className="ps-logomark">
            <Shirt size={21} />
          </span>
          PureStart<span className="ps-os">OS</span>
        </Link>
        <div className="ps-workspace">
          <span>PURESTART WORKSPACE</span>
          <Badge variant="secondary">Demo</Badge>
        </div>
        <nav aria-label="PureStart navigation">
          {navigation.map((n, i) => (
            <Link
              href={n.slug === "overview" ? "/purestart" : `/purestart/${n.slug}`}
              key={n.slug}
              aria-current={section === n.slug ? "page" : undefined}
              onClick={() => setMobile(false)}
              className={i === 6 ? "ps-nav-break" : ""}
            >
              <n.icon size={19} />
              <span>{n.title}</span>
              {n.slug === "orders" && <small>{data.orders.length}</small>}
            </Link>
          ))}
        </nav>
        <div className="ps-sidebar-bottom">
          <div className="ps-help">
            <span className="ps-help-icon">
              <Sparkles size={20} />
            </span>
            <h3>A fresh way to work.</h3>
            <p>Take a quick look around your connected workspace.</p>
            <Button variant="outline" onClick={startTour}>
              Take a Guided Tour
              <ArrowRight />
            </Button>
          </div>
          <p className="ps-demo-label">
            <span />
            Concept Demo · Fictional Data
          </p>
          <div className="ps-credit">
            <span className="ps-avatar">P</span>
            <div>
              <strong>PureStart OS</strong>
              <small>Concept by paceIT</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="ps-main">
        <header className="ps-header">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={mobile ? "Close navigation" : "Open navigation"}
              aria-expanded={mobile}
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X /> : <Menu />}
            </Button>
            <span className="ps-breadcrumb">
              Workspace <ChevronRight size={13} /> <strong>{title}</strong>
              {orderId && (
                <>
                  {" "}
                  <ChevronRight size={13} /> {orderId}
                </>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="ps-header-date">
              {new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <Button variant="ghost" size="icon" aria-label="Reopen welcome" onClick={() => setWelcome(true)}>
              <CircleHelp />
            </Button>
            <span className="ps-avatar ps-header-avatar">PS</span>
          </div>
        </header>
        <main className="ps-content" id="purestart-main">
          {storageError && (
            <Alert className="mb-6">
              <AlertTitle>Storage notice</AlertTitle>
              <AlertDescription>{storageError}</AlertDescription>
            </Alert>
          )}
          {section !== "overview" && (
            <div className="ps-page-heading">
              <div>
                <p className="ps-eyebrow">PURESTART OS / {title.toUpperCase()}</p>
                <h1>{orderId ? "Every load, a little closer." : title}</h1>
                <p>
                  {
                    (
                      {
                        orders: "From booking to doorstep. Keep every detail connected.",
                        customers: "Familiar faces. Thoughtful service.",
                        scheduling: "The right place, at the right time.",
                        recurring: "Keep the good things coming.",
                        automation: "Less repetition. More time for your business.",
                        billing: "Clear invoices. Confident decisions.",
                        insights: "Understand the story behind your working day.",
                        settings: "Your business, your way.",
                      } as Record<string, string>
                    )[section]
                  }
                </p>
              </div>
              <Button variant="outline" onClick={startTour}>
                <Play />
                Guided tour
              </Button>
            </div>
          )}
          {section === "overview" && <Overview data={data} openNew={() => setCreating(true)} live={live} />}
          {section === "orders" &&
            (orderId ? (
              <OrderDetail data={data} id={orderId} />
            ) : (
              <Orders data={data} openNew={() => setCreating(true)} />
            ))}
          {section === "customers" && <Customers data={data} />}
          {section === "scheduling" && <Scheduling data={data} />}
          {section === "recurring" && <Recurring data={data} />}
          {section === "automation" && <Automation data={data} />}
          {section === "billing" && <Billing data={data} />}
          {section === "insights" && <Insights data={data} />}
          {section === "settings" && <Settings data={data} />}
          <footer className="ps-footer">
            <span>Thoughtfully connected. PureStart OS.</span>
            <span>
              Designed by <strong>paceIT</strong>
            </span>
          </footer>
        </main>
      </div>
      {creating && <OrderEditor data={data} close={() => setCreating(false)} />}
      {welcome && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) dismiss();
          }}
        >
          <DialogContent className="ps-surface ps-welcome max-h-[94dvh] overflow-y-auto sm:max-w-5xl">
            <div className="ps-welcome-copy">
              <span className="ps-brand">
                <span className="ps-logomark">
                  <Shirt size={21} />
                </span>
                PureStart<span className="ps-os">OS</span>
              </span>
              <p className="ps-eyebrow">A FRESH START FOR YOUR BUSINESS</p>
              <DialogTitle className="ps-welcome-title">
                Welcome to
                <br />
                PureStart OS
              </DialogTitle>
              <DialogDescription>
                One place to manage your orders, customers, collections and deliveries.
              </DialogDescription>
              <div className="ps-welcome-features">
                {[
                  { icon: Package, title: "Manage Every Order", text: "Follow each order from booking to delivery." },
                  {
                    icon: CalendarDays,
                    title: "Simplify Daily Operations",
                    text: "Keep collections, deliveries and repeat bookings organised.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Understand Your Business",
                    text: "See orders, revenue and performance in one place.",
                  },
                ].map((f) => (
                  <div key={f.title}>
                    <span>
                      <f.icon size={19} />
                    </span>
                    <div>
                      <h3>{f.title}</h3>
                      <p>{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={dismiss}>
                  Explore PureStart OS
                  <ArrowRight />
                </Button>
                <Button size="lg" variant="outline" onClick={startTour}>
                  Take a Guided Tour
                </Button>
              </div>
              <small>An interactive concept by paceIT · Fictional data</small>
            </div>
            <div className="ps-welcome-preview">
              <Badge variant="secondary">ONE CONNECTED WORKSPACE</Badge>
              <h2>
                Less admin.
                <br />
                More fresh starts.
              </h2>
              <div className="ps-mini-order">
                <div className="flex justify-between gap-3">
                  <strong>PS-1042</strong>
                  <Status status={data.orders.find((o) => o.id === "PS-1042")?.status ?? "Scheduled"} />
                </div>
                <p>{data.customers[0].name} · Wash & Fold</p>
                <div className="ps-mini-stages">
                  {["Scheduled", "Collected", "Delivered"].map((s, i) => (
                    <div key={s}>
                      <span>{i === 0 ? <Check size={15} /> : i + 1}</span>
                      <small>{s}</small>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    dismiss();
                    live();
                  }}
                >
                  Try a Live Example
                  <ArrowRight />
                </Button>
              </div>
              <div className="ps-mini-stats">
                <div>
                  <small>Active orders</small>
                  <strong>{data.orders.filter((o) => o.status !== "Delivered").length}</strong>
                </div>
                <div>
                  <small>Paid revenue</small>
                  <strong>{money(analytics(data, 3650).paid)}</strong>
                </div>
              </div>
              <p>
                Real interactions. Shared demo data.
                <br />A glimpse of a simpler working day.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {tour !== null && (
        <aside className="ps-tour" aria-label="Guided tour" aria-live="polite">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {tour < tourSteps.length ? `YOUR WORKSPACE · ${tour + 1} OF ${tourSteps.length}` : "TOUR COMPLETE"}
            </Badge>
            <Button variant="ghost" size="icon" aria-label="Close guided tour" onClick={() => setTour(null)}>
              <X />
            </Button>
          </div>
          <div className="ps-tour-progress">
            <span style={{ width: `${Math.min(100, ((tour + 1) / tourSteps.length) * 100)}%` }} />
          </div>
          <h2>{tour < tourSteps.length ? tourSteps[tour].title : "That's just the beginning."}</h2>
          <p>
            {tour < tourSteps.length
              ? tourSteps[tour].text
              : "This concept shows how your business operations could work together in one system."}
          </p>
          {gated && <small>Progress PS-1042 to Collected to continue.</small>}
          <div className="mt-4 flex flex-wrap gap-2">
            {tour > 0 && (
              <Button variant="outline" onClick={() => moveTour(tour - 1)}>
                Back
              </Button>
            )}
            {tour < tourSteps.length ? (
              <Button disabled={gated} onClick={() => moveTour(tour + 1)}>
                Next
                <ArrowRight />
              </Button>
            ) : (
              <>
                <Button onClick={() => setTour(null)}>Continue Exploring</Button>
                <Button variant="outline" onClick={startTour}>
                  Restart Tour
                </Button>
              </>
            )}
            <Button variant="ghost" onClick={() => setTour(null)}>
              Skip Tour
            </Button>
          </div>
          <small>Designed by paceIT</small>
        </aside>
      )}
    </div>
  );
}
