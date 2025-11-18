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

  await collection.updateOne({ _id: new ObjectId(saleId) }, {
    $set: {
      "payment.status": status,
      ...(metadata ? { "payment.metadata": metadata } : {}),
      updatedAt: now,
    },
    $push: { "payment.history": historyEntry },
  } as any);
}
