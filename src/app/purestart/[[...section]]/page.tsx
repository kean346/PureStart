import { notFound } from "next/navigation";

import type { Metadata } from "next";

import { PureStart } from "../_components/app";
export const metadata: Metadata = {
  title: "PureStart OS · Concept by paceIT",
  description: "A connected laundry operations concept. Fictional data; browser-local simulations.",
  robots: { index: false, follow: false },
  applicationName: "PureStart OS",
  icons: { icon: "/purestart-icon.svg", apple: "/purestart-icon.svg" },
  openGraph: {
    title: "PureStart OS · Concept by paceIT",
    description: "One connected laundry workspace. Fictional data and browser-local simulations.",
    siteName: "PureStart OS",
    images: [],
  },
  twitter: { card: "summary", title: "PureStart OS · Concept by paceIT", images: [] },
};
export default async function Page({ params }: { params: Promise<{ section?: string[] }> }) {
  const { section = [] } = await params;
  const allowed = [
    "overview",
    "orders",
    "customers",
    "scheduling",
    "recurring",
    "automation",
    "billing",
    "insights",
    "settings",
  ];
  if (
    section.length > 2 ||
    (section[0] && !allowed.includes(section[0])) ||
    (section.length === 2 && section[0] !== "orders")
  )
    notFound();
  return <PureStart section={section[0] ?? "overview"} orderId={section[1]} />;
}
