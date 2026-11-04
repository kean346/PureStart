import { z } from "zod";

export const stages = [
  "New",
  "Scheduled",
  "Collected",
  "Processing",
  "Ready for Delivery",
  "Out for Delivery",
  "Delivered",
] as const;
const itemSchema = z.object({ service: z.string(), quantity: z.number().positive(), rate: z.number().nonnegative() });
const customerSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.email(),
  address: z.string().min(3),
  notes: z.string(),
});
const orderSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  status: z.enum(stages),
  items: z.array(itemSchema).min(1),
  collection: z.iso.datetime({ local: true }),
  delivery: z.iso.datetime({ local: true }),
  driver: z.string(),
  notes: z.string(),
  total: z.number().nonnegative(),
  fee: z.number().nonnegative(),
  minimum: z.number().nonnegative(),
  created: z.iso.datetime(),
  history: z.array(z.object({ status: z.enum(stages), at: z.iso.datetime() })),
});
const invoiceSchema = z.object({
  orderId: z.string(),
  amount: z.number().nonnegative(),
  paid: z.boolean(),
  issued: z.iso.datetime(),
  paidAt: z.iso.datetime().nullable(),
});
const ruleSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  service: z.string(),
  quantity: z.number().positive(),
  frequency: z.enum(["Weekly", "Fortnightly", "Monthly"]),
  next: z.string(),
  occurrences: z.array(z.string()),
});
export const dataSchema = z.object({
  version: z.literal(1),
  customers: z.array(customerSchema),
  orders: z.array(orderSchema),
  invoices: z.array(invoiceSchema),
  recurring: z.array(ruleSchema),
  events: z.array(
    z.object({ id: z.string(), orderId: z.string(), text: z.string(), message: z.string(), at: z.iso.datetime() }),
  ),
  settings: z.object({
    services: z.array(z.object({ name: z.string().min(2), rate: z.number().nonnegative(), unit: z.string() })).min(1),
    minimum: z.number().nonnegative(),
    fee: z.number().nonnegative(),
    opening: z.string(),
    closing: z.string(),
  }),
  welcomed: z.boolean(),
});
export type Data = z.infer<typeof dataSchema>;
export type Order = z.infer<typeof orderSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type Rule = z.infer<typeof ruleSchema>;
export type Item = z.infer<typeof itemSchema>;
export const money = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 2 }).format(n);
export const day = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const dateAt = (offset: number, hour = "09:00") => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${day(d)}T${hour}:00`;
};
export const displayDate = (value: string) =>
  new Date(value).toLocaleString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
export const price = (items: Item[], minimum: number, fee: number) =>
  Math.round(
    (Math.max(
      items.reduce((sum, i) => sum + i.quantity * i.rate, 0),
      minimum,
    ) +
      fee) *
      100,
  ) / 100;
export function seed(): Data {
  const customers: Customer[] = [
    {
      id: "c1",
      name: "Naledi Mokoena",
      email: "naledi@example.com",
      address: "18 Sample Lane, Sandton (fictional)",
      notes: "Prefers fragrance-free detergent.",
    },
    {
      id: "c2",
      name: "James Petersen",
      email: "james@example.com",
      address: "7 Example Road, Rosebank (fictional)",
      notes: "Use the fictional reception desk.",
    },
    {
      id: "c3",
      name: "Lerato Dlamini",
      email: "lerato@example.com",
      address: "24 Demo Street, Bryanston (fictional)",
      notes: "Weekly household laundry.",
    },
    {
      id: "c4",
      name: "Amira Jacobs",
      email: "amira@example.com",
      address: "9 Sample Crescent, Fourways (fictional)",
      notes: "Fold shirts separately.",
    },
    {
      id: "c5",
      name: "Thabo Nkosi",
      email: "thabo@example.com",
      address: "42 Example Avenue, Rivonia (fictional)",
      notes: "Afternoon deliveries preferred.",
    },
  ];
  const orders: Order[] = Array.from({ length: 21 }, (_, i) => {
    const status = i === 0 ? "Scheduled" : stages[i % stages.length];
    const quantity = 4 + (i % 7);
    const items = [
      {
        service: i % 3 === 0 ? "Wash & Fold" : i % 3 === 1 ? "Wash & Iron" : "Bedding",
        quantity,
        rate: i % 3 === 0 ? 35 : 45,
      },
    ];
    const created = new Date(dateAt(i < 7 ? 0 : -(1 + (i % 6)), "07:00")).toISOString();
    return {
      id: `PS-${1042 + i}`,
      customerId: customers[i % 5].id,
      status,
      items,
      collection: dateAt(i < 7 ? 0 : -(1 + (i % 6)), `${String(9 + (i % 7)).padStart(2, "0")}:00`),
      delivery: dateAt(i < 7 ? 1 : -(i % 6), "15:00"),
      driver: i % 2 ? "Driver B" : "Driver A",
      notes: "Fictional demo order. Example pricing only.",
      total: price(items, 150, 40),
      fee: 40,
      minimum: 150,
      created,
      history: stages.slice(0, stages.indexOf(status) + 1).map((status) => ({ status, at: created })),
    };
  });
  return {
    version: 1,
    customers,
    orders,
    invoices: orders
      .filter((_, i) => i > 4)
      .map((o, i) => ({
        orderId: o.id,
        amount: o.total,
        issued: o.created,
        paid: i % 3 !== 0,
        paidAt: i % 3 !== 0 ? o.created : null,
      })),
    recurring: [
      {
        id: "r1",
        customerId: "c3",
        service: "Wash & Fold",
        quantity: 6,
        frequency: "Weekly",
        next: dateAt(1),
        occurrences: [],
      },
    ],
    events: [],
    settings: {
      services: [
        { name: "Wash & Fold", rate: 35, unit: "kg" },
        { name: "Wash & Iron", rate: 45, unit: "kg" },
        { name: "Bedding", rate: 45, unit: "item" },
      ],
      minimum: 150,
      fee: 40,
      opening: "08:00",
      closing: "17:00",
    },
    welcomed: false,
  };
}
export const nextActions = [
  "Schedule order",
  "Mark as Collected",
  "Start Processing",
  "Mark Ready for Delivery",
  "Dispatch Order",
  "Mark Delivered",
];
export function advance(data: Data, id: string, expected: Order["status"]): Data {
  const order = data.orders.find((o) => o.id === id);
  if (!order || order.status !== expected || order.status === "Delivered") return data;
  const status = stages[stages.indexOf(order.status) + 1];
  const at = new Date().toISOString();
  const name = data.customers.find((c) => c.id === order.customerId)?.name.split(" ")[0];
  const event = {
    id: `${id}-${status}`,
    orderId: id,
    at,
    text: `Order ${status.toLowerCase()}`,
    message: `Hi ${name}, your PureStart order ${id} is now ${status.toLowerCase()}. Thank you for choosing PureStart.`,
  };
  return {
    ...data,
    orders: data.orders.map((o) => (o.id === id ? { ...o, status, history: [...o.history, { status, at }] } : o)),
    events: [event, ...data.events],
  };
}
export function saveOrder(data: Data, input: Order): Data {
  const order = orderSchema.parse(input);
  if (!data.customers.some((c) => c.id === order.customerId)) throw new Error("Choose an existing customer.");
  if (order.delivery <= order.collection) throw new Error("Delivery must be after collection.");
  const slots = [order.collection, order.delivery];
  if (slots.some((slot) => slot.slice(11, 16) < data.settings.opening || slot.slice(11, 16) >= data.settings.closing))
    throw new Error("Choose a time within the configured operating hours.");
  if (
    order.driver !== "Unassigned" &&
    data.orders.some(
      (o) =>
        o.id !== order.id &&
        o.status !== "Delivered" &&
        o.driver === order.driver &&
        [o.collection, o.delivery].some((slot) =>
          slots.some((s) => Math.abs(new Date(s).getTime() - new Date(slot).getTime()) < 30 * 60_000),
        ),
    )
  )
    throw new Error("Driver conflict: allow at least 30 minutes between stops or choose Unassigned.");
  const existing = data.orders.find((o) => o.id === order.id);
  if (
    existing &&
    data.invoices.some((i) => i.orderId === order.id) &&
    JSON.stringify(existing) !== JSON.stringify(order)
  )
    throw new Error("Invoiced orders are locked to preserve their financial history.");
  return {
    ...data,
    orders: existing ? data.orders.map((o) => (o.id === order.id ? order : o)) : [order, ...data.orders],
  };
}
export function issueInvoice(data: Data, id: string): Data {
  const order = data.orders.find((o) => o.id === id);
  if (!order || data.invoices.some((i) => i.orderId === id)) return data;
  return {
    ...data,
    invoices: [
      { orderId: id, amount: order.total, paid: false, issued: new Date().toISOString(), paidAt: null },
      ...data.invoices,
    ],
  };
}
export function generate(data: Data, id: string, expected: string): Data {
  const rule = data.recurring.find((r) => r.id === id);
  if (!rule || rule.next !== expected) return data;
  const orderId = `PS-R-${id}-${expected.slice(0, 10)}`;
  if (data.orders.some((o) => o.id === orderId)) return data;
  const service = data.settings.services.find((s) => s.name === rule.service);
  if (!service) throw new Error("Choose an available service in this recurring rule.");
  const items = [{ service: service.name, quantity: rule.quantity, rate: service.rate }];
  const delivery = new Date(rule.next);
  delivery.setDate(delivery.getDate() + 1);
  const order: Order = {
    id: orderId,
    customerId: rule.customerId,
    status: "Scheduled",
    items,
    collection: rule.next,
    delivery: `${day(delivery)}T15:00:00`,
    driver: "Unassigned",
    notes: `Generated from ${rule.frequency.toLowerCase()} booking`,
    total: price(items, data.settings.minimum, data.settings.fee),
    fee: data.settings.fee,
    minimum: data.settings.minimum,
    created: new Date().toISOString(),
    history: [{ status: "Scheduled", at: new Date().toISOString() }],
  };
  const next = new Date(rule.next);
  if (rule.frequency === "Monthly") {
    const original = next.getDate();
    next.setDate(1);
    next.setMonth(next.getMonth() + 1);
    const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    next.setDate(Math.min(original, last));
  } else next.setDate(next.getDate() + (rule.frequency === "Weekly" ? 7 : 14));
  return {
    ...saveOrder(data, order),
    recurring: data.recurring.map((r) =>
      r.id === id ? { ...r, next: `${day(next)}T${rule.next.slice(11)}`, occurrences: [orderId, ...r.occurrences] } : r,
    ),
  };
}
export function resetExample(data: Data): Data {
  const original = seed().orders[0];
  return {
    ...data,
    orders: data.orders.map((o) => (o.id === original.id ? original : o)),
    invoices: data.invoices.filter((i) => i.orderId !== original.id),
    events: data.events.filter((e) => e.orderId !== original.id),
  };
}
export function analytics(data: Data, days = 7) {
  const start = new Date(`${day()}T00:00:00`);
  start.setDate(start.getDate() - days + 1);
  const invoices = data.invoices.filter((i) => new Date(i.issued) >= start);
  const orders = data.orders.filter((o) => new Date(o.created) >= start);
  return {
    paid: data.invoices
      .filter((i) => i.paid && i.paidAt && new Date(i.paidAt) >= start)
      .reduce((s, i) => s + i.amount, 0),
    outstanding: invoices.filter((i) => !i.paid).reduce((s, i) => s + i.amount, 0),
    invoiced: invoices.reduce((s, i) => s + i.amount, 0),
    pending: orders.filter((o) => !data.invoices.some((i) => i.orderId === o.id)).reduce((s, o) => s + o.total, 0),
    completed: orders.filter((o) => o.status === "Delivered").length,
    average: orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0,
    repeat: data.customers.filter((c) => orders.filter((o) => o.customerId === c.id).length > 1).length,
    revenue: Array.from({ length: days }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = day(d);
      return {
        date: d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" }),
        paid: data.invoices
          .filter((inv) => inv.paid && inv.paidAt?.startsWith(key))
          .reduce((s, inv) => s + inv.amount, 0),
      };
    }),
    services: data.settings.services.map((s) => ({
      name: s.name,
      orders: orders.filter((o) => o.items.some((i) => i.service === s.name)).length,
    })),
    statuses: stages.map((status) => ({ name: status, orders: orders.filter((o) => o.status === status).length })),
  };
}
