import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20",
  });

  try {
    const body = await req.json();
    const { priceId } = body as { priceId?: string };

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing priceId" },
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appBaseUrl}/?checkout=success`,
      cancel_url: `${appBaseUrl}/?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}

