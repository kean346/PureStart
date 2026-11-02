import {
  Banknote,
  ChartBar,
  CheckSquare,
  FolderOpen,
  Gauge,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  ListTodo,
  type LucideIcon,
  Server,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";

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
    label: "Dashboards",
    items: [
      { id: "default", title: "Home", url: "/dashboard/default", icon: LayoutDashboard },
      { id: "crm", title: "CRM", url: "/dashboard/crm", icon: ChartBar },
      { id: "finance", title: "Finance", url: "/dashboard/finance", icon: Banknote },
      { id: "analytics", title: "Analytics", url: "/dashboard/analytics", icon: Gauge },
      { id: "productivity", title: "Productivity", url: "/dashboard/productivity", icon: ListTodo },
      { id: "ecommerce", title: "E-commerce", url: "/dashboard/ecommerce", icon: ShoppingBag },
      { id: "academy", title: "Academy", url: "/dashboard/academy", icon: GraduationCap },
      { id: "logistics", title: "Logistics", url: "/dashboard/logistics", icon: Truck },
      { id: "infrastructure", title: "Infrastructure", url: "/dashboard/infrastructure", icon: Server },
      { id: "file-manager", title: "File Manager", url: "/dashboard/file-manager", icon: FolderOpen },
    ],
  },
  {
    id: 2,
    label: "Analytics views",
    items: [
      { id: "audience", title: "Audience", url: "/dashboard/analytics?view=audience", icon: Users },
      { id: "acquisition", title: "Acquisition", url: "/dashboard/analytics?view=acquisition", icon: ChartBar },
      { id: "engagement", title: "Engagement", url: "/dashboard/analytics?view=engagement", icon: HeartPulse },
      { id: "conversions", title: "Conversions", url: "/dashboard/analytics?view=conversions", icon: CheckSquare },
    ],
  },
];
