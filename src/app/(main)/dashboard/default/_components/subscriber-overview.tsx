"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import customersData from "./data.json";
import type { RecentCustomerRow } from "./recent-customers-table/schema";
import { RecentCustomersTable } from "./recent-customers-table/table";

const customers = customersData as RecentCustomerRow[];

export function SubscriberOverview() {
  const exportCustomers = () => {
    const rows = [
      "NOREVA — fictional customer records",
      "ID,Name,Email,Plan,Status,Billing,Joined",
      ...customers.map((customer) =>
        [
          customer.id,
          customer.name,
          customer.email,
          customer.plan,
          customer.status,
          customer.billing,
          customer.joined,
        ].join(","),
      ),
    ];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "noreva-demo-customers.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">18,426 Customers</CardTitle>
        <CardDescription>Sample customer records with plan, billing, status, and signup activity.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" onClick={exportCustomers}>
            <Download />
            Export
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-0">
        <RecentCustomersTable data={customers} />
      </CardContent>
    </Card>
  );
}
