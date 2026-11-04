"use client";
import { useState } from "react";

import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Pencil,
  Plus,
  Printer,
  ReceiptText,
  Repeat2,
  Send,
  Zap,
} from "lucide-react";

import { AnimatedValue } from "@/components/motion/animated-value";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

import { Revenue, ServiceChart } from "./charts";
import {
  analytics,
  type Customer,
  type Data,
  dateAt,
  day,
  displayDate,
  generate,
  issueInvoice,
  money,
  type Rule,
  seed,
} from "./model";
import { useDemo } from "./store";
import { Badge, Blank, Button, LabelField, OrderLink, Panel, perform, Status } from "./ui";

export function Scheduling({ data }: { data: Data }) {
  const [date, setDate] = useState(day());
  const [view, setView] = useState("Day");
  const dates = Array.from({ length: view === "Day" ? 1 : 7 }, (_, i) => {
    const d = new Date(`${date}T12:00:00`);
    d.setDate(d.getDate() + i);
    return day(d);
  });
  const events = data.orders
    .flatMap((o) => [
      { order: o, type: "Collection", time: o.collection, done: !["New", "Scheduled"].includes(o.status) },
      { order: o, type: "Delivery", time: o.delivery, done: o.status === "Delivered" },
    ])
    .sort((a, b) => a.time.localeCompare(b.time));
  const shift = (amount: number) => {
    const d = new Date(`${date}T12:00:00`);
    d.setDate(d.getDate() + amount);
    setDate(day(d));
  };
  return (
    <Panel
      id="schedule-calendar"
      title="Good days start with a clear plan"
      description="Collection and delivery stops · 30-minute planning windows"
      action={
        <Button asChild variant="outline">
          <Link href="/purestart/orders">
            Manage orders
            <ArrowRight />
          </Link>
        </Button>
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous period"
          onClick={() => shift(view === "Day" ? -1 : -7)}
        >
          <ChevronLeft />
        </Button>
        <Input
          aria-label="Schedule date"
          type="date"
          className="w-auto"
          value={date}
          onChange={(e) => e.target.value && setDate(e.target.value)}
        />
        <Button variant="outline" size="icon" aria-label="Next period" onClick={() => shift(view === "Day" ? 1 : 7)}>
          <ChevronRight />
        </Button>
        <Button variant="outline" onClick={() => setDate(day())}>
          Today
        </Button>
        <NativeSelect aria-label="Calendar view" value={view} onChange={(e) => setView(e.target.value)}>
          <option>Day</option>
          <option>Week</option>
        </NativeSelect>
      </div>
      <div className={view === "Week" ? "ps-week" : "ps-day"}>
        {dates.map((d) => (
          <section key={d}>
            <h3 className="ps-calendar-date">
              {new Date(`${d}T12:00`).toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" })}
            </h3>
            {events
              .filter((e) => e.time.startsWith(d))
              .map((e) => (
                <article className="ps-stop" data-type={e.type} data-done={e.done} key={`${e.order.id}-${e.type}`}>
                  <div className="flex justify-between gap-2">
                    <small>{e.time.slice(11, 16)}</small>
                    <Badge variant="secondary">{e.done ? "Done" : e.type}</Badge>
                  </div>
                  <OrderLink id={e.order.id}>{data.customers.find((c) => c.id === e.order.customerId)?.name}</OrderLink>
                  <p>
                    {e.type} · {e.order.driver}
                  </p>
                  <small>{e.order.items.map((i) => i.service).join(", ")}</small>
                </article>
              ))}
            {!events.some((e) => e.time.startsWith(d)) && (
              <p className="p-4 text-sm text-muted-foreground">No stops planned.</p>
            )}
          </section>
        ))}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">
        Open a stop to edit its date, time or driver before invoicing. Planning only; no GPS or route optimisation.
      </p>
    </Panel>
  );
}
export function Recurring({ data }: { data: Data }) {
  const update = useDemo((s) => s.update);
  const [creating, setCreating] = useState(false);
  return (
    <>
      <Panel
        title="A familiar rhythm. Less admin."
        description="Repeat bookings that stay connected to orders and scheduling"
        action={
          <Button onClick={() => setCreating(true)}>
            <Plus />
            New recurring booking
          </Button>
        }
      >
        <div className="ps-order-grid">
          {data.recurring.map((rule) => (
            <article className="ps-order-card" key={rule.id}>
              <div className="flex items-center justify-between">
                <Repeat2 className="text-primary" />
                <Badge variant="secondary">{rule.frequency}</Badge>
              </div>
              <h3>{data.customers.find((c) => c.id === rule.customerId)?.name}</h3>
              <p>
                {rule.quantity} × {rule.service}
              </p>
              <div className="ps-recurring-date">
                <CalendarDays size={18} />
                <div>
                  <small>Next collection</small>
                  <strong>{displayDate(rule.next)}</strong>
                </div>
              </div>
              <Button
                onClick={() =>
                  perform(
                    () => update((d) => generate(d, rule.id, rule.next)),
                    "Next booking generated in Orders and Scheduling",
                  )
                }
              >
                Generate Next Booking
                <ArrowRight />
              </Button>
              <small>Generation advances to the following occurrence.</small>
              {rule.occurrences.length > 0 && (
                <div className="flex flex-col gap-2">
                  <strong>Previous occurrences</strong>
                  {rule.occurrences.map((id) => (
                    <OrderLink key={id} id={id} />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
        {!data.recurring.length && <Blank />}
      </Panel>
      {creating && (
        <Dialog open onOpenChange={(open) => !open && setCreating(false)}>
          <DialogContent className="ps-surface">
            <DialogTitle>New recurring booking</DialogTitle>
            <DialogDescription>A rule creates orders only when you generate an occurrence.</DialogDescription>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const rule: Rule = {
                  id: crypto.randomUUID(),
                  customerId: String(f.get("customer")),
                  service: String(f.get("service")),
                  quantity: Number(f.get("quantity")),
                  frequency: String(f.get("frequency")) as Rule["frequency"],
                  next: `${f.get("next")}:00`,
                  occurrences: [],
                };
                perform(() => update((d) => ({ ...d, recurring: [...d.recurring, rule] })));
                setCreating(false);
              }}
            >
              <FieldGroup>
                <LabelField label="Customer">
                  <NativeSelect name="customer">
                    {data.customers.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </NativeSelect>
                </LabelField>
                <LabelField label="Service">
                  <NativeSelect name="service">
                    {data.settings.services.map((s) => (
                      <option key={s.name}>{s.name}</option>
                    ))}
                  </NativeSelect>
                </LabelField>
                <LabelField label="Quantity">
                  <Input name="quantity" type="number" min="0.1" step="0.1" defaultValue="5" required />
                </LabelField>
                <LabelField label="Frequency">
                  <NativeSelect name="frequency">
                    <option>Weekly</option>
                    <option>Fortnightly</option>
                    <option>Monthly</option>
                  </NativeSelect>
                </LabelField>
                <LabelField label="Next collection">
                  <Input name="next" type="datetime-local" defaultValue={dateAt(1).slice(0, 16)} required />
                </LabelField>
                <Button type="submit">Create recurring booking</Button>
              </FieldGroup>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
export const automations = [
  "Booking confirmation",
  "Collection reminder",
  "Order collected notification",
  "Ready for delivery",
  "Delivery notification",
  "Invoice notification",
];
export function Automation({ data }: { data: Data }) {
  const update = useDemo((s) => s.update);
  const [rule, setRule] = useState(automations[0]);
  const [id, setId] = useState("PS-1042");
  const [active, setActive] = useState(false);
  const order = data.orders.find((o) => o.id === id) ?? data.orders[0];
  const customer = data.customers.find((c) => c.id === order.customerId);
  const message = `Hi ${customer?.name.split(" ")[0]}, ${rule.toLowerCase()} for order ${order.id}. ${rule === "Collection reminder" ? `Collection: ${displayDate(order.collection)}.` : rule === "Invoice notification" ? `Your example total is ${money(order.total)}.` : `Current status: ${order.status.toLowerCase()}.`} Thank you for choosing PureStart.`;
  return (
    <div id="automation-flow" className="flex flex-col gap-6">
      <Alert>
        <Zap />
        <AlertTitle>Automation Simulation</AlertTitle>
        <AlertDescription>Explore the flow. No WhatsApp, email or SMS is sent.</AlertDescription>
      </Alert>
      <div className="ps-two-col">
        <Panel title="Small moments. Automatically connected." description="Select a trigger and a real demo order">
          <div className="mb-6 flex flex-wrap gap-3">
            <NativeSelect
              aria-label="Automation trigger"
              value={rule}
              onChange={(e) => {
                setRule(e.target.value);
                setActive(false);
              }}
            >
              {automations.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </NativeSelect>
            <NativeSelect
              aria-label="Automation order"
              value={order.id}
              onChange={(e) => {
                setId(e.target.value);
                setActive(false);
              }}
            >
              {data.orders.map((o) => (
                <option key={o.id}>{o.id}</option>
              ))}
            </NativeSelect>
          </div>
          <ol className="ps-flow" data-active={active}>
            {[
              { title: rule, description: `Trigger · ${order.id}`, icon: Zap },
              {
                title: "Prepare customer message",
                description: "Personalised from order details",
                icon: MessageCircle,
              },
              {
                title: "Preview, then record",
                description: active ? "Simulation logged successfully" : "Ready to simulate",
                icon: active ? Check : Send,
              },
            ].map((node, i) => (
              <li key={node.title}>
                <span>
                  <node.icon size={20} />
                </span>
                <div>
                  <small>0{i + 1}</small>
                  <h3>{node.title}</h3>
                  <p>{node.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <Button
            size="lg"
            onClick={() => {
              perform(
                () =>
                  update((d) => ({
                    ...d,
                    events: [
                      {
                        id: crypto.randomUUID(),
                        orderId: order.id,
                        text: `Simulation: ${rule}`,
                        message,
                        at: new Date().toISOString(),
                      },
                      ...d.events,
                    ],
                  })),
                "Automation simulated. No message sent.",
              );
              setActive(true);
            }}
          >
            <Zap />
            Simulate Automation
          </Button>
        </Panel>
        <Panel
          title="A thoughtful update, at the right time"
          description="Customer message preview · fictional contact"
        >
          <div className="ps-phone-preview">
            <div className="ps-phone-header">
              <span className="ps-logo-small">P</span>
              <div>
                <strong>PureStart</strong>
                <small>Simulated business conversation</small>
              </div>
            </div>
            <blockquote>
              {message}
              <small>Preview only · never sent</small>
            </blockquote>
            <p>Messages would appear here through an official provider in a production system.</p>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {data.events
              .filter((e) => e.text.startsWith("Simulation:"))
              .slice(0, 4)
              .map((e) => (
                <div className="ps-simulation-log" key={e.id}>
                  <Check size={16} />
                  <span>
                    {e.text}
                    <small>
                      {displayDate(e.at)} · {e.orderId}
                    </small>
                  </span>
                </div>
              ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
export function Customers({ data }: { data: Data }) {
  const update = useDemo((s) => s.update);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [editing, setEditing] = useState<Customer | "new" | null>(null);
  return (
    <>
      <Panel
        title="People behind every order"
        description="Fictional customers · connected history"
        action={
          <Button onClick={() => setEditing("new")}>
            <Plus />
            New customer
          </Button>
        }
      >
        <Input
          className="mb-6 max-w-sm"
          aria-label="Search customers"
          placeholder="Find a customer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="ps-order-grid">
          {data.customers
            .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
            .map((c) => (
              <button type="button" className="ps-customer-card" key={c.id} onClick={() => setSelected(c)}>
                <span className="ps-avatar">
                  {c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <h3>{c.name}</h3>
                <p>{c.email}</p>
                <small>
                  {data.orders.filter((o) => o.customerId === c.id).length} orders <ArrowRight size={14} />
                </small>
              </button>
            ))}
        </div>
      </Panel>
      {selected && (
        <Dialog open onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent className="ps-surface max-h-[90dvh] overflow-y-auto sm:max-w-xl">
            <DialogTitle>{selected.name}</DialogTitle>
            <DialogDescription>
              {selected.email} · {selected.address}
            </DialogDescription>
            <p>{selected.notes || "No internal notes yet."}</p>
            <Button
              variant="outline"
              onClick={() => {
                setEditing(selected);
                setSelected(null);
              }}
            >
              <Pencil />
              Edit customer and notes
            </Button>
            <h3>Order history</h3>
            {data.orders
              .filter((o) => o.customerId === selected.id)
              .map((o) => (
                <div className="flex items-center justify-between" key={o.id}>
                  <OrderLink id={o.id} />
                  <Status status={o.status} />
                </div>
              ))}
            <h3>Outstanding invoices</h3>
            {data.invoices
              .filter((i) => !i.paid && data.orders.find((o) => o.id === i.orderId)?.customerId === selected.id)
              .map((i) => (
                <div key={i.orderId}>
                  {i.orderId} · {money(i.amount)}
                </div>
              ))}
            <h3>Recurring bookings</h3>
            {data.recurring
              .filter((r) => r.customerId === selected.id)
              .map((r) => (
                <p key={r.id}>
                  {r.frequency} · {r.service} · {displayDate(r.next)}
                </p>
              ))}
            <Button asChild variant="outline">
              <Link href="/purestart/billing" onClick={() => setSelected(null)}>
                Open billing
              </Link>
            </Button>
          </DialogContent>
        </Dialog>
      )}
      {editing && (
        <Dialog open onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="ps-surface">
            <DialogTitle>{editing === "new" ? "New customer" : "Edit customer"}</DialogTitle>
            <DialogDescription>Use fictional contact details only.</DialogDescription>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const c = {
                  id: editing === "new" ? crypto.randomUUID() : editing.id,
                  name: String(f.get("name")).trim(),
                  email: String(f.get("email")),
                  address: String(f.get("address")),
                  notes: String(f.get("notes")),
                };
                perform(() =>
                  update((d) => ({
                    ...d,
                    customers: d.customers.some((old) => old.id === c.id)
                      ? d.customers.map((old) => (old.id === c.id ? c : old))
                      : [...d.customers, c],
                  })),
                );
                setEditing(null);
              }}
            >
              <FieldGroup>
                {["name", "email", "address", "notes"].map((key) => (
                  <LabelField
                    key={key}
                    label={key === "notes" ? "Internal notes" : key.charAt(0).toUpperCase() + key.slice(1)}
                  >
                    <Input
                      name={key}
                      type={key === "email" ? "email" : "text"}
                      minLength={key === "name" ? 2 : undefined}
                      defaultValue={editing === "new" ? "" : editing[key as keyof Customer]}
                      required={key !== "notes"}
                    />
                  </LabelField>
                ))}
                <Button type="submit">Save customer</Button>
              </FieldGroup>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
export function Billing({ data }: { data: Data }) {
  const update = useDemo((s) => s.update);
  const [id, setId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const a = analytics(data, 3650);
  const order = data.orders.find((o) => o.id === id);
  const invoice = data.invoices.find((i) => i.orderId === id);
  const customer = data.customers.find((c) => c.id === order?.customerId);
  return (
    <>
      <div className="ps-metrics ps-metrics-three">
        <div>
          <small>INVOICED AMOUNTS</small>
          <strong>
            <AnimatedValue text={String(money(a.invoiced))} />
          </strong>
        </div>
        <div>
          <small>PAID REVENUE · DEMO</small>
          <strong>
            <AnimatedValue text={String(money(a.paid))} />
          </strong>
        </div>
        <div>
          <small>OUTSTANDING PAYMENTS</small>
          <strong>
            <AnimatedValue text={String(money(a.outstanding))} />
          </strong>
        </div>
      </div>
      <Panel
        title="A clear picture of every payment"
        description="Demo invoices · no real payment processing"
        action={
          <NativeSelect aria-label="Invoice filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Unpaid</option>
            <option>Paid</option>
          </NativeSelect>
        }
      >
        <div className="ps-billing-list">
          {data.invoices
            .filter((i) => filter === "All" || (filter === "Paid") === i.paid)
            .map((i) => (
              <div key={i.orderId}>
                <span className="ps-invoice-icon">
                  <ReceiptText size={20} />
                </span>
                <div>
                  <strong>INV-{i.orderId}</strong>
                  <small>
                    {data.customers.find((c) => c.id === data.orders.find((o) => o.id === i.orderId)?.customerId)?.name}
                  </small>
                </div>
                <strong>{money(i.amount)}</strong>
                <Status status={i.paid ? "Paid" : "Unpaid"} />
                <Button variant="outline" onClick={() => setId(i.orderId)}>
                  Preview
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    perform(
                      () =>
                        update((d) => ({
                          ...d,
                          invoices: d.invoices.map((inv) =>
                            inv.orderId === i.orderId
                              ? { ...inv, paid: !inv.paid, paidAt: inv.paid ? null : new Date().toISOString() }
                              : inv,
                          ),
                        })),
                      i.paid ? "Marked unpaid" : "Marked paid · simulated transaction",
                    )
                  }
                >
                  Mark {i.paid ? "unpaid" : "paid"}
                </Button>
              </div>
            ))}
        </div>
        <details className="mt-6">
          <summary className="cursor-pointer text-sm">
            Orders not yet invoiced ({data.orders.filter((o) => !data.invoices.some((i) => i.orderId === o.id)).length})
          </summary>
          <div className="mt-3 flex flex-col gap-3">
            {data.orders
              .filter((o) => !data.invoices.some((i) => i.orderId === o.id))
              .map((o) => (
                <div className="flex items-center justify-between gap-3" key={o.id}>
                  <OrderLink id={o.id} />
                  <span>{money(o.total)}</span>
                  <Button variant="outline" onClick={() => perform(() => update((d) => issueInvoice(d, o.id)))}>
                    Create invoice
                  </Button>
                </div>
              ))}
          </div>
        </details>
      </Panel>
      {order && invoice && (
        <Dialog open onOpenChange={(open) => !open && setId(null)}>
          <DialogContent className="ps-surface ps-print-invoice max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
            <DialogTitle>Invoice INV-{order.id}</DialogTitle>
            <DialogDescription>Concept Demo · Fictional Data · Not a tax invoice</DialogDescription>
            <div className="ps-invoice-heading">
              <span className="ps-brand">
                PureStart<span>OS</span>
              </span>
              <Status status={invoice.paid ? "Paid" : "Unpaid"} />
            </div>
            <p>
              <strong>{customer?.name}</strong>
              <br />
              {customer?.address}
              <br />
              {customer?.email}
            </p>
            <small>Issued {displayDate(invoice.issued)} · ZAR</small>
            <div className="ps-invoice-items">
              {order.items.map((i, n) => (
                <div key={`${i.service}-${n}`}>
                  <span>
                    {i.service} · {i.quantity} × {money(i.rate)}
                  </span>
                  <strong>{money(i.quantity * i.rate)}</strong>
                </div>
              ))}
              <div>
                <span>Minimum order adjustment</span>
                <span>
                  {money(Math.max(0, order.minimum - order.items.reduce((s, i) => s + i.quantity * i.rate, 0)))}
                </span>
              </div>
              <div>
                <span>Delivery fee</span>
                <span>{money(order.fee)}</span>
              </div>
              <div>
                <strong>Total · no VAT assumed</strong>
                <strong>{money(invoice.amount)}</strong>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Example rates and simulated payments. No payment is requested.
            </p>
            <Button className="ps-no-print" onClick={() => window.print()}>
              <Printer />
              Print / Save as PDF
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
export function Insights({ data }: { data: Data }) {
  const [days, setDays] = useState(7);
  const a = analytics(data, days);
  return (
    <div id="insights-charts" className="flex flex-col gap-6">
      <div className="flex justify-between gap-3">
        <p className="text-sm text-muted-foreground">Derived from fictional orders and invoice records.</p>
        <NativeSelect aria-label="Insight period" value={days} onChange={(e) => setDays(Number(e.target.value))}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </NativeSelect>
      </div>
      <div className="ps-metrics">
        <div>
          <small>PAID REVENUE</small>
          <strong>
            <AnimatedValue text={String(money(a.paid))} />
          </strong>
        </div>
        <div>
          <small>COMPLETED ORDERS</small>
          <strong>
            <AnimatedValue text={String(a.completed)} />
          </strong>
        </div>
        <div>
          <small>AVERAGE ORDER VALUE</small>
          <strong>
            <AnimatedValue text={String(money(a.average))} />
          </strong>
        </div>
        <div>
          <small>REPEAT CUSTOMERS</small>
          <strong>
            <AnimatedValue text={String(a.repeat)} />
          </strong>
        </div>
      </div>
      <Revenue data={data} days={days} />
      <div className="ps-two-col">
        <ServiceChart data={data} days={days} />
        <Panel title="The balance of your business" description="Invoices by issue date · paid revenue by payment date">
          <div className="ps-detail-list">
            {[
              ["Invoiced", a.invoiced],
              ["Paid revenue", a.paid],
              ["Outstanding invoices", a.outstanding],
              ["Pending order value · not invoiced", a.pending],
            ].map(([label, n]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{money(Number(n))}</strong>
              </div>
            ))}
          </div>
          <h3 className="mt-6 mb-4">Order status distribution</h3>
          {a.statuses.map((s) => (
            <div className="ps-status-bar" key={s.name}>
              <span>{s.name}</span>
              <meter
                min="0"
                max={Math.max(
                  1,
                  a.statuses.reduce((sum, it) => sum + it.orders, 0),
                )}
                value={s.orders}
              />
              <strong>{s.orders}</strong>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
export function Settings({ data }: { data: Data }) {
  const update = useDemo((s) => s.update);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="ps-two-col">
      <Panel
        title="Made to fit your working day"
        description="Example settings · applies to new orders, not historical invoices"
      >
        <form
          key={JSON.stringify(data.settings)}
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const opening = String(f.get("opening"));
            const closing = String(f.get("closing"));
            if (opening >= closing) {
              setError("Closing time must be after opening time.");
              return;
            }
            perform(() =>
              update((d) => ({
                ...d,
                settings: {
                  ...d.settings,
                  minimum: Number(f.get("minimum")),
                  fee: Number(f.get("fee")),
                  opening,
                  closing,
                  services: d.settings.services.map((s, i) => ({ ...s, rate: Number(f.get(`rate-${i}`)) })),
                },
              })),
            );
            setError("");
          }}
        >
          <FieldGroup>
            {data.settings.services.map((s, i) => (
              <LabelField key={s.name} label={`${s.name} · rand per ${s.unit}`}>
                <Input type="number" name={`rate-${i}`} min="0" step="0.01" defaultValue={s.rate} required />
              </LabelField>
            ))}
            <LabelField label="Minimum order value (R)">
              <Input name="minimum" type="number" min="0" step="0.01" defaultValue={data.settings.minimum} required />
            </LabelField>
            <LabelField label="Delivery fee (R)">
              <Input name="fee" type="number" min="0" step="0.01" defaultValue={data.settings.fee} required />
            </LabelField>
            <div className="grid grid-cols-2 gap-3">
              <LabelField label="Opening time">
                <Input name="opening" type="time" defaultValue={data.settings.opening} required />
              </LabelField>
              <LabelField label="Closing time">
                <Input name="closing" type="time" defaultValue={data.settings.closing} required />
              </LabelField>
            </div>
            {error && <p role="alert">{error}</p>}
            <Button type="submit">Save settings</Button>
          </FieldGroup>
        </form>
      </Panel>
      <div className="flex flex-col gap-6">
        <Panel title="A safe space to explore" description="Concept Demo · Fictional Data">
          <p className="text-sm text-muted-foreground">
            Everything stays in this browser. Prices are examples, payments are simulated, and no customer messages are
            sent. No official PureStart rates or VAT registration are assumed.
          </p>
          <Button className="mt-5" variant="outline" onClick={() => setConfirm(true)}>
            Reset All Demo Data
          </Button>
        </Panel>
        <Alert>
          <AlertTitle>Built for a future connection</AlertTitle>
          <AlertDescription>
            Production would need a database, authentication, official messaging integration and consent, payment
            provider, tax configuration and operational access controls.
          </AlertDescription>
        </Alert>
      </div>
      {confirm && (
        <Dialog open onOpenChange={setConfirm}>
          <DialogContent className="ps-surface">
            <DialogTitle>Reset all fictional demo data?</DialogTitle>
            <DialogDescription>
              This removes changes to PureStart orders, customers, invoices, recurring bookings and settings in this
              browser. Winglo is unaffected.
            </DialogDescription>
            <Button
              variant="destructive"
              onClick={() => {
                update(() => ({ ...seed(), welcomed: true }));
                setConfirm(false);
              }}
            >
              Confirm reset all data
            </Button>
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Keep my demo data
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
