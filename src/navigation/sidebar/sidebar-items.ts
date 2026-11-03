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
    label: "NOREVA workspace",
    items: [
      { id: "default", title: "Business pulse", url: "/dashboard/default", icon: LayoutDashboard },
      { id: "crm", title: "Client relationships", url: "/dashboard/crm", icon: ChartBar },
      { id: "finance", title: "Money overview", url: "/dashboard/finance", icon: Banknote },
      { id: "analytics", title: "Audience insights", url: "/dashboard/analytics", icon: Gauge },
      { id: "productivity", title: "Team rhythm", url: "/dashboard/productivity", icon: ListTodo },
      { id: "ecommerce", title: "Commerce desk", url: "/dashboard/ecommerce", icon: ShoppingBag },
      { id: "academy", title: "Learning hub", url: "/dashboard/academy", icon: GraduationCap },
      { id: "logistics", title: "Shipment desk", url: "/dashboard/logistics", icon: Truck },
      { id: "infrastructure", title: "Cloud operations", url: "/dashboard/infrastructure", icon: Server },
      { id: "file-manager", title: "Workspace library", url: "/dashboard/file-manager", icon: FolderOpen },
    ],
  },
  {
    id: 2,
    label: "Growth intelligence",
    items: [
      { id: "audience", title: "People & regions", url: "/dashboard/analytics?view=audience", icon: Users },
      { id: "acquisition", title: "Discovery channels", url: "/dashboard/analytics?view=acquisition", icon: ChartBar },
      { id: "engagement", title: "Visitor journeys", url: "/dashboard/analytics?view=engagement", icon: HeartPulse },
      {
        id: "conversions",
        title: "Activation funnel",
        url: "/dashboard/analytics?view=conversions",
        icon: CheckSquare,
      },
    ],
  },
];
