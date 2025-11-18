export type PaymentMethod = "stripe-card" | "pix" | "google-pay" | "other";

export type PaymentStatus =
  | "pending"
  | "waiting_confirmation"
  | "paid"
  | "failed"
  | "refunded"
  | "expired";

export type FulfillmentStatus = "pending" | "packing" | "shipped" | "delivered";

export interface SaleAddress {
  fullName: string;
  email: string;
  phone: string;
  document: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country?: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  weight?: number;
  image?: string;
}

export interface SaleShippingOption {
  serviceCode: string;
  label: string;
  provider: string;
  etaDays: number;
  price: number;
  quoteId?: string;
}

export interface SalePayment {
  method: PaymentMethod;
  status: PaymentStatus;
  providerId?: string;
  metadata?: Record<string, unknown>;
  history?: Array<{
    status: PaymentStatus;
    timestamp: Date;
    note?: string;
  }>;
}

export interface SaleRecord {
  _id?: string;
  orderNumber: string;
  userId?: string | null;
  customer: SaleAddress;
  items: SaleItem[];
  totals: {
    subtotal: number;
    shipping: number;
    discount?: number;
    total: number;
  };
  shipping: SaleShippingOption;
  payment: SalePayment;
  fulfillment: {
    status: FulfillmentStatus;
    trackingCode?: string;
    shippedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleDraftInput {
  userId?: string | null;
  address: SaleAddress;
  items: SaleItem[];
  shipping: SaleShippingOption;
  payment: {
    method: PaymentMethod;
  };
}
