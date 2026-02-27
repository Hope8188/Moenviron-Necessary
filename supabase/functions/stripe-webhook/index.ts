import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      console.error("Missing environment variables.");
      return new Response(JSON.stringify({ error: "Configuration error" }), { status: 500, headers: corsHeaders });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response(JSON.stringify({ error: "No signature" }), { status: 400, headers: corsHeaders });
    }

    const rawBody = await req.text();
    let stripeEvent;

    try {
      stripeEvent = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret || "");
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: corsHeaders });
    }

    console.log(`Received event: ${stripeEvent.type}`);

    // Handle Ping from Stripe Dash
    if (stripeEvent.type === "v2.core.event_destination.ping") {
      return new Response(JSON.stringify({ received: true }), { status: 200, headers: corsHeaders });
    }

    if (stripeEvent.type === "payment_intent.succeeded" || stripeEvent.type === "checkout.session.completed") {
      const sessionOrIntent = stripeEvent.data.object as any;
      const metadata = sessionOrIntent.metadata || {};

      const orderData = {
        user_email: metadata.customer_email || sessionOrIntent.customer_details?.email || sessionOrIntent.receipt_email,
        user_name: metadata.customer_name || sessionOrIntent.customer_details?.name || "",
        total_amount: (sessionOrIntent.amount_total || sessionOrIntent.amount) / 100,
        currency: (sessionOrIntent.currency || "gbp").toUpperCase(),
        payment_method: "stripe",
        payment_intent_id: sessionOrIntent.payment_intent || sessionOrIntent.id,
        items: metadata.items ? JSON.parse(metadata.items) : [],
        status: "confirmed",
        customer_location: metadata.customer_location || "",
      };

      // Idempotency check
      const { data: existing } = await supabase.from("orders").select("id").eq("payment_intent_id", orderData.payment_intent_id).maybeSingle();

      if (!existing) {
        const { error: insertError } = await supabase.from("orders").insert(orderData);
        if (insertError) console.error("Error inserting order:", insertError);
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
  }
});
