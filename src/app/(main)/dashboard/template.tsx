import type { ReactNode } from "react";

export default function DashboardTemplate({ children }: { children: ReactNode }) {
  return <div className="noreva-page-enter min-w-0">{children}</div>;
}
