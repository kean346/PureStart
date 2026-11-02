"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

export default function DashboardTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="noreva-page-enter min-w-0">
      {children}
    </div>
  );
}
