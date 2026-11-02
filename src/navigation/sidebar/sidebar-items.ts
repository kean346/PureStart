import { ChartBar, CheckSquare, Gauge, HeartPulse, type LucideIcon, Users } from "lucide-react";

export type NavBadge = "new" | "updated" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Insights",
    items: [
      { id: "analytics", title: "Overview", url: "/dashboard/analytics", icon: Gauge },
      { id: "audience", title: "Audience", url: "/dashboard/analytics?view=audience", icon: Users },
      { id: "acquisition", title: "Acquisition", url: "/dashboard/analytics?view=acquisition", icon: ChartBar },
      { id: "engagement", title: "Engagement", url: "/dashboard/analytics?view=engagement", icon: HeartPulse },
      { id: "conversions", title: "Conversions", url: "/dashboard/analytics?view=conversions", icon: CheckSquare },
    ],
  },
];
