"use client";
import type { ReactNode } from "react";

import Link from "next/link";

import { ArrowUpRight, CalendarDays, Check, CircleCheck, ClipboardList, Package, Sparkles, Truck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldLabel } from "@/components/ui/field";

import { type Order, stages } from "./model";

export { Badge, Button };
export function Panel({
  title,
  description,
  children,
  action,
  id,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <Card id={id} className="ps-panel">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
export function LabelField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Field>
      <FieldLabel>
        {label}
        {children}
      </FieldLabel>
    </Field>
  );
}
export function Blank({
  title = "Nothing here yet",
  description = "Try another filter or create your first record.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
export const icons = [ClipboardList, CalendarDays, Truck, Sparkles, Package, Truck, CircleCheck];
export function Status({ status }: { status: string }) {
  return <Badge variant={status === "Delivered" || status === "Paid" ? "default" : "secondary"}>{status}</Badge>;
}
export function OrderLink({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <Link className="ps-text-link" href={`/purestart/orders/${id}`}>
      {children ?? id}
      <ArrowUpRight size={14} aria-hidden />
    </Link>
  );
}
export function Stepper({ order }: { order: Order }) {
  const current = stages.indexOf(order.status);
  return (
    <ol className="ps-stepper" aria-label="Order progress">
      {stages.map((s, index) => {
        const Icon = icons[index];
        return (
          <li
            key={s}
            data-state={index < current ? "done" : index === current ? "current" : "upcoming"}
            aria-current={index === current ? "step" : undefined}
          >
            <span className="ps-step-icon">{index < current ? <Check size={18} /> : <Icon size={18} />}</span>
            <div>
              <strong>{s}</strong>
              <small>
                {order.history.find((h) => h.status === s)
                  ? new Date(order.history.find((h) => h.status === s)?.at ?? "").toLocaleTimeString("en-ZA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Upcoming"}
              </small>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
export function perform(action: () => void, message = "Saved across PureStart OS") {
  try {
    action();
    toast.success(message, { position: "top-center" });
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Could not save. Please try again.", {
      position: "top-center",
    });
  }
}
