// @ts-nocheck
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutRequest {
  items: CartItem[];
  customerEmail: string;
  customerName?: string;
  customerLocation?: string;
  currency?: string;
  mode?: "payment" | "payment_intent" | "checkout_session";
  isDonation?: boolean;
}

const CURRENCY_CONFIG: Record<string, { code: string; minAmount: number; zeroDecimal: boolean }> = {
  gbp: { code: "gbp", minAmount: 30, zeroDecimal: false },
  eur: { code: "eur", minAmount: 50, zeroDecimal: false },
  usd: { code: "usd", minAmount: 50, zeroDecimal: false },
  kes: { code: "kes", minAmount: 100, zeroDecimal: false },
  ugx: { code: "ugx", minAmount: 1000, zeroDecimal: true },
  tzs: { code: "tzs", minAmount: 1000, zeroDecimal: false },
  rwf: { code: "rwf", minAmount: 100, zeroDecimal: true },
  ngn: { code: "ngn", minAmount: 100, zeroDecimal: false },
  zar: { code: "zar", minAmount: 100, zeroDecimal: false },
  ghs: { code: "ghs", minAmount: 100, zeroDecimal: false },
  etb: { code: "etb", minAmount: 100, zeroDecimal: false },
};

function toStripeAmount(amount: number, currency: string): number {
  const config = CURRENCY_CONFIG[currency];
  return config?.zeroDecimal
    ? Math.round(amount)
    : Math.round(amount * 100);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Stripe not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    let body: CheckoutRequest;

    if (req.method === "GET") {
      const url = new URL(req.url);
      const amount = parseFloat(url.searchParams.get("amount") || "0");
      const email = url.searchParams.get("email") || "";
      const name = url.searchParams.get("name") || "";
      const currency = url.searchParams.get("currency") || "gbp";
      const isDonation = url.searchParams.get("isDonation") !== "false";

      if (!amount || amount <= 0) {
        return new Response("Invalid amount", { status: 400 });
      }

      body = {
        items: [{
          id: "donation",
          name: isDonation ? "Donation to Moenviron" : "Purchase",
          price: amount,
          quantity: 1
        }],
        customerEmail: email,
        customerName: name,
        currency,
        isDonation,
        mode: "checkout_session"
      };
    } else {
      body = await req.json();
    }

    const {
      items,
      customerEmail,
      customerName,
      customerLocation,
      currency: requestedCurrency,
      mode = "checkout_session",
      isDonation = false
    } = body;

    if (!items?.length) {
      return new Response(
        JSON.stringify({ error: "No items provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!customerEmail) {
      return new Response(
        JSON.stringify({ error: "Customer email required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let currency = (requestedCurrency || "gbp").toLowerCase();
    if (!CURRENCY_CONFIG[currency]) currency = "gbp";

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = isDonation ? 0 : (currency === "gbp" ? 5 : 0);
    const total = subtotal + shipping;
    const totalStripeAmount = toStripeAmount(total, currency);

    if (totalStripeAmount < CURRENCY_CONFIG[currency].minAmount) {
      return new Response(
        JSON.stringify({ error: "Amount below minimum" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (mode === "payment_intent") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalStripeAmount,
        currency,
        receipt_email: customerEmail,
        metadata: {
          isDonation: isDonation ? "true" : "false",
        },
      });

      return new Response(
        JSON.stringify({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const origin = req.headers.get("origin") || "https://moenviron.com";

    const session = await stripe.checkout.sessions.create({
      line_items: items.map((item) => ({
        price_data: {
          currency,
          product_data: { name: item.name },
          unit_amount: toStripeAmount(item.price, currency),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      customer_email: customerEmail,
      submit_type: isDonation ? "donate" : "pay",
    });

    if (req.method === "GET") {
      return new Response(null, {
        status: 302,
        headers: { ...corsHeaders, Location: session.url },
      });
    }

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Checkout failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});