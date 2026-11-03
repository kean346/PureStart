import {
  AlertTriangleIcon,
  ArrowUp,
  Ban,
  CheckCircle2,
  Droplets,
  Flame,
  Forklift,
  type LucideIcon,
  PackageCheck,
  PenLine,
  ShieldCheck,
  Snowflake,
  Star,
  Thermometer,
  Truck,
} from "lucide-react";

export type ShipmentStatus =
  | "Scheduled"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Delayed"
  | "On Hold"
  | "Customs Hold";

export type TransportMode = "land" | "air" | "sea";
export type RouteType = "road" | "flight" | "ship";
export type CustomerTier = "Priority" | "Standard" | "Non-priority";

export type GeoCoordinate = [longitude: number, latitude: number];

export type ShipmentLocation = {
  coordinates: GeoCoordinate;
  display: string;
  country: string;
  countryCode: string;
};

export type ShipmentCustomer = {
  name: string;
  initials: string;
  id: string;
  tier: CustomerTier;
  tierLabel: string;
};

export type HandlingTag = {
  label: string;
  icon: LucideIcon;
};

export type ShipmentHandling = {
  label: string;
  note: string;
  tags: HandlingTag[];
};

export type Shipment = {
  id: string;
  customer: ShipmentCustomer;
  origin: ShipmentLocation;
  destination: ShipmentLocation;
  cargo: string;
  handling: ShipmentHandling;
  weight: string;
  eta: string;
  etaMeta: string;
  status: ShipmentStatus;
  progress: number;
  mode: TransportMode;
  routeType: RouteType;
  transportNumber: string;
};

const customerAccounts = {
  techCorp: {
    name: "Northstar Devices",
    initials: "ND",
    id: "NRV-1001-2401-01",
    tier: "Priority",
    tierLabel: "Priority demo account",
  },
  regionalRoadExpress: {
    name: "Meridian Freight",
    initials: "MF",
    id: "NRV-1002-2402-02",
    tier: "Priority",
    tierLabel: "Priority demo account",
  },
  sendWell: {
    name: "Harborline Goods",
    initials: "HG",
    id: "NRV-1003-2403-03",
    tier: "Priority",
    tierLabel: "Priority demo account",
  },
  sourceDay: {
    name: "Fieldwork Supply",
    initials: "FS",
    id: "NRV-1004-2404-04",
    tier: "Standard",
    tierLabel: "Recurring shipment account",
  },
  shippingEasy: {
    name: "Rowan Distribution",
    initials: "RD",
    id: "NRV-1005-2405-05",
    tier: "Standard",
    tierLabel: "Recurring shipment account",
  },
  freightView: {
    name: "Vale Trading",
    initials: "VT",
    id: "NRV-1006-2406-06",
    tier: "Priority",
    tierLabel: "Priority demo account",
  },
  logisticsPlus: {
    name: "Cedar Logistics",
    initials: "CL",
    id: "NRV-1007-2407-07",
    tier: "Standard",
    tierLabel: "Managed freight account",
  },
  transvirtual: {
    name: "Aster Transport",
    initials: "AT",
    id: "NRV-1008-2408-08",
    tier: "Standard",
    tierLabel: "Managed freight account",
  },
  skyTrack: {
    name: "Lumen Cargo",
    initials: "LC",
    id: "NRV-1009-2409-09",
    tier: "Non-priority",
    tierLabel: "Occasional shipment account",
  },
  maersk: {
    name: "Ellery Maritime",
    initials: "EM",
    id: "NRV-1010-2410-10",
    tier: "Priority",
    tierLabel: "Priority demo account",
  },
  flexport: {
    name: "Orion Forwarding",
    initials: "OF",
    id: "NRV-1011-2411-11",
    tier: "Priority",
    tierLabel: "Priority demo account",
  },
  piedPiper: {
    name: "Kestrel Goods",
    initials: "KG",
    id: "NRV-1012-2412-12",
    tier: "Non-priority",
    tierLabel: "Occasional shipment account",
  },
} satisfies Record<string, ShipmentCustomer>;

export const shipments: Shipment[] = [
  {
    id: "NRV-01-2401",
    customer: customerAccounts.techCorp,
    origin: { display: "OR Tambo Airport", country: "South Africa", countryCode: "ZA", coordinates: [28.246, -26.139] },
    destination: {
      display: "Hosea Kutako Airport",
      country: "Namibia",
      countryCode: "NA",
      coordinates: [17.464, -22.48],
    },
    cargo: "Consumer Electronics",
    handling: {
      label: "Fragile electronics",
      note: "Keep package sealed until handoff.",
      tags: [
        { label: "Do not stack", icon: Ban },
        { label: "Keep upright", icon: ArrowUp },
        { label: "Signature required", icon: PenLine },
      ],
    },
    weight: "2,450 kg",
    eta: "08:45 AM",
    etaMeta: "Today",
    status: "In Transit",
    progress: 65,
    mode: "air",
    routeType: "flight",
    transportNumber: "GA-884",
  },
  {
    id: "NRV-02-2402",
    customer: customerAccounts.regionalRoadExpress,
    origin: { display: "Pretoria depot", country: "South Africa", countryCode: "ZA", coordinates: [28.188, -25.747] },
    destination: { display: "Mbabane depot", country: "Eswatini", countryCode: "SZ", coordinates: [31.137, -26.306] },
    cargo: "Industrial Machinery",
    handling: {
      label: "Heavy machinery",
      note: "Secure machinery to pallet base before road dispatch.",
      tags: [
        { label: "Forklift only", icon: Forklift },
        { label: "Secure load", icon: ShieldCheck },
        { label: "Do not tip", icon: Ban },
      ],
    },
    weight: "8,120 kg",
    eta: "11:20 AM",
    etaMeta: "Tomorrow",
    status: "Delayed",
    progress: 42,
    mode: "land",
    routeType: "road",
    transportNumber: "B 9042 KX",
  },
  {
    id: "NRV-03-2403",
    customer: customerAccounts.sendWell,
    origin: { display: "Walvis Bay Harbour", country: "Namibia", countryCode: "NA", coordinates: [14.5, -22.95] },
    destination: {
      display: "Port of Durban",
      country: "South Africa",
      countryCode: "ZA",
      coordinates: [31.03, -29.87],
    },
    cargo: "Frozen Seafood",
    handling: {
      label: "Temperature controlled",
      note: "Maintain frozen chain at or below -18°C until port handoff.",
      tags: [
        { label: "Temperature log", icon: Thermometer },
        { label: "Keep frozen", icon: Snowflake },
        { label: "Seal intact", icon: ShieldCheck },
      ],
    },
    weight: "19,800 kg",
    eta: "09:15 PM",
    etaMeta: "Delivered Yesterday",
    status: "Delivered",
    progress: 100,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV SEA-318",
  },
  {
    id: "NRV-04-2404",
    customer: customerAccounts.maersk,
    origin: { display: "Kenneth Kaunda Airport", country: "Zambia", countryCode: "ZM", coordinates: [28.453, -15.331] },
    destination: {
      display: "OR Tambo Airport",
      country: "South Africa",
      countryCode: "ZA",
      coordinates: [28.246, -26.139],
    },
    cargo: "Pharmaceutical Kits",
    handling: {
      label: "Temperature controlled",
      note: "Maintain controlled temperature and verify hold clearance before release.",
      tags: [
        { label: "Temperature log", icon: Thermometer },
        { label: "Keep upright", icon: ArrowUp },
        { label: "Signature required", icon: PenLine },
      ],
    },
    weight: "540 kg",
    eta: "06:10 PM",
    etaMeta: "Today",
    status: "On Hold",
    progress: 28,
    mode: "air",
    routeType: "flight",
    transportNumber: "MH-728",
  },
  {
    id: "NRV-05-2405",
    customer: customerAccounts.sourceDay,
    origin: { display: "Johannesburg hub", country: "South Africa", countryCode: "ZA", coordinates: [28.047, -26.204] },
    destination: { display: "Gaborone hub", country: "Botswana", countryCode: "BW", coordinates: [25.923, -24.629] },
    cargo: "Textiles",
    handling: {
      label: "Standard freight",
      note: "Keep cartons dry and away from direct sunlight.",
      tags: [
        { label: "Keep dry", icon: Droplets },
        { label: "Do not crush", icon: Ban },
        { label: "Standard handoff", icon: PackageCheck },
      ],
    },
    weight: "1,380 kg",
    eta: "09:30 AM",
    etaMeta: "Friday",
    status: "Scheduled",
    progress: 12,
    mode: "land",
    routeType: "road",
    transportNumber: "D 1284 YA",
  },
  {
    id: "NRV-06-2406",
    customer: customerAccounts.logisticsPlus,
    origin: { display: "Port of Maputo", country: "Mozambique", countryCode: "MZ", coordinates: [32.57, -25.97] },
    destination: {
      display: "Port Louis Harbour",
      country: "Mauritius",
      countryCode: "MU",
      coordinates: [57.5, -20.16],
    },
    cargo: "Construction Materials",
    handling: {
      label: "Heavy bulk cargo",
      note: "Load with heavy-lift equipment and secure against shifting.",
      tags: [
        { label: "Heavy lift", icon: Forklift },
        { label: "Secure load", icon: ShieldCheck },
        { label: "Do not stack", icon: Ban },
      ],
    },
    weight: "27,400 kg",
    eta: "03:40 PM",
    etaMeta: "Departing Today",
    status: "Scheduled",
    progress: 18,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV LC-204",
  },
  {
    id: "NRV-07-2407",
    customer: customerAccounts.flexport,
    origin: { display: "Hosea Kutako Airport", country: "Namibia", countryCode: "NA", coordinates: [17.464, -22.48] },
    destination: {
      display: "Cape Town Airport",
      country: "South Africa",
      countryCode: "ZA",
      coordinates: [18.602, -33.965],
    },
    cargo: "Medical Devices",
    handling: {
      label: "Sensitive medical equipment",
      note: "Keep medical devices sealed until customs inspection is complete.",
      tags: [
        { label: "Seal intact", icon: ShieldCheck },
        { label: "Keep upright", icon: ArrowUp },
        { label: "Signature required", icon: PenLine },
      ],
    },
    weight: "860 kg",
    eta: "Pending",
    etaMeta: "Customs",
    status: "Customs Hold",
    progress: 33,
    mode: "air",
    routeType: "flight",
    transportNumber: "CX-901",
  },
  {
    id: "NRV-08-2408",
    customer: customerAccounts.shippingEasy,
    origin: { display: "Mbabane depot", country: "Eswatini", countryCode: "SZ", coordinates: [31.137, -26.306] },
    destination: {
      display: "Johannesburg hub",
      country: "South Africa",
      countryCode: "ZA",
      coordinates: [28.047, -26.204],
    },
    cargo: "Retail Apparel",
    handling: {
      label: "Standard freight",
      note: "Keep cartons dry and call receiver before final delivery.",
      tags: [
        { label: "Keep dry", icon: Droplets },
        { label: "Call before delivery", icon: Truck },
        { label: "Standard handoff", icon: PackageCheck },
      ],
    },
    weight: "620 kg",
    eta: "02:15 PM",
    etaMeta: "Today",
    status: "Out for Delivery",
    progress: 88,
    mode: "land",
    routeType: "road",
    transportNumber: "B 7712 JKT",
  },
  {
    id: "NRV-09-2409",
    customer: customerAccounts.freightView,
    origin: { display: "Port of Durban", country: "South Africa", countryCode: "ZA", coordinates: [31.03, -29.87] },
    destination: { display: "Walvis Bay Harbour", country: "Namibia", countryCode: "NA", coordinates: [14.5, -22.95] },
    cargo: "Auto Parts",
    handling: {
      label: "Industrial parts",
      note: "Secure pallets and protect machined surfaces from moisture.",
      tags: [
        { label: "Secure load", icon: ShieldCheck },
        { label: "Keep dry", icon: Droplets },
        { label: "Forklift only", icon: Forklift },
      ],
    },
    weight: "12,200 kg",
    eta: "05:50 PM",
    etaMeta: "Wednesday",
    status: "In Transit",
    progress: 54,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV BUSAN-54",
  },
  {
    id: "NRV-10-2410",
    customer: customerAccounts.techCorp,
    origin: {
      display: "Cape Town Airport",
      country: "South Africa",
      countryCode: "ZA",
      coordinates: [18.602, -33.965],
    },
    destination: {
      display: "Kenneth Kaunda Airport",
      country: "Zambia",
      countryCode: "ZM",
      coordinates: [28.453, -15.331],
    },
    cargo: "Semiconductor Wafers",
    handling: {
      label: "High-value fragile cargo",
      note: "Keep wafers sealed in shock-protected packaging until signed handoff.",
      tags: [
        { label: "Do not stack", icon: Ban },
        { label: "Keep upright", icon: ArrowUp },
        { label: "Signature required", icon: PenLine },
      ],
    },
    weight: "320 kg",
    eta: "08:30 PM",
    etaMeta: "Delivered Yesterday",
    status: "Delivered",
    progress: 100,
    mode: "air",
    routeType: "flight",
    transportNumber: "KE-704",
  },
  {
    id: "NRV-11-2411",
    customer: customerAccounts.sourceDay,
    origin: { display: "Gaborone hub", country: "Botswana", countryCode: "BW", coordinates: [25.923, -24.629] },
    destination: {
      display: "Pretoria depot",
      country: "South Africa",
      countryCode: "ZA",
      coordinates: [28.188, -25.747],
    },
    cargo: "Food Ingredients",
    handling: {
      label: "Food-grade handling",
      note: "Keep food-grade seals intact and avoid cross-contamination.",
      tags: [
        { label: "Food grade", icon: PackageCheck },
        { label: "Seal intact", icon: ShieldCheck },
        { label: "Keep dry", icon: Droplets },
      ],
    },
    weight: "3,950 kg",
    eta: "01:05 PM",
    etaMeta: "Today",
    status: "In Transit",
    progress: 71,
    mode: "land",
    routeType: "road",
    transportNumber: "WQH 2184",
  },
  {
    id: "NRV-12-2412",
    customer: customerAccounts.transvirtual,
    origin: { display: "Port Louis Harbour", country: "Mauritius", countryCode: "MU", coordinates: [57.5, -20.16] },
    destination: { display: "Port of Maputo", country: "Mozambique", countryCode: "MZ", coordinates: [32.57, -25.97] },
    cargo: "Agricultural Produce",
    handling: {
      label: "Perishable goods",
      note: "Prioritize ventilation and inspect produce condition at port handoff.",
      tags: [
        { label: "Perishable", icon: Thermometer },
        { label: "Ventilated hold", icon: PackageCheck },
        { label: "Inspect on arrival", icon: CheckCircle2 },
      ],
    },
    weight: "6,700 kg",
    eta: "09:40 AM",
    etaMeta: "Friday",
    status: "Delayed",
    progress: 39,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV DAVAO-12",
  },
  {
    id: "NRV-13-2413",
    customer: customerAccounts.flexport,
    origin: { display: "OR Tambo Airport", country: "South Africa", countryCode: "ZA", coordinates: [28.246, -26.139] },
    destination: {
      display: "Hosea Kutako Airport",
      country: "Namibia",
      countryCode: "NA",
      coordinates: [17.464, -22.48],
    },
    cargo: "Luxury Retail Goods",
    handling: {
      label: "High-value cargo",
      note: "Keep cartons sealed; release only to authorized receiving contact.",
      tags: [
        { label: "High value", icon: Star },
        { label: "Do not stack", icon: Ban },
        { label: "Signature required", icon: PenLine },
      ],
    },
    weight: "210 kg",
    eta: "07:15 AM",
    etaMeta: "Monday",
    status: "Scheduled",
    progress: 9,
    mode: "air",
    routeType: "flight",
    transportNumber: "SQ-938",
  },
  {
    id: "NRV-14-2414",
    customer: customerAccounts.sendWell,
    origin: { display: "Port of Maputo", country: "Mozambique", countryCode: "MZ", coordinates: [32.57, -25.97] },
    destination: {
      display: "Port Louis Harbour",
      country: "Mauritius",
      countryCode: "MU",
      coordinates: [57.5, -20.16],
    },
    cargo: "Paper Rolls",
    handling: {
      label: "Moisture-sensitive cargo",
      note: "Keep rolls dry and avoid edge impact during unloading.",
      tags: [
        { label: "Keep dry", icon: Droplets },
        { label: "Do not tip", icon: Ban },
        { label: "Forklift only", icon: Forklift },
      ],
    },
    weight: "15,900 kg",
    eta: "Awaiting Release",
    etaMeta: "Warehouse",
    status: "On Hold",
    progress: 25,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV PRI-77",
  },
  {
    id: "NRV-15-2415",
    customer: customerAccounts.skyTrack,
    origin: { display: "Gaborone hub", country: "Botswana", countryCode: "BW", coordinates: [25.923, -24.629] },
    destination: {
      display: "Pretoria depot",
      country: "South Africa",
      countryCode: "ZA",
      coordinates: [28.188, -25.747],
    },
    cargo: "Beverage Stock",
    handling: {
      label: "Standard palletized freight",
      note: "Keep pallets upright and prevent carton crush during road transfer.",
      tags: [
        { label: "Keep upright", icon: ArrowUp },
        { label: "Do not stack", icon: Ban },
        { label: "Standard handoff", icon: PackageCheck },
      ],
    },
    weight: "4,500 kg",
    eta: "03:30 PM",
    etaMeta: "Today",
    status: "Scheduled",
    progress: 16,
    mode: "land",
    routeType: "road",
    transportNumber: "BK 4520 RA",
  },
  {
    id: "NRV-16-2416",
    customer: customerAccounts.regionalRoadExpress,
    origin: { display: "Kenneth Kaunda Airport", country: "Zambia", countryCode: "ZM", coordinates: [28.453, -15.331] },
    destination: {
      display: "OR Tambo Airport",
      country: "South Africa",
      countryCode: "ZA",
      coordinates: [28.246, -26.139],
    },
    cargo: "Auto Components",
    handling: {
      label: "Industrial parts",
      note: "Secure crates and inspect pallet straps before final handoff.",
      tags: [
        { label: "Secure load", icon: ShieldCheck },
        { label: "Forklift only", icon: Forklift },
        { label: "Inspect on arrival", icon: CheckCircle2 },
      ],
    },
    weight: "780 kg",
    eta: "04:10 PM",
    etaMeta: "Today",
    status: "Out for Delivery",
    progress: 84,
    mode: "air",
    routeType: "flight",
    transportNumber: "AI-864",
  },
  {
    id: "NRV-17-2417",
    customer: customerAccounts.logisticsPlus,
    origin: { display: "Port of Durban", country: "South Africa", countryCode: "ZA", coordinates: [31.03, -29.87] },
    destination: { display: "Walvis Bay Harbour", country: "Namibia", countryCode: "NA", coordinates: [14.5, -22.95] },
    cargo: "Packaging Materials",
    handling: {
      label: "Standard freight",
      note: "Keep pallets dry and verify pallet count at discharge.",
      tags: [
        { label: "Keep dry", icon: Droplets },
        { label: "Count on arrival", icon: CheckCircle2 },
        { label: "Standard handoff", icon: PackageCheck },
      ],
    },
    weight: "21,300 kg",
    eta: "Next Week",
    etaMeta: "Tuesday",
    status: "In Transit",
    progress: 62,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV HAM-902",
  },
  {
    id: "NRV-18-2418",
    customer: customerAccounts.transvirtual,
    origin: { display: "Pretoria depot", country: "South Africa", countryCode: "ZA", coordinates: [28.188, -25.747] },
    destination: { display: "Mbabane depot", country: "Eswatini", countryCode: "SZ", coordinates: [31.137, -26.306] },
    cargo: "Household Appliances",
    handling: {
      label: "Fragile bulky goods",
      note: "Use two-person handling and keep appliances upright until delivery.",
      tags: [
        { label: "Keep upright", icon: ArrowUp },
        { label: "Do not stack", icon: Ban },
        { label: "Two-person lift", icon: Truck },
      ],
    },
    weight: "2,060 kg",
    eta: "11:40 AM",
    etaMeta: "Delivered Today",
    status: "Delivered",
    progress: 100,
    mode: "land",
    routeType: "road",
    transportNumber: "51C-208.44",
  },
  {
    id: "NRV-19-2419",
    customer: customerAccounts.maersk,
    origin: { display: "Hosea Kutako Airport", country: "Namibia", countryCode: "NA", coordinates: [17.464, -22.48] },
    destination: {
      display: "Cape Town Airport",
      country: "South Africa",
      countryCode: "ZA",
      coordinates: [18.602, -33.965],
    },
    cargo: "Temperature Controlled Goods",
    handling: {
      label: "Temperature controlled",
      note: "Maintain temperature range and escalate delay exceptions immediately.",
      tags: [
        { label: "Temperature log", icon: Thermometer },
        { label: "Keep upright", icon: ArrowUp },
        { label: "Escalate delay", icon: AlertTriangleIcon },
      ],
    },
    weight: "1,120 kg",
    eta: "10:50 PM",
    etaMeta: "Tonight",
    status: "Delayed",
    progress: 47,
    mode: "air",
    routeType: "flight",
    transportNumber: "SV-591",
  },
  {
    id: "NRV-20-2420",
    customer: customerAccounts.freightView,
    origin: { display: "Port Louis Harbour", country: "Mauritius", countryCode: "MU", coordinates: [57.5, -20.16] },
    destination: { display: "Port of Maputo", country: "Mozambique", countryCode: "MZ", coordinates: [32.57, -25.97] },
    cargo: "Steel Coils",
    handling: {
      label: "Heavy bulk cargo",
      note: "Use coil cradles and confirm lashings before release.",
      tags: [
        { label: "Heavy lift", icon: Forklift },
        { label: "Secure load", icon: ShieldCheck },
        { label: "Do not tip", icon: Ban },
      ],
    },
    weight: "31,800 kg",
    eta: "06:00 AM",
    etaMeta: "Thursday",
    status: "Scheduled",
    progress: 14,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV COL-620",
  },
  {
    id: "NRV-21-2421",
    customer: customerAccounts.piedPiper,
    origin: { display: "Johannesburg hub", country: "South Africa", countryCode: "ZA", coordinates: [28.047, -26.204] },
    destination: { display: "Gaborone hub", country: "Botswana", countryCode: "BW", coordinates: [25.923, -24.629] },
    cargo: "Furniture",
    handling: {
      label: "Fragile bulky goods",
      note: "Use blanket wrap and avoid stacking on finished surfaces.",
      tags: [
        { label: "Do not stack", icon: Ban },
        { label: "Keep dry", icon: Droplets },
        { label: "Two-person lift", icon: Truck },
      ],
    },
    weight: "5,240 kg",
    eta: "08:20 AM",
    etaMeta: "Tomorrow",
    status: "In Transit",
    progress: 58,
    mode: "land",
    routeType: "road",
    transportNumber: "กท 8842",
  },
  {
    id: "NRV-22-2422",
    customer: customerAccounts.techCorp,
    origin: {
      display: "Cape Town Airport",
      country: "South Africa",
      countryCode: "ZA",
      coordinates: [18.602, -33.965],
    },
    destination: {
      display: "Kenneth Kaunda Airport",
      country: "Zambia",
      countryCode: "ZM",
      coordinates: [28.453, -15.331],
    },
    cargo: "Precision Tools",
    handling: {
      label: "High-value precision cargo",
      note: "Keep locked case sealed pending security clearance.",
      tags: [
        { label: "Security hold", icon: ShieldCheck },
        { label: "Seal intact", icon: ShieldCheck },
        { label: "Signature required", icon: PenLine },
      ],
    },
    weight: "430 kg",
    eta: "Pending",
    etaMeta: "Security",
    status: "On Hold",
    progress: 29,
    mode: "air",
    routeType: "flight",
    transportNumber: "BR-129",
  },
  {
    id: "NRV-23-2423",
    customer: customerAccounts.maersk,
    origin: { display: "Walvis Bay Harbour", country: "Namibia", countryCode: "NA", coordinates: [14.5, -22.95] },
    destination: {
      display: "Port of Durban",
      country: "South Africa",
      countryCode: "ZA",
      coordinates: [31.03, -29.87],
    },
    cargo: "Chemicals",
    handling: {
      label: "Hazardous materials review",
      note: "Hold pending hazardous materials review and port clearance.",
      tags: [
        { label: "Hazmat review", icon: Flame },
        { label: "Keep upright", icon: ArrowUp },
        { label: "Restricted handling", icon: ShieldCheck },
      ],
    },
    weight: "18,600 kg",
    eta: "Departing",
    etaMeta: "02:50 PM",
    status: "Scheduled",
    progress: 19,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV PKG-315",
  },
  {
    id: "NRV-24-2424",
    customer: customerAccounts.shippingEasy,
    origin: { display: "Mbabane depot", country: "Eswatini", countryCode: "SZ", coordinates: [31.137, -26.306] },
    destination: {
      display: "Johannesburg hub",
      country: "South Africa",
      countryCode: "ZA",
      coordinates: [28.047, -26.204],
    },
    cargo: "Fresh Produce",
    handling: {
      label: "Perishable goods",
      note: "Prioritize same-day handoff and keep produce ventilated.",
      tags: [
        { label: "Perishable", icon: Thermometer },
        { label: "Ventilated hold", icon: PackageCheck },
        { label: "Inspect on arrival", icon: CheckCircle2 },
      ],
    },
    weight: "970 kg",
    eta: "06:20 PM",
    etaMeta: "Delivered Today",
    status: "Delivered",
    progress: 100,
    mode: "land",
    routeType: "road",
    transportNumber: "BE 1745 YU",
  },
];
