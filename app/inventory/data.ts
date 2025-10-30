import { getSupabaseClient } from "@/app/lib/supabaseClient";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const TABLES = {
  items: process.env.NEXT_PUBLIC_SUPABASE_INVENTORY_ITEMS_TABLE ?? "inventory_items",
  vendors:
    process.env.NEXT_PUBLIC_SUPABASE_INVENTORY_VENDORS_TABLE ?? "inventory_vendors",
  purchaseOrders:
    process.env.NEXT_PUBLIC_SUPABASE_PURCHASE_ORDERS_TABLE ??
    "inventory_purchase_orders",
  adjustments:
    process.env.NEXT_PUBLIC_SUPABASE_INVENTORY_ADJUSTMENTS_TABLE ??
    "inventory_adjustments",
  counts:
    process.env.NEXT_PUBLIC_SUPABASE_INVENTORY_COUNTS_TABLE ??
    "inventory_cycle_counts",
} as const;

export type InventoryItem = {
  id: string;
  sku: string | null;
  name: string;
  category: string | null;
  onHand: number;
  reserved: number;
  reorderPoint: number | null;
  parLevel: number | null;
  unitCost: number | null;
  unitPrice: number | null;
  supplier: string | null;
  lastCountAt: string | null;
  status: string | null;
};

export type InventorySummary = {
  skuCount: number;
  onHandValue: number;
  belowPar: number;
  pendingPurchaseOrders: number;
  pendingPurchaseValue: number;
  adjustmentsThisMonth: number;
};

export type InventoryCategorySummary = {
  category: string;
  onHand: number;
  value: number;
  belowPar: number;
};

export type PurchaseOrderLine = {
  sku: string;
  name: string;
  quantity: number;
  unitCost: number;
};

export type PurchaseOrder = {
  id: string;
  reference: string;
  vendor: string;
  status: string;
  submittedAt: string | null;
  expectedAt: string | null;
  receivedAt: string | null;
  lineItems: PurchaseOrderLine[];
  totalCost: number;
};

export type InventoryVendor = {
  id: string;
  name: string;
  contact: string | null;
  email: string | null;
  phone: string | null;
  leadTimeDays: number | null;
  minOrder: number | null;
  rating: number | null;
  categories: string[];
  lastOrderAt: string | null;
  paymentTerms: string | null;
};

export type StockAdjustment = {
  id: string;
  itemName: string;
  sku: string | null;
  type: string;
  quantity: number;
  reason: string | null;
  performedBy: string | null;
  performedAt: string | null;
  notes: string | null;
};

export type CycleCount = {
  id: string;
  area: string;
  scheduledFor: string | null;
  completedAt: string | null;
  varianceCount: number;
  varianceValue: number;
  lead: string | null;
  notes: string | null;
};

const FALLBACK_ITEMS: InventoryItem[] = [
  {
    id: "itm-hydrate-shampoo",
    sku: "SH-001",
    name: "Hydrating Shampoo 1L",
    category: "Bathing",
    onHand: 28,
    reserved: 6,
    reorderPoint: 18,
    parLevel: 42,
    unitCost: 14,
    unitPrice: 32,
    supplier: "Blue Lagoon Labs",
    lastCountAt: "2024-06-02T18:30:00Z",
    status: "active",
  },
  {
    id: "itm-soothe-conditioner",
    sku: "CN-104",
    name: "Soothing Conditioner 500ml",
    category: "Bathing",
    onHand: 16,
    reserved: 4,
    reorderPoint: 12,
    parLevel: 30,
    unitCost: 11,
    unitPrice: 28,
    supplier: "Blue Lagoon Labs",
    lastCountAt: "2024-06-04T17:10:00Z",
    status: "active",
  },
  {
    id: "itm-detangle-spray",
    sku: "ST-207",
    name: "Detangling Spray",
    category: "Finishing",
    onHand: 9,
    reserved: 3,
    reorderPoint: 15,
    parLevel: 36,
    unitCost: 7,
    unitPrice: 18,
    supplier: "Aero Groom",
    lastCountAt: "2024-06-03T19:45:00Z",
    status: "needs reorder",
  },
  {
    id: "itm-clipper-blade-5f",
    sku: "BL-5F",
    name: "Clipper Blade 5F",
    category: "Equipment",
    onHand: 12,
    reserved: 2,
    reorderPoint: 8,
    parLevel: 18,
    unitCost: 23,
    unitPrice: 54,
    supplier: "Precision Edge",
    lastCountAt: "2024-06-01T15:00:00Z",
    status: "active",
  },
  {
    id: "itm-nail-dremel-bits",
    sku: "NB-050",
    name: "Nail Dremel Bit Kit",
    category: "Equipment",
    onHand: 5,
    reserved: 1,
    reorderPoint: 10,
    parLevel: 20,
    unitCost: 9,
    unitPrice: 22,
    supplier: "Precision Edge",
    lastCountAt: "2024-05-30T21:15:00Z",
    status: "low",
  },
  {
    id: "itm-calming-treats",
    sku: "RT-301",
    name: "Calming Chew Treats",
    category: "Retail",
    onHand: 42,
    reserved: 12,
    reorderPoint: 20,
    parLevel: 60,
    unitCost: 4.5,
    unitPrice: 12,
    supplier: "Happy Paw Pantry",
    lastCountAt: "2024-06-05T16:25:00Z",
    status: "active",
  },
  {
    id: "itm-shed-brush-pro",
    sku: "GR-420",
    name: "Pro De-Shedding Brush",
    category: "Retail",
    onHand: 22,
    reserved: 5,
    reorderPoint: 12,
    parLevel: 28,
    unitCost: 15,
    unitPrice: 38,
    supplier: "Aero Groom",
    lastCountAt: "2024-06-02T11:40:00Z",
    status: "active",
  },
  {
    id: "itm-hypo-shampoo",
    sku: "SH-220",
    name: "Hypoallergenic Shampoo 1L",
    category: "Bathing",
    onHand: 11,
    reserved: 5,
    reorderPoint: 14,
    parLevel: 36,
    unitCost: 16,
    unitPrice: 34,
    supplier: "Blue Lagoon Labs",
    lastCountAt: "2024-06-04T09:30:00Z",
    status: "needs reorder",
  },
];

const FALLBACK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "po-2406-014",
    reference: "PO-2406-014",
    vendor: "Blue Lagoon Labs",
    status: "In transit",
    submittedAt: "2024-05-27T18:12:00Z",
    expectedAt: "2024-06-06T20:00:00Z",
    receivedAt: null,
    lineItems: [
      { sku: "SH-001", name: "Hydrating Shampoo 1L", quantity: 24, unitCost: 13.5 },
      { sku: "SH-220", name: "Hypoallergenic Shampoo 1L", quantity: 18, unitCost: 15.5 },
      { sku: "CN-104", name: "Soothing Conditioner 500ml", quantity: 30, unitCost: 10.75 },
    ],
    totalCost: 1335,
  },
  {
    id: "po-2405-009",
    reference: "PO-2405-009",
    vendor: "Precision Edge",
    status: "Partially received",
    submittedAt: "2024-05-18T15:30:00Z",
    expectedAt: "2024-05-30T17:00:00Z",
    receivedAt: "2024-05-29T21:45:00Z",
    lineItems: [
      { sku: "BL-5F", name: "Clipper Blade 5F", quantity: 10, unitCost: 22.5 },
      { sku: "NB-050", name: "Nail Dremel Bit Kit", quantity: 20, unitCost: 8.4 },
    ],
    totalCost: 470,
  },
  {
    id: "po-2405-007",
    reference: "PO-2405-007",
    vendor: "Happy Paw Pantry",
    status: "Received",
    submittedAt: "2024-05-10T19:05:00Z",
    expectedAt: "2024-05-20T19:00:00Z",
    receivedAt: "2024-05-20T20:45:00Z",
    lineItems: [
      { sku: "RT-301", name: "Calming Chew Treats", quantity: 48, unitCost: 4.2 },
      { sku: "RT-420", name: "Organic Dental Chews", quantity: 32, unitCost: 5.1 },
    ],
    totalCost: 420,
  },
];

const FALLBACK_VENDORS: InventoryVendor[] = [
  {
    id: "vendor-blue-lagoon",
    name: "Blue Lagoon Labs",
    contact: "Nora Chavez",
    email: "nora@bluelagoonlabs.com",
    phone: "+1 (555) 433-1208",
    leadTimeDays: 9,
    minOrder: 350,
    rating: 4.8,
    categories: ["Bathing", "Skin treatments"],
    lastOrderAt: "2024-05-27T18:12:00Z",
    paymentTerms: "Net 30",
  },
  {
    id: "vendor-precision-edge",
    name: "Precision Edge",
    contact: "Marcus Liao",
    email: "orders@precisionedge.pro",
    phone: "+1 (555) 302-8144",
    leadTimeDays: 12,
    minOrder: 250,
    rating: 4.4,
    categories: ["Equipment", "Blades"],
    lastOrderAt: "2024-05-18T15:30:00Z",
    paymentTerms: "Net 15",
  },
  {
    id: "vendor-happy-paw",
    name: "Happy Paw Pantry",
    contact: "Selena Ortiz",
    email: "selena@happypawpantry.com",
    phone: "+1 (555) 667-9021",
    leadTimeDays: 7,
    minOrder: 200,
    rating: 4.9,
    categories: ["Retail", "Consumables"],
    lastOrderAt: "2024-05-10T19:05:00Z",
    paymentTerms: "Prepaid",
  },
];

const FALLBACK_ADJUSTMENTS: StockAdjustment[] = [
  {
    id: "adj-2406-004",
    itemName: "Detangling Spray",
    sku: "ST-207",
    type: "Shrink",
    quantity: -2,
    reason: "Damaged bottle during service",
    performedBy: "Alex Morgan",
    performedAt: "2024-06-03T20:05:00Z",
    notes: "One bottle leaked in bathing room",
  },
  {
    id: "adj-2406-002",
    itemName: "Pro De-Shedding Brush",
    sku: "GR-420",
    type: "Cycle count",
    quantity: 3,
    reason: "Cycle count variance",
    performedBy: "Morgan Lee",
    performedAt: "2024-06-02T16:18:00Z",
    notes: "Found extras in retail end-cap",
  },
  {
    id: "adj-2405-015",
    itemName: "Hydrating Shampoo 1L",
    sku: "SH-001",
    type: "Consumption",
    quantity: -6,
    reason: "Used for spa packages",
    performedBy: "Jamie Rivera",
    performedAt: "2024-05-29T22:40:00Z",
    notes: "Auto deducted from daily usage log",
  },
];

const FALLBACK_COUNTS: CycleCount[] = [
  {
    id: "count-2406-bathing",
    area: "Bathing bay",
    scheduledFor: "2024-06-08T18:00:00Z",
    completedAt: null,
    varianceCount: 0,
    varianceValue: 0,
    lead: "Alex Morgan",
    notes: "Focus on shampoos and conditioners",
  },
  {
    id: "count-2405-retail",
    area: "Retail wall",
    scheduledFor: "2024-05-24T17:30:00Z",
    completedAt: "2024-05-24T18:45:00Z",
    varianceCount: 4,
    varianceValue: -86,
    lead: "Jordan Dean",
    notes: "Found missing chew samples",
  },
  {
    id: "count-2405-equipment",
    area: "Equipment lockers",
    scheduledFor: "2024-05-12T16:00:00Z",
    completedAt: "2024-05-12T17:10:00Z",
    varianceCount: 1,
    varianceValue: 45,
    lead: "Selena Ortiz",
    notes: "Replacement blades logged",
  },
];

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const client = getSupabaseClient();
  if (!client) {
    return FALLBACK_ITEMS;
  }

  const { data, error } = await client.from(TABLES.items).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load inventory items", error);
    return FALLBACK_ITEMS;
  }

  const items = data
    .map(row => mapInventoryItem(row as Record<string, Json>))
    .filter(item => item.name.trim().length > 0);

  if (!items.length) {
    return FALLBACK_ITEMS;
  }

  return items.sort((a, b) => (a.sku ?? "").localeCompare(b.sku ?? ""));
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const client = getSupabaseClient();
  if (!client) {
    return FALLBACK_PURCHASE_ORDERS;
  }

  const { data, error } = await client.from(TABLES.purchaseOrders).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load purchase orders", error);
    return FALLBACK_PURCHASE_ORDERS;
  }

  const orders = data
    .map(row => mapPurchaseOrder(row as Record<string, Json>))
    .filter(order => order.reference.trim().length > 0);

  if (!orders.length) {
    return FALLBACK_PURCHASE_ORDERS;
  }

  return orders.sort((a, b) => (b.submittedAt ?? "").localeCompare(a.submittedAt ?? ""));
}

export async function getInventoryVendors(): Promise<InventoryVendor[]> {
  const client = getSupabaseClient();
  if (!client) {
    return FALLBACK_VENDORS;
  }

  const { data, error } = await client.from(TABLES.vendors).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load inventory vendors", error);
    return FALLBACK_VENDORS;
  }

  const vendors = data
    .map(row => mapInventoryVendor(row as Record<string, Json>))
    .filter(vendor => vendor.name.trim().length > 0);

  if (!vendors.length) {
    return FALLBACK_VENDORS;
  }

  return vendors.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getStockAdjustments(): Promise<StockAdjustment[]> {
  const client = getSupabaseClient();
  if (!client) {
    return FALLBACK_ADJUSTMENTS;
  }

  const { data, error } = await client.from(TABLES.adjustments).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load stock adjustments", error);
    return FALLBACK_ADJUSTMENTS;
  }

  const adjustments = data
    .map(row => mapStockAdjustment(row as Record<string, Json>))
    .filter(adjustment => adjustment.itemName.trim().length > 0);

  if (!adjustments.length) {
    return FALLBACK_ADJUSTMENTS;
  }

  return adjustments.sort((a, b) => (b.performedAt ?? "").localeCompare(a.performedAt ?? ""));
}

export async function getCycleCounts(): Promise<CycleCount[]> {
  const client = getSupabaseClient();
  if (!client) {
    return FALLBACK_COUNTS;
  }

  const { data, error } = await client.from(TABLES.counts).select("*");

  if (error || !Array.isArray(data)) {
    console.error("Failed to load cycle counts", error);
    return FALLBACK_COUNTS;
  }

  const counts = data
    .map(row => mapCycleCount(row as Record<string, Json>))
    .filter(count => count.area.trim().length > 0);

  if (!counts.length) {
    return FALLBACK_COUNTS;
  }

  return counts.sort((a, b) => (b.scheduledFor ?? "").localeCompare(a.scheduledFor ?? ""));
}

export function summarizeInventory(
  items: InventoryItem[],
  purchaseOrders: PurchaseOrder[],
  adjustments: StockAdjustment[]
): InventorySummary {
  if (!items.length) {
    return {
      skuCount: 0,
      onHandValue: 0,
      belowPar: 0,
      pendingPurchaseOrders: 0,
      pendingPurchaseValue: 0,
      adjustmentsThisMonth: 0,
    };
  }

  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  let onHandValue = 0;
  let belowPar = 0;

  for (const item of items) {
    const available = Math.max(0, item.onHand - item.reserved);
    const cost = item.unitCost ?? 0;
    onHandValue += available * cost;

    const par = item.parLevel ?? item.reorderPoint ?? null;
    if (par !== null && available < par) {
      belowPar += 1;
    }
  }

  const pending = purchaseOrders.filter(order => {
    const status = order.status.toLowerCase();
    return !status.includes("received") && !status.includes("cancel");
  });

  const pendingValue = pending.reduce((total, order) => total + order.totalCost, 0);

  const adjustmentsThisMonth = adjustments.filter(adjustment => {
    if (!adjustment.performedAt) {
      return false;
    }
    const performed = new Date(adjustment.performedAt);
    return performed >= monthStart;
  }).length;

  return {
    skuCount: items.length,
    onHandValue: Math.round(onHandValue),
    belowPar,
    pendingPurchaseOrders: pending.length,
    pendingPurchaseValue: Math.round(pendingValue),
    adjustmentsThisMonth,
  };
}

export function buildCategorySummary(items: InventoryItem[]): InventoryCategorySummary[] {
  const groups = new Map<string, InventoryCategorySummary>();

  for (const item of items) {
    const key = (item.category ?? "Uncategorized").trim() || "Uncategorized";
    const available = Math.max(0, item.onHand - item.reserved);
    const value = available * (item.unitCost ?? 0);
    const par = item.parLevel ?? item.reorderPoint ?? null;
    const belowPar = par !== null && available < par ? 1 : 0;

    const current = groups.get(key);
    if (current) {
      current.onHand += available;
      current.value += value;
      current.belowPar += belowPar;
    } else {
      groups.set(key, {
        category: key,
        onHand: available,
        value,
        belowPar,
      });
    }
  }

  return Array.from(groups.values()).sort((a, b) => b.value - a.value);
}

function mapInventoryItem(row: Record<string, Json>): InventoryItem {
  const name =
    pickString(row, ["name", "item_name", "title", "description"]) ?? "Unknown item";

  return {
    id: pickString(row, ["id", "item_id", "uuid"]) || cryptoId(name),
    sku: pickString(row, ["sku", "item_sku", "product_code"]),
    name,
    category: pickString(row, ["category", "category_name", "segment"]),
    onHand: pickNumber(row, ["on_hand", "stock_on_hand", "qty_on_hand"]) ?? 0,
    reserved: pickNumber(row, ["reserved", "allocated", "committed"]) ?? 0,
    reorderPoint: pickNumber(row, ["reorder_point", "min_qty", "safety_stock"]),
    parLevel: pickNumber(row, ["par_level", "par", "target_qty"]),
    unitCost: pickNumber(row, ["unit_cost", "cost", "last_cost"]),
    unitPrice: pickNumber(row, ["unit_price", "price", "retail_price"]),
    supplier: pickString(row, ["supplier", "vendor", "preferred_vendor"]),
    lastCountAt: pickDate(row, ["last_count_at", "last_audit", "counted_at"]),
    status: pickString(row, ["status", "state"]),
  };
}

function mapPurchaseOrder(row: Record<string, Json>): PurchaseOrder {
  const reference = pickString(row, ["reference", "po_number", "number"]) ?? "PO";
  const vendor = pickString(row, ["vendor", "vendor_name", "supplier"]) ?? "Unknown";

  const linesRaw = row.line_items ?? row.items ?? [];
  const lineItems = normalizeLineItems(linesRaw);
  const totalCost =
    pickNumber(row, ["total_cost", "total", "grand_total"]) ??
    lineItems.reduce((sum, line) => sum + line.quantity * line.unitCost, 0);

  return {
    id: pickString(row, ["id", "purchase_order_id", "uuid"]) || cryptoId(reference),
    reference,
    vendor,
    status:
      pickString(row, ["status", "state", "fulfillment_status"])?.trim() ??
      "Pending",
    submittedAt: pickDate(row, ["submitted_at", "created_at", "ordered_at"]),
    expectedAt: pickDate(row, ["expected_at", "eta", "expected_date"]),
    receivedAt: pickDate(row, ["received_at", "closed_at", "completed_at"]),
    lineItems,
    totalCost,
  };
}

function mapInventoryVendor(row: Record<string, Json>): InventoryVendor {
  const name = pickString(row, ["name", "vendor_name", "company"]) ?? "Vendor";

  return {
    id: pickString(row, ["id", "vendor_id", "uuid"]) || cryptoId(name),
    name,
    contact: pickString(row, ["contact", "contact_name", "rep"]),
    email: pickString(row, ["email", "contact_email", "rep_email"]),
    phone: pickString(row, ["phone", "contact_phone", "rep_phone"]),
    leadTimeDays: pickNumber(row, ["lead_time_days", "lead_time", "lead_days"]),
    minOrder: pickNumber(row, ["min_order", "minimum_order", "moq"]),
    rating: pickNumber(row, ["rating", "score", "vendor_rating"]),
    categories: pickStringArray(row, ["categories", "lines", "segments"]),
    lastOrderAt: pickDate(row, ["last_order_at", "last_purchase", "recent_order"]),
    paymentTerms: pickString(row, ["payment_terms", "terms", "payment"]),
  };
}

function mapStockAdjustment(row: Record<string, Json>): StockAdjustment {
  const itemName =
    pickString(row, ["item_name", "name", "product_name"]) ?? "Inventory item";

  return {
    id: pickString(row, ["id", "adjustment_id", "uuid"]) || cryptoId(itemName),
    itemName,
    sku: pickString(row, ["sku", "item_sku", "product_code"]),
    type: pickString(row, ["type", "adjustment_type", "reason_code"]) ?? "Adjustment",
    quantity: pickNumber(row, ["quantity", "qty", "change"]) ?? 0,
    reason: pickString(row, ["reason", "note", "explanation"]),
    performedBy: pickString(row, ["performed_by", "user", "entered_by"]),
    performedAt: pickDate(row, ["performed_at", "created_at", "date"]),
    notes: pickString(row, ["notes", "memo", "comment"]),
  };
}

function mapCycleCount(row: Record<string, Json>): CycleCount {
  const area = pickString(row, ["area", "location", "zone"]) ?? "Storage";

  return {
    id: pickString(row, ["id", "cycle_count_id", "uuid"]) || cryptoId(area),
    area,
    scheduledFor: pickDate(row, ["scheduled_for", "scheduled_at", "planned_for"]),
    completedAt: pickDate(row, ["completed_at", "closed_at", "finished_at"]),
    varianceCount:
      pickNumber(row, ["variance_count", "variance_qty", "qty_variance"]) ?? 0,
    varianceValue:
      pickNumber(row, ["variance_value", "variance_amount", "value_variance"]) ?? 0,
    lead: pickString(row, ["lead", "owner", "assigned_to"]),
    notes: pickString(row, ["notes", "memo", "comment"]),
  };
}

function normalizeLineItems(value: Json | undefined): PurchaseOrderLine[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (item && typeof item === "object") {
          const record = item as Record<string, Json>;
          const name =
            pickString(record, ["name", "item_name", "product"]) ?? "Line";
          return {
            sku: pickString(record, ["sku", "item_sku", "product_code"]) ?? name,
            name,
            quantity: pickNumber(record, ["quantity", "qty", "ordered"]) ?? 0,
            unitCost: pickNumber(record, ["unit_cost", "cost", "price"]) ?? 0,
          };
        }
        if (typeof item === "string") {
          return { sku: item, name: item, quantity: 1, unitCost: 0 };
        }
        return null;
      })
      .filter((line): line is PurchaseOrderLine => Boolean(line));
  }

  return [];
}

function pickString(row: Record<string, Json>, keys: string[]): string | null {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return null;
}

function pickNumber(row: Record<string, Json>, keys: string[]): number | null {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }
  return null;
}

function pickDate(row: Record<string, Json>, keys: string[]): string | null {
  for (const key of keys) {
    const value = row[key];
    const normalized = normalizeDate(value);
    if (normalized) {
      return normalized;
    }
  }
  return null;
}

function pickStringArray(row: Record<string, Json>, keys: string[]): string[] {
  for (const key of keys) {
    const value = row[key];
    const normalized = normalizeStringArray(value);
    if (normalized.length > 0) {
      return normalized;
    }
  }
  return [];
}

function normalizeDate(value: Json | undefined): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }
  }

  if (typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return null;
}

function normalizeStringArray(value: Json | undefined): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map(item => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
}

function cryptoId(seed: string): string {
  const base = seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 16);
  return `inv-${base}-${Math.random().toString(36).slice(2, 8)}`;
}
