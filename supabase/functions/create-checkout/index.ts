import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
        if (!stripeSecretKey) {
            throw new Error("STRIPE_SECRET_KEY is not set in Supabase");
        }

        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: "2023-10-16",
            httpClient: Stripe.createFetchHttpClient(),
        });

        let body: any;
        if (req.method === "GET") {
            const url = new URL(req.url);
            const amount = parseFloat(url.searchParams.get("amount") || "0");
            const email = url.searchParams.get("email") || "";
            const currency = url.searchParams.get("currency") || "gbp";
            const isDonation = url.searchParams.get("isDonation") === "true";

            if (!amount || amount <= 0) {
                throw new Error("Invalid donation amount provided via URL.");
            }

            body = {
                items: [{
                    id: "donation_link",
                    name: isDonation ? "Donation to Moenviron" : "Checkout",
                    price: amount,
                    quantity: 1,
                }],
                customerEmail: email,
                currency,
                isDonation,
            };
        } else {
            body = await req.json();
        }
        const { items, customerEmail, customerName, customerLocation, locationMetadata, currency: requestedCurrency, isDonation } = body;

        const baseUrl = Deno.env.get("PUBLIC_SITE_URL") || "https://moenviron.com";
        const currency = (requestedCurrency || "gbp").toLowerCase();

        // Most common zero-decimal currencies
        const ZERO_DECIMAL_CURRENCIES = new Set(['ugx', 'rwf', 'bif', 'clp', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'vnd', 'xaf', 'xof', 'xpf']);
        const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency);

        const lineItems = items.map((item: any) => ({
            price_data: {
                currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: isZeroDecimal ? Math.round(item.price) : Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const sessionConfig: any = {
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            customer_email: customerEmail,
            submit_type: isDonation ? "donate" : "pay",
            success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}${isDonation ? '&type=donation' : ''}&amount=${items.reduce((a: any, b: any) => a + b.price * b.quantity, 0)}&currency=${currency}`,
            cancel_url: isDonation ? `${baseUrl}/donate?status=cancelled` : `${baseUrl}/cart`,
            metadata: {
                customer_name: customerName || "",
                customer_location: customerLocation || "",
                location_metadata: locationMetadata ? JSON.stringify(locationMetadata) : "",
                items: JSON.stringify(items.map((i: any) => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price }))),
                isDonation: isDonation ? "true" : "false",
            },
        };

        if (!isDonation) {
            sessionConfig.shipping_address_collection = {
                allowed_countries: ["GB", "KE", "UG", "TZ", "RW", "US", "NG", "ZA", "GH", "ET"],
            };
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        return new Response(
            JSON.stringify({ url: session.url, sessionId: session.id }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
    }
});
