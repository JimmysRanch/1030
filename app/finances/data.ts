
export type FinanceInvoice = {
  id: string;
  invoiceNumber: string | null;
  clientName: string | null;
  petName: string | null;
  status: string | null;
  issuedOn: string | null;
  dueOn: string | null;
  paidOn: string | null;
  services: string[];
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  balanceDue: number | null;
  paymentMethod: string | null;
  notes: string | null;
  tags: string[];
};

export type FinanceExpense = {
  id: string;
  category: string | null;
  vendor: string | null;
  status: string | null;
  incurredOn: string | null;
  dueOn: string | null;
  paidOn: string | null;
  amount: number | null;
  paymentMethod: string | null;
  notes: string | null;
};

export type FinancePayout = {
  id: string;
  provider: string | null;
  reference: string | null;
  status: string | null;
  payoutDate: string | null;
  gross: number | null;
  fees: number | null;
  net: number | null;
  transactionCount: number | null;
};

export type FinancePayment = {
  id: string;
  processor: string | null;
  reference: string | null;
  channel: string | null;
  method: string | null;
  status: string | null;
  initiatedOn: string | null;
  settledOn: string | null;
  amount: number | null;
  fee: number | null;
  customer: string | null;
  memo: string | null;
};

export type FinancePayrollRun = {
  id: string;
  period: string;
  processedOn: string | null;
  payDate: string | null;
  status: string | null;
  teamMembers: number;
  gross: number;
  taxes: number;
  benefits: number;
  reimbursements: number;
  net: number;
  notes: string | null;
};

export type FinanceTaxFiling = {
  id: string;
  title: string;
  jurisdiction: string;
  form: string;
  period: string;
  dueOn: string | null;
  submittedOn: string | null;
  status: string | null;
  amountDue: number | null;
  confirmation: string | null;
};

export type FinanceVendorContact = {
  name: string;
  email: string;
  phone: string | null;
};

export type FinanceVendor = {
  id: string;
  name: string;
  category: string;
  status: string | null;
  spendYtd: number;
  openBalance: number;
  paymentTerms: string;
  lastInvoiceOn: string | null;
  contacts: FinanceVendorContact[];
  notes: string | null;
};

export type FinancePurchaseOrder = {
  id: string;
  vendor: string;
  status: string | null;
  issuedOn: string | null;
  expectedOn: string | null;
  items: string[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  balanceDue: number;
  memo: string | null;
};

export type FinanceInvoiceSummary = {
  total: number;
  collected: number;
  outstanding: number;
  overdue: number;
  invoiceCount: number;
  paidCount: number;
  openCount: number;
  averageInvoice: number;
};

export type FinanceExpenseSummary = {
  total: number;
  count: number;
  upcomingCount: number;
  monthToDate: number;
};

export type FinancePayoutSummary = {
  count: number;
  gross: number;
  fees: number;
  net: number;
  nextPayout: FinancePayout | null;
};

export type FinancePaymentSummary = {
  totalVolume: number;
  settledVolume: number;
  pendingVolume: number;
  averageTicket: number;
  failedCount: number;
};

export type FinancePayrollSummary = {
  totalGross: number;
  totalNet: number;
  employeeCount: number;
  upcomingRun: FinancePayrollRun | null;
};

export type FinanceTaxSummary = {
  totalDue: number;
  dueSoonCount: number;
  pastDueCount: number;
  filedCount: number;
};

export type FinanceVendorSummary = {
  activeVendors: number;
  onHoldVendors: number;
  totalSpendYtd: number;
  openBalance: number;
};

export type FinancePurchaseOrderSummary = {
  openOrders: number;
  awaitingReceipt: number;
  receivedOrders: number;
  totalCommitted: number;
};

export type ExpenseCategorySummary = {
  category: string;
  total: number;
  count: number;
};

export type CashflowPoint = {
  month: string;
  revenue: number;
  expenses: number;
  net: number;
};

const FINANCE_INVOICES: FinanceInvoice[] = [
  {
    id: "inv-sb-1051",
    invoiceNumber: "SB-1051",
    clientName: "Gina Walters",
    petName: "Murphy",
    status: "Paid",
    issuedOn: "2025-04-02",
    dueOn: "2025-04-09",
    paidOn: "2025-04-06",
    services: ["Full groom", "Blueberry facial"],
    subtotal: 165,
    tax: 12.54,
    total: 177.54,
    balanceDue: 0,
    paymentMethod: "Card on file",
    notes: "Prefers early morning drop-off",
    tags: ["grooming", "vip"],
  },
  {
    id: "inv-sb-1052",
    invoiceNumber: "SB-1052",
    clientName: "Marcos Vega",
    petName: "Frida",
    status: "Partial",
    issuedOn: "2025-04-05",
    dueOn: "2025-04-20",
    paidOn: null,
    services: ["Daycare", "Teeth brushing"],
    subtotal: 120,
    tax: 9.6,
    total: 129.6,
    balanceDue: 64.8,
    paymentMethod: "Card on file",
    notes: "Will settle remaining after payday",
    tags: ["daycare"],
  },
  {
    id: "inv-sb-1053",
    invoiceNumber: "SB-1053",
    clientName: "Naomi Ellis",
    petName: "Scout",
    status: "Open",
    issuedOn: "2025-04-12",
    dueOn: "2025-05-01",
    paidOn: null,
    services: ["Spring grooming package"],
    subtotal: 210,
    tax: 16.8,
    total: 226.8,
    balanceDue: 226.8,
    paymentMethod: "ACH",
    notes: "Requested gentle mat removal",
    tags: ["grooming"],
  },
  {
    id: "inv-sb-1046",
    invoiceNumber: "SB-1046",
    clientName: "Rowan Price",
    petName: "Juniper",
    status: "Overdue",
    issuedOn: "2025-03-10",
    dueOn: "2025-03-24",
    paidOn: null,
    services: ["Boarding", "Medication admin"],
    subtotal: 340,
    tax: 27.2,
    total: 367.2,
    balanceDue: 367.2,
    paymentMethod: "Invoice",
    notes: "Follow up weekly",
    tags: ["boarding", "medical"],
  },
  {
    id: "inv-sb-1045",
    invoiceNumber: "SB-1045",
    clientName: "Devon Chen",
    petName: "Pixel",
    status: "Paid",
    issuedOn: "2025-03-04",
    dueOn: "2025-03-11",
    paidOn: "2025-03-09",
    services: ["Haircut", "Paw balm"],
    subtotal: 118,
    tax: 9.44,
    total: 127.44,
    balanceDue: 0,
    paymentMethod: "Apple Pay",
    notes: "Add-on each visit",
    tags: ["grooming"],
  },
  {
    id: "inv-sb-1044",
    invoiceNumber: "SB-1044",
    clientName: "Lena Harper",
    petName: "Cosmo",
    status: "Paid",
    issuedOn: "2025-02-22",
    dueOn: "2025-03-01",
    paidOn: "2025-02-28",
    services: ["Boarding", "Grooming exit bath"],
    subtotal: 420,
    tax: 33.6,
    total: 453.6,
    balanceDue: 0,
    paymentMethod: "Card on file",
    notes: "Boarding deposit collected",
    tags: ["boarding"],
  },
  {
    id: "inv-sb-1043",
    invoiceNumber: "SB-1043",
    clientName: "Jessie Patel",
    petName: "Loki",
    status: "Partial",
    issuedOn: "2025-03-15",
    dueOn: "2025-04-25",
    paidOn: "2025-03-18",
    services: ["Daycare bundle"],
    subtotal: 260,
    tax: 20.8,
    total: 280.8,
    balanceDue: 140.4,
    paymentMethod: "Card on file",
    notes: "Remaining balance scheduled for auto-pay",
    tags: ["daycare"],
  },
  {
    id: "inv-sb-1042",
    invoiceNumber: "SB-1042",
    clientName: "Amber Holt",
    petName: "Poppy",
    status: "Paid",
    issuedOn: "2025-02-14",
    dueOn: "2025-02-21",
    paidOn: "2025-02-19",
    services: ["Spa day", "Teeth brushing"],
    subtotal: 150,
    tax: 12,
    total: 162,
    balanceDue: 0,
    paymentMethod: "Cash",
    notes: null,
    tags: ["spa"],
  },
  {
    id: "inv-sb-1054",
    invoiceNumber: "SB-1054",
    clientName: "Brett Lane",
    petName: "Miso",
    status: "Scheduled",
    issuedOn: "2025-04-16",
    dueOn: "2025-05-08",
    paidOn: null,
    services: ["Mobile grooming"],
    subtotal: 185,
    tax: 14.8,
    total: 199.8,
    balanceDue: 199.8,
    paymentMethod: "Card on file",
    notes: "Mobile van appointment",
    tags: ["mobile"],
  },
  {
    id: "inv-sb-1041",
    invoiceNumber: "SB-1041",
    clientName: "Carmen Ortiz",
    petName: "Koda",
    status: "Paid",
    issuedOn: "2025-02-01",
    dueOn: "2025-02-08",
    paidOn: "2025-02-07",
    services: ["Training session", "Follow-up call"],
    subtotal: 195,
    tax: 15.6,
    total: 210.6,
    balanceDue: 0,
    paymentMethod: "Card on file",
    notes: "Great progress",
    tags: ["training"],
  },
  {
    id: "inv-sb-1039",
    invoiceNumber: "SB-1039",
    clientName: "Noah Simmons",
    petName: "Indy",
    status: "Overdue",
    issuedOn: "2025-02-18",
    dueOn: "2025-03-05",
    paidOn: null,
    services: ["Boarding", "Grooming exit bath"],
    subtotal: 360,
    tax: 28.8,
    total: 388.8,
    balanceDue: 388.8,
    paymentMethod: "Invoice",
    notes: "Deposit missed",
    tags: ["boarding"],
  },
  {
    id: "inv-sb-1038",
    invoiceNumber: "SB-1038",
    clientName: "Ivy Barrett",
    petName: "Nova",
    status: "Paid",
    issuedOn: "2025-01-20",
    dueOn: "2025-01-27",
    paidOn: "2025-01-26",
    services: ["Grooming makeover"],
    subtotal: 240,
    tax: 19.2,
    total: 259.2,
    balanceDue: 0,
    paymentMethod: "Card on file",
    notes: "Add creative trim photos to gallery",
    tags: ["grooming", "creative"],
  },
];

const FINANCE_EXPENSES: FinanceExpense[] = [
  {
    id: "exp-401",
    category: "Rent",
    vendor: "Prairie Plaza Management",
    status: "Paid",
    incurredOn: "2025-04-01",
    dueOn: "2025-04-05",
    paidOn: "2025-04-03",
    amount: 5200,
    paymentMethod: "ACH",
    notes: "Suite 210 monthly rent",
  },
  {
    id: "exp-402",
    category: "Supplies",
    vendor: "Happy Paws Wholesale",
    status: "Paid",
    incurredOn: "2025-04-07",
    dueOn: "2025-04-12",
    paidOn: "2025-04-10",
    amount: 1184.25,
    paymentMethod: "Business card",
    notes: "Shampoo restock + bows",
  },
  {
    id: "exp-403",
    category: "Payroll Taxes",
    vendor: "IRS EFTPS",
    status: "Scheduled",
    incurredOn: "2025-04-10",
    dueOn: "2025-04-18",
    paidOn: null,
    amount: 2680,
    paymentMethod: "ACH",
    notes: "Quarterly withholding",
  },
  {
    id: "exp-404",
    category: "Utilities",
    vendor: "City Energy",
    status: "Paid",
    incurredOn: "2025-03-26",
    dueOn: "2025-04-04",
    paidOn: "2025-03-30",
    amount: 612.48,
    paymentMethod: "ACH",
    notes: "Electric + water",
  },
  {
    id: "exp-405",
    category: "Marketing",
    vendor: "Fetch Social",
    status: "Due Soon",
    incurredOn: "2025-04-13",
    dueOn: "2025-04-22",
    paidOn: null,
    amount: 450,
    paymentMethod: "Card on file",
    notes: "Mother's Day promo spend",
  },
  {
    id: "exp-406",
    category: "Insurance",
    vendor: "GroomGuard Insurance",
    status: "Paid",
    incurredOn: "2025-03-01",
    dueOn: "2025-03-15",
    paidOn: "2025-03-12",
    amount: 985.5,
    paymentMethod: "ACH",
    notes: "Quarterly liability",
  },
  {
    id: "exp-407",
    category: "Software",
    vendor: "GroomSuite Pro",
    status: "Paid",
    incurredOn: "2025-02-27",
    dueOn: "2025-03-02",
    paidOn: "2025-02-27",
    amount: 329,
    paymentMethod: "Card on file",
    notes: "SaaS subscription",
  },
  {
    id: "exp-408",
    category: "Laundry",
    vendor: "Sparkle Linens",
    status: "Paid",
    incurredOn: "2025-03-20",
    dueOn: "2025-03-25",
    paidOn: "2025-03-24",
    amount: 214.35,
    paymentMethod: "Business card",
    notes: "Weekly towel service",
  },
  {
    id: "exp-409",
    category: "Vehicle",
    vendor: "Mobile Groom Van Lease",
    status: "Paid",
    incurredOn: "2025-04-02",
    dueOn: "2025-04-10",
    paidOn: "2025-04-02",
    amount: 890,
    paymentMethod: "ACH",
    notes: "April lease payment",
  },
  {
    id: "exp-410",
    category: "Professional Services",
    vendor: "Tailwind Accounting",
    status: "Pending",
    incurredOn: "2025-04-14",
    dueOn: "2025-04-30",
    paidOn: null,
    amount: 750,
    paymentMethod: "Invoice",
    notes: "Quarterly bookkeeping",
  },
];

const FINANCE_PAYOUTS: FinancePayout[] = [
  {
    id: "payout-310",
    provider: "Stripe",
    reference: "PAYOUT-310",
    status: "Sent",
    payoutDate: "2025-04-04",
    gross: 8421.5,
    fees: 248.64,
    net: 8172.86,
    transactionCount: 96,
  },
  {
    id: "payout-311",
    provider: "Square",
    reference: "BATCH-2245",
    status: "Sent",
    payoutDate: "2025-04-08",
    gross: 3120.75,
    fees: 93.62,
    net: 3027.13,
    transactionCount: 44,
  },
  {
    id: "payout-312",
    provider: "Shopify",
    reference: "SHOP-APR-11",
    status: "Processing",
    payoutDate: "2025-04-11",
    gross: 1185.2,
    fees: 35.56,
    net: 1149.64,
    transactionCount: 28,
  },
  {
    id: "payout-313",
    provider: "GroomrPay",
    reference: "GR-APR-15",
    status: "Scheduled",
    payoutDate: "2025-04-15",
    gross: 2654.4,
    fees: 79.62,
    net: 2574.78,
    transactionCount: 36,
  },
  {
    id: "payout-309",
    provider: "Stripe",
    reference: "PAYOUT-303",
    status: "Sent",
    payoutDate: "2025-03-28",
    gross: 7950.1,
    fees: 235.12,
    net: 7714.98,
    transactionCount: 90,
  },
  {
    id: "payout-308",
    provider: "Square",
    reference: "BATCH-2192",
    status: "Sent",
    payoutDate: "2025-03-25",
    gross: 2864.4,
    fees: 85.92,
    net: 2778.48,
    transactionCount: 40,
  },
];

const FINANCE_PAYMENTS: FinancePayment[] = [
  {
    id: "payment-401",
    processor: "Stripe",
    reference: "pi_3Nk2Gk9u",
    channel: "Online checkout",
    method: "Visa • 9934",
    status: "Settled",
    initiatedOn: "2025-04-07",
    settledOn: "2025-04-08",
    amount: 286.4,
    fee: 8.59,
    customer: "Gina Walters",
    memo: "Invoice SB-1051",
  },
  {
    id: "payment-402",
    processor: "Square",
    reference: "sq0idp-20250408",
    channel: "In-store terminal",
    method: "Amex • 4412",
    status: "Settled",
    initiatedOn: "2025-04-08",
    settledOn: "2025-04-08",
    amount: 178.92,
    fee: 5.14,
    customer: "Rowan Price",
    memo: "Boarding add-ons",
  },
  {
    id: "payment-403",
    processor: "GroomrPay",
    reference: "gr_0425_115",
    channel: "Customer portal",
    method: "ACH - Bank of Cascadia",
    status: "Pending",
    initiatedOn: "2025-04-11",
    settledOn: null,
    amount: 412.75,
    fee: 3.5,
    customer: "Naomi Ellis",
    memo: "Subscription renewal",
  },
  {
    id: "payment-404",
    processor: "Stripe",
    reference: "py_3Nk34bf9",
    channel: "Online checkout",
    method: "Apple Pay",
    status: "Failed",
    initiatedOn: "2025-04-10",
    settledOn: null,
    amount: 94.2,
    fee: 0,
    customer: "Jordan Blake",
    memo: "Gift card reload",
  },
  {
    id: "payment-405",
    processor: "Shopify",
    reference: "shop_12044",
    channel: "Merch store",
    method: "Mastercard • 2210",
    status: "Settled",
    initiatedOn: "2025-04-06",
    settledOn: "2025-04-07",
    amount: 68,
    fee: 2.01,
    customer: "Kaitlyn Marsh",
    memo: "Spring merch bundle",
  },
  {
    id: "payment-406",
    processor: "Square",
    reference: "sq0idp-20250330",
    channel: "Tap to pay",
    method: "Visa • 3311",
    status: "Settled",
    initiatedOn: "2025-03-30",
    settledOn: "2025-03-31",
    amount: 126.5,
    fee: 3.72,
    customer: "Gabe Lin",
    memo: "Puppy spa day",
  },
];

const FINANCE_PAYROLL_RUNS: FinancePayrollRun[] = [
  {
    id: "payroll-2201",
    period: "Apr 1 – Apr 15, 2025",
    processedOn: "2025-04-13",
    payDate: "2025-04-15",
    status: "Scheduled",
    teamMembers: 14,
    gross: 18840,
    taxes: 2846.2,
    benefits: 1320.4,
    reimbursements: 465.75,
    net: 15139.15,
    notes: "Includes spring overtime differentials",
  },
  {
    id: "payroll-2200",
    period: "Mar 16 – Mar 31, 2025",
    processedOn: "2025-04-01",
    payDate: "2025-04-01",
    status: "Paid",
    teamMembers: 14,
    gross: 17620,
    taxes: 2660.4,
    benefits: 1218.6,
    reimbursements: 382.11,
    net: 14123.11,
    notes: "Quarterly bonuses posted",
  },
  {
    id: "payroll-2199",
    period: "Mar 1 – Mar 15, 2025",
    processedOn: "2025-03-16",
    payDate: "2025-03-16",
    status: "Paid",
    teamMembers: 13,
    gross: 16840,
    taxes: 2544.2,
    benefits: 1120.4,
    reimbursements: 295,
    net: 13470.4,
    notes: "New stylists fully onboarded",
  },
  {
    id: "payroll-2198",
    period: "Feb 16 – Feb 29, 2025",
    processedOn: "2025-02-29",
    payDate: "2025-02-29",
    status: "Paid",
    teamMembers: 13,
    gross: 16420,
    taxes: 2463.3,
    benefits: 1108.8,
    reimbursements: 210,
    net: 13057.9,
    notes: "Seasonal team onboarding",
  },
];

const FINANCE_TAX_FILINGS: FinanceTaxFiling[] = [
  {
    id: "tax-9101",
    title: "WA B&O Excise",
    jurisdiction: "Washington",
    form: "WA B&O",
    period: "Q1 2025",
    dueOn: "2025-04-25",
    submittedOn: null,
    status: "Due Soon",
    amountDue: 2140.34,
    confirmation: null,
  },
  {
    id: "tax-9100",
    title: "Payroll Withholding",
    jurisdiction: "IRS",
    form: "941",
    period: "Mar 2025",
    dueOn: "2025-04-15",
    submittedOn: null,
    status: "Due Soon",
    amountDue: 2680,
    confirmation: null,
  },
  {
    id: "tax-9099",
    title: "Sales Tax",
    jurisdiction: "Seattle",
    form: "Sales",
    period: "Mar 2025",
    dueOn: "2025-04-20",
    submittedOn: "2025-04-05",
    status: "Filed",
    amountDue: 1864.22,
    confirmation: "CONF-SEA-4217",
  },
  {
    id: "tax-9098",
    title: "941 Federal",
    jurisdiction: "IRS",
    form: "941",
    period: "Q4 2024",
    dueOn: "2025-01-31",
    submittedOn: "2025-01-24",
    status: "Filed",
    amountDue: 7980.12,
    confirmation: "CONF-IRS-9401",
  },
];

const FINANCE_VENDORS: FinanceVendor[] = [
  {
    id: "vendor-5101",
    name: "Pawsitive Supply Co.",
    category: "Grooming Supplies",
    status: "Active",
    spendYtd: 6840.5,
    openBalance: 540,
    paymentTerms: "Net 15",
    lastInvoiceOn: "2025-04-10",
    contacts: [
      { name: "Val Harper", email: "val@pawsitivesupply.com", phone: "555-210-3377" },
    ],
    notes: "Auto-ship shampoo + bows",
  },
  {
    id: "vendor-5102",
    name: "Sparkle Linens",
    category: "Laundry",
    status: "Active",
    spendYtd: 1890.2,
    openBalance: 0,
    paymentTerms: "Net 7",
    lastInvoiceOn: "2025-03-20",
    contacts: [
      { name: "Maya Lopez", email: "maya@sparklelinens.com", phone: "555-882-4401" },
    ],
    notes: "Pickup every Tuesday",
  },
  {
    id: "vendor-5103",
    name: "Tailwind Accounting",
    category: "Professional Services",
    status: "Active",
    spendYtd: 2250,
    openBalance: 750,
    paymentTerms: "Net 30",
    lastInvoiceOn: "2025-04-14",
    contacts: [
      { name: "Devin Patel", email: "devin@tailwindfinance.com", phone: "555-664-1182" },
    ],
    notes: "Handles quarterly closes",
  },
  {
    id: "vendor-5104",
    name: "City Energy",
    category: "Utilities",
    status: "Active",
    spendYtd: 1895.44,
    openBalance: 0,
    paymentTerms: "Autopay",
    lastInvoiceOn: "2025-04-04",
    contacts: [
      { name: "Support", email: "care@cityenergy.com", phone: null },
    ],
    notes: "Gas + electric consolidated bill",
  },
  {
    id: "vendor-5105",
    name: "Fetch Social",
    category: "Marketing",
    status: "Pending",
    spendYtd: 1450,
    openBalance: 450,
    paymentTerms: "Net 15",
    lastInvoiceOn: "2025-04-13",
    contacts: [
      { name: "Cameron Lee", email: "cameron@fetchsocial.io", phone: "555-441-2255" },
    ],
    notes: "Awaiting campaign analytics",
  },
  {
    id: "vendor-5106",
    name: "GroomGuard Insurance",
    category: "Insurance",
    status: "Active",
    spendYtd: 1971,
    openBalance: 0,
    paymentTerms: "Quarterly",
    lastInvoiceOn: "2025-03-12",
    contacts: [
      { name: "Dana Reilly", email: "dana@groomguard.com", phone: "555-300-7844" },
    ],
    notes: "Policy renews July 1",
  },
];

const FINANCE_PURCHASE_ORDERS: FinancePurchaseOrder[] = [
  {
    id: "po-8807",
    vendor: "Pawsitive Supply Co.",
    status: "Awaiting Receipt",
    issuedOn: "2025-04-09",
    expectedOn: "2025-04-16",
    items: ["Hypoallergenic shampoo", "Bandana assortment", "Grooming shears"],
    subtotal: 1240.5,
    tax: 111.65,
    shipping: 48,
    total: 1400.15,
    balanceDue: 1400.15,
    memo: "Spring spa refresh",
  },
  {
    id: "po-8806",
    vendor: "Sparkle Linens",
    status: "Received",
    issuedOn: "2025-03-22",
    expectedOn: "2025-03-28",
    items: ["Deluxe towel bundle", "Eco dryer sheets"],
    subtotal: 640,
    tax: 57.6,
    shipping: 0,
    total: 697.6,
    balanceDue: 0,
    memo: "Restock deluxe towels",
  },
  {
    id: "po-8805",
    vendor: "Tailwind Accounting",
    status: "Approved",
    issuedOn: "2025-04-12",
    expectedOn: "2025-04-30",
    items: ["Quarterly close", "Annual prep"],
    subtotal: 2250,
    tax: 0,
    shipping: 0,
    total: 2250,
    balanceDue: 2250,
    memo: "Q2 finance retainer",
  },
  {
    id: "po-8804",
    vendor: "GroomGuard Insurance",
    status: "Draft",
    issuedOn: "2025-04-05",
    expectedOn: "2025-04-19",
    items: ["Fleet rider update"],
    subtotal: 890,
    tax: 0,
    shipping: 0,
    total: 890,
    balanceDue: 890,
    memo: "Awaiting underwriting confirmation",
  },
];

const DATA_REFERENCE_DATE: Date = (() => {
  const candidates: Array<Date | null> = [
    ...FINANCE_INVOICES.map(invoice => parseDate(invoice.dueOn)),
    ...FINANCE_EXPENSES.map(expense => parseDate(expense.dueOn ?? expense.incurredOn)),
    ...FINANCE_PAYOUTS.map(payout => parseDate(payout.payoutDate)),
    ...FINANCE_PAYMENTS.map(payment => parseDate(payment.settledOn ?? payment.initiatedOn)),
    ...FINANCE_PAYROLL_RUNS.map(run => parseDate(run.payDate ?? run.processedOn)),
    ...FINANCE_TAX_FILINGS.map(filing => parseDate(filing.dueOn ?? filing.submittedOn)),
    ...FINANCE_PURCHASE_ORDERS.map(order => parseDate(order.expectedOn ?? order.issuedOn)),
  ];

  const timestamps = candidates
    .filter((value): value is Date => value instanceof Date)
    .map(date => date.getTime());

  if (!timestamps.length) {
    return new Date();
  }

  const max = Math.max(...timestamps);
  const reference = new Date(max);
  // Normalize to start of day for consistent comparisons.
  return startOfDay(reference);
})();

export async function getFinanceInvoices(): Promise<FinanceInvoice[]> {
  return FINANCE_INVOICES.map(cloneInvoice);
}

export async function getFinanceExpenses(): Promise<FinanceExpense[]> {
  return FINANCE_EXPENSES.map(expense => ({ ...expense }));
}

export async function getFinancePayouts(): Promise<FinancePayout[]> {
  return FINANCE_PAYOUTS.map(payout => ({ ...payout }));
}

export async function getFinancePayments(): Promise<FinancePayment[]> {
  return FINANCE_PAYMENTS.map(payment => ({ ...payment }));
}

export async function getFinancePayrollRuns(): Promise<FinancePayrollRun[]> {
  return FINANCE_PAYROLL_RUNS.map(run => ({ ...run }));
}

export async function getFinanceTaxFilings(): Promise<FinanceTaxFiling[]> {
  return FINANCE_TAX_FILINGS.map(filing => ({ ...filing, confirmation: filing.confirmation ?? null }));
}

export async function getFinanceVendors(): Promise<FinanceVendor[]> {
  return FINANCE_VENDORS.map(vendor => ({
    ...vendor,
    contacts: vendor.contacts.map(contact => ({ ...contact })),
  }));
}

export async function getFinancePurchaseOrders(): Promise<FinancePurchaseOrder[]> {
  return FINANCE_PURCHASE_ORDERS.map(order => ({ ...order, items: [...order.items] }));
}

export function summarizeInvoices(invoices: FinanceInvoice[]): FinanceInvoiceSummary {
  if (invoices.length === 0) {
    return {
      total: 0,
      collected: 0,
      outstanding: 0,
      overdue: 0,
      invoiceCount: 0,
      paidCount: 0,
      openCount: 0,
      averageInvoice: 0,
    };
  }

  const total = sumNumbers(invoices.map(invoice => invoice.total));
  const collected = sumNumbers(invoices.map(collectedShare));
  const outstanding = sumNumbers(invoices.map(remainingInvoiceBalance));

  const overdue = invoices.filter(invoice => {
    const balance = remainingInvoiceBalance(invoice);
    if (!balance) {
      return false;
    }
    const dueDate = parseDate(invoice.dueOn);
    if (!dueDate) {
      return false;
    }
    return dueDate.getTime() < DATA_REFERENCE_DATE.getTime();
  }).length;

  const invoiceCount = invoices.length;
  const paidCount = invoices.filter(invoice => isPaid(invoice.status)).length;
  const openCount = invoices.filter(invoice => isOpen(invoice.status)).length;
  const averageInvoice = invoiceCount ? total / invoiceCount : 0;

  return {
    total,
    collected,
    outstanding,
    overdue,
    invoiceCount,
    paidCount,
    openCount,
    averageInvoice,
  };
}

export function summarizeExpenses(expenses: FinanceExpense[]): FinanceExpenseSummary {
  if (expenses.length === 0) {
    return {
      total: 0,
      count: 0,
      upcomingCount: 0,
      monthToDate: 0,
    };
  }

  const total = sumNumbers(expenses.map(expense => expense.amount));
  const count = expenses.length;

  const referenceMonth = DATA_REFERENCE_DATE.getUTCMonth();
  const referenceYear = DATA_REFERENCE_DATE.getUTCFullYear();

  let monthToDate = 0;
  let upcomingCount = 0;

  for (const expense of expenses) {
    const incurred = parseDate(expense.incurredOn);
    if (incurred && incurred.getUTCFullYear() === referenceYear && incurred.getUTCMonth() === referenceMonth) {
      const amount = expense.amount ?? 0;
      if (incurred.getTime() <= DATA_REFERENCE_DATE.getTime()) {
        monthToDate += amount;
      }
    }

    const due = parseDate(expense.dueOn ?? expense.incurredOn);
    if (!due) {
      continue;
    }

    if (due.getTime() >= DATA_REFERENCE_DATE.getTime() && !isExpenseSettled(expense.status)) {
      upcomingCount += 1;
    }
  }

  return {
    total,
    count,
    upcomingCount,
    monthToDate,
  };
}

export function summarizePayouts(payouts: FinancePayout[]): FinancePayoutSummary {
  if (payouts.length === 0) {
    return {
      count: 0,
      gross: 0,
      fees: 0,
      net: 0,
      nextPayout: null,
    };
  }

  const gross = sumNumbers(payouts.map(payout => payout.gross));
  const fees = sumNumbers(payouts.map(payout => payout.fees));
  const net = sumNumbers(payouts.map(payout => payout.net ?? netFrom(payout)));

  const upcoming = payouts
    .filter(payout => isPayoutUpcoming(payout))
    .sort((a, b) => {
      const aDate = parseDate(a.payoutDate);
      const bDate = parseDate(b.payoutDate);
      if (!aDate && !bDate) {
        return 0;
      }
      if (!aDate) {
        return 1;
      }
      if (!bDate) {
        return -1;
      }
      return aDate.getTime() - bDate.getTime();
    });

  return {
    count: payouts.length,
    gross,
    fees,
    net,
    nextPayout: upcoming[0] ? { ...upcoming[0] } : null,
  };
}

export function summarizePayments(payments: FinancePayment[]): FinancePaymentSummary {
  if (payments.length === 0) {
    return {
      totalVolume: 0,
      settledVolume: 0,
      pendingVolume: 0,
      averageTicket: 0,
      failedCount: 0,
    };
  }

  const totalVolume = sumNumbers(payments.map(payment => payment.amount));
  const settled = payments.filter(payment => isPaymentSettled(payment.status));
  const pending = payments.filter(payment => isPaymentPending(payment.status));
  const failedCount = payments.filter(payment => isPaymentFailed(payment.status)).length;

  const settledVolume = sumNumbers(settled.map(payment => paymentNet(payment)));
  const pendingVolume = sumNumbers(pending.map(payment => payment.amount));
  const averageTicket = settled.length ? settledVolume / settled.length : 0;

  return {
    totalVolume,
    settledVolume,
    pendingVolume,
    averageTicket,
    failedCount,
  };
}

export function summarizePayroll(runs: FinancePayrollRun[]): FinancePayrollSummary {
  if (runs.length === 0) {
    return {
      totalGross: 0,
      totalNet: 0,
      employeeCount: 0,
      upcomingRun: null,
    };
  }

  const totalGross = sumNumbers(runs.map(run => run.gross));
  const totalNet = sumNumbers(runs.map(run => run.net));
  const employeeCount = runs.reduce((max, run) => Math.max(max, run.teamMembers), 0);

  const upcomingRun = selectUpcomingPayrollRun(runs);

  return {
    totalGross,
    totalNet,
    employeeCount,
    upcomingRun,
  };
}

export function summarizeTaxFilings(filings: FinanceTaxFiling[]): FinanceTaxSummary {
  if (filings.length === 0) {
    return {
      totalDue: 0,
      dueSoonCount: 0,
      pastDueCount: 0,
      filedCount: 0,
    };
  }

  const totalDue = sumNumbers(
    filings
      .filter(filing => !isTaxFiled(filing.status))
      .map(filing => filing.amountDue),
  );

  const dueSoonCount = selectDueSoonFilings(filings, 14).length;
  const pastDueCount = filings.filter(filing => isTaxPastDue(filing)).length;
  const filedCount = filings.filter(filing => isTaxFiled(filing.status)).length;

  return {
    totalDue,
    dueSoonCount,
    pastDueCount,
    filedCount,
  };
}

export function summarizeVendors(vendors: FinanceVendor[]): FinanceVendorSummary {
  if (vendors.length === 0) {
    return {
      activeVendors: 0,
      onHoldVendors: 0,
      totalSpendYtd: 0,
      openBalance: 0,
    };
  }

  const activeVendors = vendors.filter(vendor => isVendorActive(vendor.status)).length;
  const onHoldVendors = vendors.filter(vendor => isVendorOnHold(vendor.status)).length;
  const totalSpendYtd = sumNumbers(vendors.map(vendor => vendor.spendYtd));
  const openBalance = sumNumbers(vendors.map(vendor => vendor.openBalance));

  return {
    activeVendors,
    onHoldVendors,
    totalSpendYtd,
    openBalance,
  };
}

export function summarizePurchaseOrders(
  orders: FinancePurchaseOrder[],
): FinancePurchaseOrderSummary {
  if (orders.length === 0) {
    return {
      openOrders: 0,
      awaitingReceipt: 0,
      receivedOrders: 0,
      totalCommitted: 0,
    };
  }

  const awaitingReceipt = orders.filter(order => orderStatusMatches(order.status, ["awaiting", "in transit"])).length;
  const receivedOrders = orders.filter(order => orderStatusMatches(order.status, ["received", "closed"])).length;
  const openOrders = orders.filter(order => !orderStatusMatches(order.status, ["received", "closed"])).length;
  const totalCommitted = sumNumbers(orders.map(order => order.total));

  return {
    openOrders,
    awaitingReceipt,
    receivedOrders,
    totalCommitted,
  };
}

export function selectUpcomingPayrollRun(
  runs: FinancePayrollRun[],
): FinancePayrollRun | null {
  const upcoming = runs
    .filter(run => isPayrollUpcoming(run))
    .sort((a, b) => compareDates(a.payDate ?? a.processedOn, b.payDate ?? b.processedOn));

  return upcoming[0] ? { ...upcoming[0] } : null;
}

export function selectDueSoonFilings(
  filings: FinanceTaxFiling[],
  days: number,
): FinanceTaxFiling[] {
  const windowMs = days * 24 * 60 * 60 * 1000;
  return filings
    .filter(filing => {
      if (!filing.dueOn || isTaxFiled(filing.status)) {
        return false;
      }
      const dueDate = parseDate(filing.dueOn);
      if (!dueDate) {
        return false;
      }
      const delta = dueDate.getTime() - DATA_REFERENCE_DATE.getTime();
      return delta >= 0 && delta <= windowMs;
    })
    .map(filing => ({ ...filing }));
}

export function selectOpenPurchaseOrders(
  orders: FinancePurchaseOrder[],
): FinancePurchaseOrder[] {
  return orders
    .filter(order => !orderStatusMatches(order.status, ["received", "closed"]))
    .map(order => ({ ...order, items: [...order.items] }));
}

export function groupExpensesByCategory(
  expenses: FinanceExpense[],
): ExpenseCategorySummary[] {
  if (expenses.length === 0) {
    return [];
  }

  const bucket = new Map<string, { total: number; count: number }>();

  for (const expense of expenses) {
    const category = expense.category ?? "Uncategorized";
    const entry = bucket.get(category) ?? { total: 0, count: 0 };
    entry.total += expense.amount ?? 0;
    entry.count += 1;
    bucket.set(category, entry);
  }

  return Array.from(bucket.entries())
    .map(([category, info]) => ({ category, total: info.total, count: info.count }))
    .sort((a, b) => b.total - a.total);
}

export function selectUpcomingReceivables(
  invoices: FinanceInvoice[],
): FinanceInvoice[] {
  return invoices
    .filter(invoice => {
      const balance = remainingInvoiceBalance(invoice);
      if (!balance) {
        return false;
      }
      const dueDate = parseDate(invoice.dueOn);
      if (!dueDate) {
        return false;
      }
      return dueDate.getTime() >= DATA_REFERENCE_DATE.getTime();
    })
    .sort((a, b) => compareDates(a.dueOn, b.dueOn));
}

export function selectOverdueInvoices(
  invoices: FinanceInvoice[],
): FinanceInvoice[] {
  return invoices
    .filter(invoice => {
      const balance = remainingInvoiceBalance(invoice);
      if (!balance) {
        return false;
      }
      const dueDate = parseDate(invoice.dueOn);
      if (!dueDate) {
        return false;
      }
      return dueDate.getTime() < DATA_REFERENCE_DATE.getTime();
    })
    .sort((a, b) => compareDates(a.dueOn, b.dueOn));
}

export function remainingInvoiceBalance(invoice: FinanceInvoice): number | null {
  if (invoice.balanceDue !== null && invoice.balanceDue !== undefined) {
    return Math.max(0, invoice.balanceDue);
  }

  if (invoice.total === null || invoice.total === undefined) {
    return null;
  }

  if (isPaid(invoice.status)) {
    return 0;
  }

  const collected = collectedShare(invoice);
  return Math.max(0, invoice.total - collected);
}

export function buildCashflowTimeline(
  invoices: FinanceInvoice[],
  expenses: FinanceExpense[],
  months: number,
): CashflowPoint[] {
  if (months <= 0) {
    return [];
  }

  const points: CashflowPoint[] = [];

  for (let index = months - 1; index >= 0; index -= 1) {
    const date = new Date(Date.UTC(
      DATA_REFERENCE_DATE.getUTCFullYear(),
      DATA_REFERENCE_DATE.getUTCMonth() - index,
      1,
    ));
    const key = monthKeyFromDate(date);

    const revenue = sumNumbers(
      invoices
        .filter(invoice => monthKey(invoice.issuedOn) === key)
        .map(invoice => invoice.total),
    );

    const expenseTotal = sumNumbers(
      expenses
        .filter(expense => monthKey(expense.incurredOn) === key)
        .map(expense => expense.amount),
    );

    points.push({
      month: key,
      revenue,
      expenses: expenseTotal,
      net: revenue - expenseTotal,
    });
  }

  return points;
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function startOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function monthKey(value: string | null | undefined): string {
  const date = parseDate(value);
  if (!date) {
    return "";
  }
  return monthKeyFromDate(date);
}

function monthKeyFromDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  return `${year}-${String(month).padStart(2, "0")}`;
}

function compareDates(a: string | null | undefined, b: string | null | undefined) {
  const left = parseDate(a)?.getTime() ?? Infinity;
  const right = parseDate(b)?.getTime() ?? Infinity;
  return left - right;
}

function isPaid(status: string | null | undefined): boolean {
  if (!status) {
    return false;
  }
  const normalized = status.toLowerCase();
  return normalized.includes("paid") || normalized.includes("settled");
}

function isOpen(status: string | null | undefined): boolean {
  if (!status) {
    return false;
  }
  const normalized = status.toLowerCase();
  return (
    normalized.includes("open") ||
    normalized.includes("pending") ||
    normalized.includes("partial") ||
    normalized.includes("scheduled") ||
    normalized.includes("draft")
  );
}

function isExpenseSettled(status: string | null | undefined): boolean {
  if (!status) {
    return false;
  }
  const normalized = status.toLowerCase();
  return normalized.includes("paid") || normalized.includes("posted");
}

function isPayoutUpcoming(payout: FinancePayout): boolean {
  const status = payout.status ? payout.status.toLowerCase() : "";
  const date = parseDate(payout.payoutDate);
  if (!date) {
    return false;
  }
  if (date.getTime() < DATA_REFERENCE_DATE.getTime()) {
    return false;
  }
  return (
    status.includes("scheduled") ||
    status.includes("pending") ||
    status.includes("processing") ||
    status.includes("in transit")
  );
}

function collectedShare(invoice: FinanceInvoice): number {
  if (invoice.total === null || invoice.total === undefined) {
    return 0;
  }

  if (invoice.balanceDue !== null && invoice.balanceDue !== undefined) {
    return Math.max(0, invoice.total - invoice.balanceDue);
  }

  if (isPaid(invoice.status)) {
    return invoice.total;
  }

  return 0;
}

function netFrom(payout: FinancePayout): number {
  const gross = payout.gross ?? 0;
  const fees = payout.fees ?? 0;
  return gross - fees;
}

function sumNumbers(values: Array<number | null | undefined>): number {
  let total = 0;
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      total += value;
    }
  }
  return total;
}

function cloneInvoice(invoice: FinanceInvoice): FinanceInvoice {
  return {
    ...invoice,
    services: [...invoice.services],
    tags: [...invoice.tags],
  };
}

function paymentNet(payment: FinancePayment): number {
  const amount = payment.amount ?? 0;
  const fee = payment.fee ?? 0;
  return amount - fee;
}

function isPaymentSettled(status: string | null | undefined): boolean {
  if (!status) {
    return false;
  }
  const normalized = status.toLowerCase();
  return normalized.includes("settled") || normalized.includes("paid") || normalized.includes("completed");
}

function isPaymentPending(status: string | null | undefined): boolean {
  if (!status) {
    return false;
  }
  const normalized = status.toLowerCase();
  return (
    normalized.includes("pending") ||
    normalized.includes("processing") ||
    normalized.includes("awaiting") ||
    normalized.includes("in transit")
  );
}

function isPaymentFailed(status: string | null | undefined): boolean {
  if (!status) {
    return false;
  }
  const normalized = status.toLowerCase();
  return normalized.includes("failed") || normalized.includes("declined") || normalized.includes("error");
}

function isPayrollUpcoming(run: FinancePayrollRun): boolean {
  const payDate = parseDate(run.payDate ?? run.processedOn);
  if (!payDate) {
    return false;
  }
  if (payDate.getTime() < DATA_REFERENCE_DATE.getTime()) {
    return false;
  }
  const normalized = run.status ? run.status.toLowerCase() : "";
  return normalized.includes("scheduled") || normalized.includes("processing") || normalized.includes("pending");
}

function isTaxFiled(status: string | null | undefined): boolean {
  if (!status) {
    return false;
  }
  const normalized = status.toLowerCase();
  return normalized.includes("filed") || normalized.includes("submitted") || normalized.includes("paid");
}

function isTaxPastDue(filing: FinanceTaxFiling): boolean {
  if (!filing.dueOn || isTaxFiled(filing.status)) {
    return false;
  }
  const dueDate = parseDate(filing.dueOn);
  if (!dueDate) {
    return false;
  }
  return dueDate.getTime() < DATA_REFERENCE_DATE.getTime();
}

function isVendorActive(status: string | null | undefined): boolean {
  if (!status) {
    return false;
  }
  const normalized = status.toLowerCase();
  return normalized.includes("active") || normalized.includes("preferred");
}

function isVendorOnHold(status: string | null | undefined): boolean {
  if (!status) {
    return false;
  }
  const normalized = status.toLowerCase();
  return normalized.includes("pending") || normalized.includes("hold") || normalized.includes("suspended");
}

function orderStatusMatches(status: string | null | undefined, tokens: string[]): boolean {
  if (!status) {
    return false;
  }
  const normalized = status.toLowerCase();
  return tokens.some(token => normalized.includes(token));
}
