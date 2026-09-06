// All data in this module is SIMULATED demo data for the FastHire prototype.
// No live GSTIN / CIN / MCA / payroll integration is configured.

export type MicroJob = {
  id: string;
  title: string;
  employer: string;
  area: string;
  pin: string;
  pay: number;
  unit: string;
  hours: string;
  tags: string[];
  trust: number;
  gstin: string;
};

export const MICRO_JOBS: MicroJob[] = [
  {
    id: "MJ-2041",
    title: "Evening Café Counter Assistant",
    employer: "Brew & Bloom Café",
    area: "Koramangala, Bengaluru",
    pin: "560034",
    pay: 220,
    unit: "per hour",
    hours: "5 PM – 9 PM, Mon–Fri",
    tags: ["Food service", "Walk-in"],
    trust: 92,
    gstin: "29AABCB1429P1ZQ",
  },
  {
    id: "MJ-2058",
    title: "Weekend Inventory Tagging",
    employer: "Sharma Hardware Stores",
    area: "Laxmi Nagar, Delhi",
    pin: "110092",
    pay: 950,
    unit: "per shift",
    hours: "Sat–Sun, 10 AM – 4 PM",
    tags: ["Retail", "Physical work"],
    trust: 88,
    gstin: "07AACFS9012K1Z3",
  },
  {
    id: "MJ-2073",
    title: "Campus Survey Field Agent",
    employer: "Meridian Research Labs Pvt Ltd",
    area: "Kothrud, Pune",
    pin: "411038",
    pay: 45,
    unit: "per response",
    hours: "Flexible, 20 hrs/week cap",
    tags: ["Field work", "Flexible"],
    trust: 79,
    gstin: "27AAECM4411L1ZW",
  },
  {
    id: "MJ-2090",
    title: "Tuition Assistant — Class 8 Maths",
    employer: "Vidya Path Coaching",
    area: "Salt Lake, Kolkata",
    pin: "700091",
    pay: 400,
    unit: "per session",
    hours: "Tue/Thu, 6 PM – 8 PM",
    tags: ["Teaching", "Indoor"],
    trust: 95,
    gstin: "19AAFCV7781M1ZK",
  },
  {
    id: "MJ-2112",
    title: "Delivery Support — Festival Week",
    employer: "QuickCart Logistics",
    area: "Ameerpet, Hyderabad",
    pin: "500016",
    pay: 1100,
    unit: "per shift",
    hours: "6 PM – 11 PM, 7 days",
    tags: ["Logistics", "Two-wheeler"],
    trust: 71,
    gstin: "36AADCQ3320N1ZB",
  },
  {
    id: "MJ-2131",
    title: "Library Digitisation Volunteer+",
    employer: "Nirmal Trust Public Library",
    area: "Navrangpura, Ahmedabad",
    pin: "380009",
    pay: 180,
    unit: "per hour",
    hours: "Weekday mornings",
    tags: ["Clerical", "Quiet"],
    trust: 90,
    gstin: "24AAATN5567R1ZF",
  },
];

export type Shift = {
  id: string;
  job: string;
  date: string;
  hours: number;
  gross: number;
  subsidy: number;
  status: "Paid" | "Processing" | "Pending";
};

export const MY_SHIFTS: Shift[] = [
  { id: "S-8801", job: "Evening Café Counter Assistant", date: "12 Aug", hours: 4, gross: 880, subsidy: 132, status: "Paid" },
  { id: "S-8814", job: "Tuition Assistant — Class 8 Maths", date: "14 Aug", hours: 2, gross: 800, subsidy: 120, status: "Paid" },
  { id: "S-8829", job: "Weekend Inventory Tagging", date: "17 Aug", hours: 6, gross: 950, subsidy: 143, status: "Processing" },
  { id: "S-8843", job: "Evening Café Counter Assistant", date: "19 Aug", hours: 4, gross: 880, subsidy: 132, status: "Processing" },
  { id: "S-8850", job: "Campus Survey Field Agent", date: "21 Aug", hours: 5, gross: 720, subsidy: 108, status: "Pending" },
];

export const EARNINGS_TREND = [
  { week: "W1", earnings: 1240 },
  { week: "W2", earnings: 1680 },
  { week: "W3", earnings: 900 },
  { week: "W4", earnings: 2130 },
  { week: "W5", earnings: 1830 },
  { week: "W6", earnings: 2450 },
];

export type Memo = {
  id: string;
  role: string;
  slots: number;
  filled: number;
  payPerShift: number;
  subsidyPct: number;
  status: "Open" | "Filled" | "Draft";
  posted: string;
};

export const VENDOR_MEMOS: Memo[] = [
  { id: "GM-311", role: "Counter Assistant (evening)", slots: 3, filled: 2, payPerShift: 880, subsidyPct: 15, status: "Open", posted: "3 days ago" },
  { id: "GM-318", role: "Weekend Stock Audit", slots: 2, filled: 2, payPerShift: 950, subsidyPct: 20, status: "Filled", posted: "6 days ago" },
  { id: "GM-322", role: "Festival Promo Distribution", slots: 5, filled: 1, payPerShift: 700, subsidyPct: 25, status: "Open", posted: "1 day ago" },
  { id: "GM-330", role: "Billing Desk Trainee", slots: 1, filled: 0, payPerShift: 1020, subsidyPct: 15, status: "Draft", posted: "Today" },
];

export type BulkTask = {
  id: string;
  batch: string;
  city: string;
  workers: number;
  assigned: number;
  budget: number;
  sla: string;
  status: "Live" | "Scheduled" | "Closed";
};

export const BULK_TASKS: BulkTask[] = [
  { id: "BT-7001", batch: "Retail shelf audit — 240 outlets", city: "Mumbai", workers: 60, assigned: 54, budget: 486000, sla: "5 days", status: "Live" },
  { id: "BT-7014", batch: "KYC document pickup", city: "Bengaluru", workers: 35, assigned: 35, budget: 262500, sla: "3 days", status: "Live" },
  { id: "BT-7022", batch: "Solar meter photo capture", city: "Jaipur", workers: 48, assigned: 12, budget: 384000, sla: "8 days", status: "Scheduled" },
  { id: "BT-7030", batch: "Rural network signal survey", city: "Patna", workers: 80, assigned: 80, budget: 520000, sla: "Completed", status: "Closed" },
];

export const PIN_METRICS = [
  { pin: "560034", city: "Bengaluru", active: 1284, payout: 1840000, scamRisk: 12 },
  { pin: "110092", city: "Delhi", active: 1102, payout: 1520000, scamRisk: 31 },
  { pin: "411038", city: "Pune", active: 864, payout: 1130000, scamRisk: 18 },
  { pin: "700091", city: "Kolkata", active: 731, payout: 940000, scamRisk: 24 },
  { pin: "500016", city: "Hyderabad", active: 968, payout: 1275000, scamRisk: 39 },
  { pin: "380009", city: "Ahmedabad", active: 655, payout: 812000, scamRisk: 15 },
];

export const PAYOUT_TREND = [
  { month: "Mar", payout: 42, flagged: 6 },
  { month: "Apr", payout: 51, flagged: 8 },
  { month: "May", payout: 47, flagged: 5 },
  { month: "Jun", payout: 63, flagged: 11 },
  { month: "Jul", payout: 71, flagged: 9 },
  { month: "Aug", payout: 84, flagged: 14 },
];

export const SCAM_CATEGORIES = [
  { name: "Advance / registration fee", value: 38 },
  { name: "Unregistered employer", value: 24 },
  { name: "Document misuse", value: 18 },
  { name: "Unrealistic pay claims", value: 20 },
];

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
