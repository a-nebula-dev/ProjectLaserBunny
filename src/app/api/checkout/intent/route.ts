import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { insertSaleDraft } from "@/lib/sales";
import { getProductById } from "@/lib/db-operations";
import type { PaymentMethod, SaleDraftInput, SaleItem } from "@/types/sale";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function toStripeAmount(value: number) {
  return Math.max(0, Math.round(value * 100));
}

function mapPaymentMethod(method: string | undefined): PaymentMethod {
  if (method === "pix") return "pix";
  if (method === "google-pay") return "google-pay";
  if (method === "other") return "other";
  return "stripe-card";
}

function simulateCorreiosPrice(weight: number, speedMultiplier: number) {
  const base = 12;
  const variable = weight * 15;
  return Number(((base + variable) * speedMultiplier).toFixed(2));
}

function buildShippingOptions(cep: string, items: SaleItem[]) {
  const normalizedCep = cep.replace(/\D/g, "");
  if (normalizedCep.length !== 8) return [];

  const totalWeight = items.reduce((acc, item) => {
    const weight = item.weight ?? 0.3;
    return acc + weight * item.quantity;
  }, 0);

  return [
    {
      id: `pac-${normalizedCep}`,
      label: "PAC Econômico",
      provider: "Correios PAC",
      etaDays: 7,
      price: simulateCorreiosPrice(totalWeight, 1),
    },
    {
      id: `sedex-${normalizedCep}`,
      label: "Sedex Rápido",
      provider: "Correios SEDEX",
      etaDays: 3,
      price: simulateCorreiosPrice(totalWeight, 1.45),
    },
    {
      id: `logistica-${normalizedCep}`,
      label: "Logística Express",
      provider: "Parceiro logístico",
      etaDays: 5,
      price: simulateCorreiosPrice(totalWeight, 1.2),
    },
  ];
}

export async function POST(request: NextRequest) {
  try {
    if (!stripeSecret) {
      return NextResponse.json(
        { success: false, error: "STRIPE_SECRET_KEY não configurada" },
        { status: 500 }
      );
    }

    // Use account default API version; TypeScript for stripe v19 targets latest API typings.
    const stripe = new Stripe(stripeSecret);

    const body = await request.json();

    const { items, shipping, address, paymentMethod, userId } = body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Carrinho vazio" },
        { status: 400 }
      );
    }

    if (!address || typeof address.cep !== "string") {
      return NextResponse.json(
        { success: false, error: "Endereço inválido" },
        { status: 400 }
      );
    }

    if (!shipping || typeof shipping !== "object") {
      return NextResponse.json(
        { success: false, error: "Frete inválido" },
        { status: 400 }
      );
    }

    const saleItems: SaleItem[] = await Promise.all(
      items.map(async (item: any) => {
        const rawId = item?.id;
        if (!rawId) {
          throw new Error("Item inválido no carrinho");
        }

        const product = await getProductById(String(rawId));
        if (!product) {
          throw new Error("Produto não encontrado");
        }

        const quantity = Number(item.quantity || 1);
        if (!Number.isFinite(quantity) || quantity <= 0) {
          throw new Error("Quantidade inválida");
        }

        const unitPrice = Number(product.price);
        if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
          throw new Error("Preço do produto inválido");
        }

        return {
          productId: product.id || String(rawId),
          name: product.name,
          quantity,
          unitPrice,
          weight: product.weight ?? item.weight ?? 0.3,
          image: product.image,
        };
      })
    );

    const availableShipping = buildShippingOptions(address.cep, saleItems);
    const requestedCode =
      shipping.serviceCode || shipping.id || shipping.quoteId || "";
    const selectedOption = availableShipping.find(
      (option) => option.id === requestedCode
    );

    if (!selectedOption) {
      return NextResponse.json(
        { success: false, error: "Frete não corresponde ao cálculo atual" },
        { status: 400 }
      );
    }

    const requestedPrice = Number(shipping.price);
    const priceDelta = Math.abs(requestedPrice - selectedOption.price);
    if (!Number.isFinite(requestedPrice) || priceDelta > 0.01) {
      return NextResponse.json(
        { success: false, error: "Valor do frete inválido" },
        { status: 400 }
      );
    }

    const subtotal = saleItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const shippingPrice = selectedOption.price;
    const total = subtotal + shippingPrice;

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json(
        { success: false, error: "Valor total inválido" },
        { status: 400 }
      );
    }

    const mappedMethod = mapPaymentMethod(paymentMethod);

    const saleDraft: SaleDraftInput = {
      userId: userId ?? null,
      address,
      items: saleItems,
      shipping: {
        serviceCode: selectedOption.id,
        label: selectedOption.label,
        provider: selectedOption.provider,
        etaDays: selectedOption.etaDays,
        price: selectedOption.price,
        quoteId: shipping.quoteId,
      },
      payment: {
        method: mappedMethod,
      },
    };

    const sale = await insertSaleDraft(saleDraft);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: toStripeAmount(total),
      currency: "brl",
      metadata: {
        saleId: sale._id || "",
        orderNumber: sale.orderNumber,
        shippingService: shipping?.serviceCode || shipping?.provider || "",
        env: process.env.NODE_ENV || "development",
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      saleId: sale._id,
      paymentIntentId: paymentIntent.id,
      webhookConfigured: Boolean(webhookSecret),
    });
  } catch (error) {
    console.error("[checkout/intent] error", error);
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
