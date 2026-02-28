// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Stripe requires amounts in cents/smallest units.
// We sync this with the frontend but edge function is the source of truth for the final call.
const CURRENCY_CONFIG: Record<string, { zeroDecimal: boolean }> = {
    gbp: { zeroDecimal: false },
    usd: { zeroDecimal: false },
    eur: { zeroDecimal: false },
    kes: { zeroDecimal: false }, // KES is 2-decimal in Stripe
    ugx: { zeroDecimal: false }, // UGX: Stripe requires ×100 for backward compatibility
    tzs: { zeroDecimal: false }, // TZS: standard two-decimal currency in Stripe
    rwf: { zeroDecimal: true },
    ngn: { zeroDecimal: false },
    zar: { zeroDecimal: false },
    ghs: { zeroDecimal: false },
    etb: { zeroDecimal: false },
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
        if (!stripeSecretKey) {
            throw new Error("STRIPE_SECRET_KEY is missing in Supabase secrets.");
        }

        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: "2023-10-16",
            httpClient: Stripe.createFetchHttpClient(),
        });

        let body: any;
        if (req.method === "GET") {
            // Support for direct link redirects
            const url = new URL(req.url);
            const amount = parseFloat(url.searchParams.get("amount") || "0");
            const email = url.searchParams.get("email") || "";
            const currencyKey = (url.searchParams.get("currency") || "gbp").toLowerCase();
            const isDonationVal = url.searchParams.get("isDonation") === "true";

            if (!amount || amount <= 0) {
                return new Response("Invalid donation amount.", { status: 400 });
            }

            body = {
                items: [{
                    id: "donation_link",
                    name: isDonationVal ? "Donation to Moenviron" : "Checkout",
                    price: amount,
                    quantity: 1,
                }],
                customerEmail: email,
                currency: currencyKey,
                isDonation: isDonationVal,
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
            isDonation
        } = body;

        const currency = (requestedCurrency || "gbp").toLowerCase();
        const config = CURRENCY_CONFIG[currency] || { zeroDecimal: false };

        const baseUrl = Deno.env.get("PUBLIC_SITE_URL") || "https://moenviron.com";

        const lineItems = items.map((item: any) => ({
            price_data: {
                currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: config.zeroDecimal ? Math.round(item.price) : Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const sessionConfig: any = {
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            customer_email: customerEmail || undefined,
            submit_type: isDonation ? "donate" : "pay",
            success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}${isDonation ? '&type=donation' : ''}`,
            cancel_url: isDonation ? `${baseUrl}/donate` : `${baseUrl}/cart`,
            metadata: {
                customer_name: customerName || "",
                customer_location: customerLocation || "",
                isDonation: isDonation ? "true" : "false",
                currency_used: currency,
            },
        };

        // Collect shipping address ONLY for physical product orders
        if (!isDonation) {
            sessionConfig.shipping_address_collection = {
                allowed_countries: ["GB", "KE", "UG", "TZ", "RW", "US", "NG", "ZA", "GH", "ET"],
            };
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        // For GET requests (fallback), we redirect directly.
        // For POST requests (frontend), we return JSON.
        if (req.method === "GET") {
            return new Response(null, {
                status: 302,
                headers: { ...corsHeaders, "Location": session.url },
            });
        }

        return new Response(
            JSON.stringify({ url: session.url, sessionId: session.id }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );

    } catch (error: any) {
        console.error("Stripe Function Error:", error.message);
        return new Response(
            JSON.stringify({
                error: error.message,
                details: error.type || "unknown_error"
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400
            }
        );
    }
});
