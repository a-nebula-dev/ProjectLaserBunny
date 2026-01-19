import { ObjectId } from "mongodb";
import { getCollection } from "./db-operations";
import type { PaymentStatus, SaleDraftInput, SaleRecord } from "@/types/sale";

function generateOrderNumber() {
  const now = new Date();
  return `LB-${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;
}

function calculateSubtotal(items: SaleDraftInput["items"]) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export async function insertSaleDraft(input: SaleDraftInput) {
  const collection = await getCollection("sales");
  const createdAt = new Date();
  const subtotal = calculateSubtotal(input.items);
  const shipping = input.shipping.price;
  const total = subtotal + shipping;

  const sale: SaleRecord = {
    orderNumber: generateOrderNumber(),
    userId: input.userId ?? null,
    customer: input.address,
    items: input.items,
    totals: {
      subtotal,
      shipping,
      total,
    },
    shipping: input.shipping,
    payment: {
      method: input.payment.method,
      status: "pending",
      history: [
        {
          status: "pending",
          timestamp: createdAt,
        },
      ],
    },
    fulfillment: {
      status: "pending",
    },
    createdAt,
    updatedAt: createdAt,
  };

  const docToInsert = { ...sale } as Omit<SaleRecord, "_id">;
  const { insertedId } = await collection.insertOne(docToInsert as any);
  return { ...sale, _id: insertedId.toString() };
}

export async function updateSalePaymentStatus(
  saleId: string,
  status: PaymentStatus,
  metadata?: Record<string, unknown>
) {
  const collection = await getCollection("sales");
  const now = new Date();
  const historyEntry = {
    status,
    timestamp: now,
    note: metadata?.note as string | undefined,
  };

  const query = ObjectId.isValid(saleId)
    ? ({ _id: new ObjectId(saleId) } as any)
    : ({ _id: saleId } as any);

  await collection.updateOne(query, {
    $set: {
      "payment.status": status,
      ...(metadata ? { "payment.metadata": metadata } : {}),
      updatedAt: now,
    },
    $push: { "payment.history": historyEntry },
  } as any);
}

export async function getSaleById(saleId: string) {
  const collection = await getCollection("sales");

  // Accept both ObjectId and string ids
  let query: any = { _id: saleId };
  if (ObjectId.isValid(saleId)) {
    query = { _id: new ObjectId(saleId) } as any;
  }

  const doc = await collection.findOne(query);
  if (!doc) return null;

  const idStr = typeof doc._id === "string" ? doc._id : doc._id?.toString();
  return { ...doc, _id: idStr } as SaleRecord;
}

export async function listSales({
  paymentStatus,
  limit = 20,
  offset = 0,
}: {
  paymentStatus?: PaymentStatus;
  limit?: number;
  offset?: number;
}) {
  const collection = await getCollection("sales");
  const filter: any = {};
  if (paymentStatus) {
    filter["payment.status"] = paymentStatus;
  }

  const cursor = collection
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  const docs = await cursor.toArray();
  const total = await collection.countDocuments(filter);

  const mapped = docs.map((doc: any) => ({
    ...doc,
    _id: typeof doc._id === "string" ? doc._id : doc._id?.toString(),
  })) as SaleRecord[];

  return { data: mapped, total };
}

export async function updateSaleFulfillment(
  saleId: string,
  fulfillment: {
    status?: SaleRecord["fulfillment"]["status"];
    trackingCode?: string;
    shippedAt?: Date;
  }
) {
  const collection = await getCollection("sales");
  const now = new Date();
  const query = ObjectId.isValid(saleId)
    ? ({ _id: new ObjectId(saleId) } as any)
    : ({ _id: saleId } as any);

  const set: any = {
    updatedAt: now,
  };

  if (fulfillment.status) {
    set["fulfillment.status"] = fulfillment.status;
    if (fulfillment.status === "shipped") {
      set["fulfillment.shippedAt"] = fulfillment.shippedAt || now;
    }
  }
  if (fulfillment.trackingCode !== undefined) {
    set["fulfillment.trackingCode"] = fulfillment.trackingCode;
  }

  await collection.updateOne(query, { $set: set });
  const updated = await getSaleById(saleId);
  return updated;
}
