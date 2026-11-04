"use client";
import { useState } from "react";

import { ArrowRight, CheckCheck, Pencil, Plus, ReceiptText, RotateCcw, Trash2 } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

import {
  advance,
  type Data,
  dateAt,
  displayDate,
  type Item,
  issueInvoice,
  money,
  nextActions,
  type Order,
  price,
  resetExample,
  saveOrder,
  stages,
} from "./model";
import { useDemo } from "./store";
import { Badge, Blank, Button, LabelField, OrderLink, Panel, perform, Status, Stepper } from "./ui";
export function OrderEditor({ data, existing, close }: { data: Data; existing?: Order; close: () => void }) {
  const update = useDemo((s) => s.update);
  const [items, setItems] = useState<Item[]>(
    existing?.items ?? [{ service: data.settings.services[0].name, quantity: 5, rate: data.settings.services[0].rate }],
  );
  const [id] = useState(() => existing?.id ?? `PS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`);
  const [error, setError] = useState("");
  const total = price(items, existing?.minimum ?? data.settings.minimum, existing?.fee ?? data.settings.fee);
  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="ps-surface max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogTitle>{existing ? `Edit ${existing.id}` : "Create a new order"}</DialogTitle>
        <DialogDescription>Example prices · amounts are in South African rand.</DialogDescription>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const f = new FormData(event.currentTarget);
            try {
              update((d) =>
                saveOrder(d, {
                  id,
                  customerId: String(f.get("customer")),
                  status: existing?.status ?? "Scheduled",
                  items,
                  collection: `${f.get("collection")}:00`,
                  delivery: `${f.get("delivery")}:00`,
                  driver: String(f.get("driver")),
                  notes: String(f.get("notes")),
                  total,
                  minimum: existing?.minimum ?? d.settings.minimum,
                  fee: existing?.fee ?? d.settings.fee,
                  created: existing?.created ?? new Date().toISOString(),
                  history: existing?.history ?? [{ status: "Scheduled", at: new Date().toISOString() }],
                }),
              );
              close();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Please check the form.");
            }
          }}
        >
          <FieldGroup>
            <LabelField label="Customer">
              <NativeSelect name="customer" defaultValue={existing?.customerId} required>
                {data.customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
            </LabelField>
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-sm font-medium">Laundry items</legend>
              {items.map((item, i) => (
                <div className="ps-item-form" key={`${i}-${items.length}`}>
                  <LabelField label={`Service ${i + 1}`}>
                    <NativeSelect
                      value={item.service}
                      onChange={(e) => {
                        const service = data.settings.services.find((s) => s.name === e.target.value);
                        if (service)
                          setItems(
                            items.map((it, j) => (j === i ? { ...it, service: service.name, rate: service.rate } : it)),
                          );
                      }}
                    >
                      {data.settings.services.map((s) => (
                        <option key={s.name}>{s.name}</option>
                      ))}
                    </NativeSelect>
                  </LabelField>
                  <LabelField label={`Quantity ${i + 1}`}>
                    <Input
                      type="number"
                      min="0.1"
                      step="0.1"
                      required
                      value={item.quantity}
                      onChange={(e) =>
                        setItems(items.map((it, j) => (j === i ? { ...it, quantity: Number(e.target.value) } : it)))
                      }
                    />
                  </LabelField>
                  <LabelField label={`Unit rate ${i + 1}`}>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={item.rate}
                      onChange={(e) =>
                        setItems(items.map((it, j) => (j === i ? { ...it, rate: Number(e.target.value) } : it)))
                      }
                    />
                  </LabelField>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      aria-label={`Remove item ${i + 1}`}
                      onClick={() => setItems(items.filter((_, j) => j !== i))}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => setItems([...items, { ...items[0] }])}>
                <Plus />
                Add service item
              </Button>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <LabelField label="Collection date and time">
                <Input
                  name="collection"
                  type="datetime-local"
                  defaultValue={(existing?.collection ?? dateAt(1)).slice(0, 16)}
                  required
                />
              </LabelField>
              <LabelField label="Delivery date and time">
                <Input
                  name="delivery"
                  type="datetime-local"
                  defaultValue={(existing?.delivery ?? dateAt(2, "15:00")).slice(0, 16)}
                  required
                />
              </LabelField>
            </div>
            <LabelField label="Driver">
              <NativeSelect name="driver" defaultValue={existing?.driver ?? "Unassigned"}>
                <option>Unassigned</option>
                <option>Driver A</option>
                <option>Driver B</option>
              </NativeSelect>
            </LabelField>
            <LabelField label="Order notes">
              <Textarea name="notes" defaultValue={existing?.notes} />
            </LabelField>
            <p className="text-sm text-muted-foreground">
              Minimum {money(existing?.minimum ?? data.settings.minimum)} + delivery{" "}
              {money(existing?.fee ?? data.settings.fee)}.{" "}
              <strong className="text-foreground">Total {money(total)}</strong>
            </p>
            {error && (
              <p role="alert" className="text-destructive">
                {error}
              </p>
            )}
            <Button type="submit">
              {existing ? "Save order" : "Create order"}
              <ArrowRight data-icon="inline-end" />
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function Orders({ data, openNew }: { data: Data; openNew: () => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(() =>
    typeof window !== "undefined" ? (new URLSearchParams(window.location.search).get("status") ?? "All") : "All",
  );
  const orders = data.orders.filter(
    (o) =>
      (filter === "All" || o.status === filter) &&
      `${o.id} ${data.customers.find((c) => c.id === o.customerId)?.name}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <Panel
      title="Every order, one clear next step"
      description={`${orders.length} matching orders`}
      action={
        <Button onClick={openNew}>
          <Plus />
          New order
        </Button>
      }
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          className="max-w-sm"
          aria-label="Search orders"
          placeholder="Search customer or order number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <NativeSelect aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          {stages.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </NativeSelect>
      </div>
      <div className="ps-order-grid">
        {orders.map((o) => (
          <div className="ps-order-card" key={o.id}>
            <div className="flex items-center justify-between gap-2">
              <OrderLink id={o.id} />
              <Status status={o.status} />
            </div>
            <h3>{data.customers.find((c) => c.id === o.customerId)?.name}</h3>
            <p>{o.items.map((i) => i.service).join(" · ")}</p>
            <div className="flex justify-between gap-2">
              <small>{displayDate(o.collection)}</small>
              <strong>{money(o.total)}</strong>
            </div>
          </div>
        ))}
      </div>
      {!orders.length && <Blank />}
    </Panel>
  );
}
export function OrderDetail({ data, id }: { data: Data; id: string }) {
  const order = data.orders.find((o) => o.id === id);
  const update = useDemo((s) => s.update);
  const [editing, setEditing] = useState(false);
  if (!order) return <Blank title="Order not found" description="Open Orders to choose an existing demo order." />;
  const customer = data.customers.find((c) => c.id === order.customerId);
  const invoice = data.invoices.find((i) => i.orderId === id);
  const events = data.events.filter((e) => e.orderId === id);
  return (
    <div className="flex flex-col gap-6">
      <Panel
        id="order-progress"
        title={`Order #${id}`}
        description={`${customer?.name} · ${order.items.map((i) => i.service).join(", ")}`}
        action={<Status status={order.status} />}
      >
        <Stepper order={order} />
        <div className="ps-next-action">
          {order.status === "Delivered" ? (
            <div className="flex items-center gap-3">
              <CheckCheck className="text-primary" />
              <div>
                <h3>Order Delivered Successfully</h3>
                <p>A complete journey, from collection to doorstep.</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="ps-eyebrow">NEXT ACTION</p>
              <h3>{nextActions[stages.indexOf(order.status)]}</h3>
              <p>Progress, schedule and customer updates stay in sync.</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {order.status !== "Delivered" && (
              <Button
                size="lg"
                onClick={() =>
                  perform(() => update((d) => advance(d, id, order.status)), "Order updated across PureStart OS")
                }
              >
                {nextActions[stages.indexOf(order.status)]}
                <ArrowRight data-icon="inline-end" />
              </Button>
            )}
            {id === "PS-1042" && (
              <Button
                variant="outline"
                onClick={() => perform(() => update(resetExample), "Example reset. Other demo records are unchanged.")}
              >
                <RotateCcw />
                Reset Example
              </Button>
            )}
          </div>
        </div>
      </Panel>
      <div className="ps-two-col">
        <Panel
          title="Order details"
          description="A little care in every load"
          action={
            !invoice && (
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Pencil />
                Edit order
              </Button>
            )
          }
        >
          <div className="ps-detail-list">
            <div>
              <span>Customer</span>
              <strong>{customer?.name}</strong>
            </div>
            <div>
              <span>Collection</span>
              <strong>{displayDate(order.collection)}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>{displayDate(order.delivery)}</strong>
            </div>
            <div>
              <span>Assignment</span>
              <strong>{order.driver}</strong>
            </div>
            <div>
              <span>Address</span>
              <strong>{customer?.address}</strong>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{order.notes}</p>
          <div className="ps-invoice-items">
            {order.items.map((item, i) => (
              <div key={`${item.service}-${i}`}>
                <span>
                  {item.service} · {item.quantity} × {money(item.rate)}
                </span>
                <strong>{money(item.quantity * item.rate)}</strong>
              </div>
            ))}
            <div>
              <span>Minimum order rule</span>
              <strong>{money(order.minimum)}</strong>
            </div>
            <div>
              <span>Delivery fee</span>
              <strong>{money(order.fee)}</strong>
            </div>
            <div>
              <strong>Total</strong>
              <strong>{money(order.total)}</strong>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Badge variant="secondary">
              {invoice ? (invoice.paid ? "Paid · demo" : "Unpaid") : "Not yet invoiced"}
            </Badge>
            {!invoice && (
              <Button
                variant="outline"
                onClick={() =>
                  perform(() => update((d) => issueInvoice(d, id)), "Invoice created. Open Billing to preview it.")
                }
              >
                <ReceiptText />
                Create invoice
              </Button>
            )}
          </div>
        </Panel>
        <Panel
          id="order-activity"
          title="One update. Everything connected."
          description="Genuine demo activity and notification previews"
        >
          {!events.length && (
            <Blank
              title="Ready when you are"
              description="Progress this order to see its activity and customer message appear here."
            />
          )}
          {events.map((e) => (
            <article className="ps-event" key={e.id}>
              <span className="ps-event-dot" />
              <div>
                <strong>{e.text}</strong>
                <small>{displayDate(e.at)}</small>
                <blockquote>{e.message}</blockquote>
                <Badge variant="secondary">Simulated notification · nothing sent</Badge>
              </div>
            </article>
          ))}
        </Panel>
      </div>
      {editing && <OrderEditor data={data} existing={order} close={() => setEditing(false)} />}
    </div>
  );
}
