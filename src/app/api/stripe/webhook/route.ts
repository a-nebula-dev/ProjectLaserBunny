import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateSalePaymentStatus } from "@/lib/sales";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecret) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

if (!webhookSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not set in environment variables");
}

const resolvedStripeSecret = stripeSecret;
const resolvedWebhookSecret = webhookSecret;

// Use account default API version; stripe types track the latest version.
const stripe = new Stripe(resolvedStripeSecret);

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch (err) {
    console.error("[stripe/webhook] failed to read body", err);
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, resolvedWebhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const saleId = (pi.metadata as any)?.saleId;
        if (saleId) {
          await updateSalePaymentStatus(saleId, "paid", {
            paymentIntentId: pi.id,
            method: pi.payment_method_types?.join(",") || "stripe",
          });
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const saleId = (pi.metadata as any)?.saleId;
        if (saleId) {
          await updateSalePaymentStatus(saleId, "failed", {
            paymentIntentId: pi.id,
            failureMessage: pi.last_payment_error?.message,
          });
        }
        break;
      }
      case "payment_intent.processing": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const saleId = (pi.metadata as any)?.saleId;
        if (saleId) {
          await updateSalePaymentStatus(saleId, "waiting_confirmation", {
            paymentIntentId: pi.id,
          });
        }
        break;
      }
      default:
        // Ignore other events for now
        break;
    }

    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.error("[stripe/webhook] handler error", err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
