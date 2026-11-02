import type { Metadata } from "next";

import { Logistics } from "./_components/logistics";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

export const metadata: Metadata = {
  title: "NOREVA Logistics | Shipment Operations",
  description: "Track fictional NOREVA shipments, routes, cargo, and delivery activity. A portfolio concept by paceIT.",
  alternates: {
    canonical: "/dashboard/logistics",
  },
};

export default function Page() {
  return <Logistics />;
}
