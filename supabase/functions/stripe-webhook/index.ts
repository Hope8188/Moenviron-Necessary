import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // SECURITY: Only accept POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      console.error("CRITICAL: Missing environment variables.");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ---------------------------------------------------------------
    // DUAL MODE:
    //  A) Called by Stripe directly as a webhook → verify signature
    //  B) Called by our own frontend after checkout → verify via Stripe API
    // ---------------------------------------------------------------
    const stripeSignature = req.headers.get("stripe-signature");

    if (stripeSignature) {
      // MODE A: Real Stripe webhook — verify signature
      if (!webhookSecret) {
        console.error("STRIPE_WEBHOOK_SECRET not configured");
        return new Response(
          JSON.stringify({ error: "Webhook secret not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const rawBody = await req.text();
      let stripeEvent: Stripe.Event;

      try {
        stripeEvent = await stripe.webhooks.constructEventAsync(
          rawBody,
          stripeSignature,
          webhookSecret
        );
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return new Response(
          JSON.stringify({ error: `Webhook signature invalid: ${err.message}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (stripeEvent.type === "payment_intent.succeeded") {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        await confirmOrder(stripe, supabase, paymentIntent, null);
      }

      return new Response(
        JSON.stringify({ received: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else {
      // MODE B: Frontend post-checkout call — MUST verify payment via Stripe API, never trust client
      const body = await req.json();
      const { paymentIntentId, shippingAddress } = body;

      if (!paymentIntentId || typeof paymentIntentId !== "string" || !paymentIntentId.startsWith("pi_")) {
        return new Response(
          JSON.stringify({ error: "Invalid paymentIntentId" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`[stripe-webhook] Verifying via Stripe API: ${paymentIntentId}`);

      // SECURITY: Retrieve from Stripe API — never trust client-provided status
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== "succeeded") {
        return new Response(
          JSON.stringify({ success: false, status: paymentIntent.status }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const orderId = await confirmOrder(stripe, supabase, paymentIntent, shippingAddress);

      return new Response(
        JSON.stringify({ success: true, orderId }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function confirmOrder(
  _stripe: Stripe,
  supabase: ReturnType<typeof createClient>,
  paymentIntent: Stripe.PaymentIntent,
  shippingAddress: any
): Promise<string | null> {
  // Idempotency: check if order already exists for this payment intent
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("payment_intent_id", paymentIntent.id)
    .maybeSingle();

  if (existing) {
    console.log(`[stripe-webhook] Order already exists for ${paymentIntent.id}`);
    return existing.id;
  }

  const items = (() => {
    try { return JSON.parse(paymentIntent.metadata?.items || "[]"); }
    catch { return []; }
  })();

  const customerEmail = paymentIntent.receipt_email || paymentIntent.metadata?.customer_email || "";
  const customerLocation = paymentIntent.metadata?.customerLocation || "";

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_email: customerEmail,
      user_name: paymentIntent.metadata?.customer_name || "",
      total_amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency?.toUpperCase() || "GBP",
      payment_intent_id: paymentIntent.id,
      payment_method: "stripe",
      status: "confirmed",
      items: items,
      shipping_address: shippingAddress || null,
      customer_location: customerLocation,
    })
    .select()
    .single();

  if (orderError) {
    console.error("Database Error:", orderError);
    return null;
  }

  return order?.id ?? null;
}
