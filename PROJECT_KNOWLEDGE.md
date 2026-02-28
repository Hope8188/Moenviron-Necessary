# Moenviron Project Knowledge Base

This document serves as a persistent record of the Moenviron project architecture, integrated services, and known pitfalls to ensure consistent development and avoid repeating past errors.

## 🏗️ Core Architecture Overview
- **Frontend**: React + Vite + TypeScript.
- **Backend / API**: Fully migrated from Netlify Functions to **Supabase Edge Functions** for better secret management and database proximity.
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS) enabled.
- **Deployment**: Netlify (Frontend) + Supabase (Functions & Database).

## 💳 Stripe Integration
- **Mechanism**: Uses Stripe Checkout Sessions for both one-off shop orders and donations.
- **Secrets**: Managed via Supabase Secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`). 
- **Webhook**: Located at `supabase/functions/stripe-webhook`. It handles `checkout.session.completed` and `payment_intent.succeeded`.
- **Currency Handling**: Supports multiple currencies (GBP, KES, UGX, etc.). 
    - *Crucial*: Stripe requires amounts in the smallest currency unit (cents/pence).
    - *Zero-Decimal Currencies*: UGX and RWF are zero-decimal in Stripe. KES is **not** (it has cents).
- **Payment Link Fallback**: If the dynamic checkout fails, the app falls back to a static Stripe Payment Link.

## 📊 Analytics & Geolocation
- **Geolocation**: Uses `https://get.geojs.io/v1/ip/geo.json` to bypass CORS issues present in previous providers (ipwho.is, ipapi.co).
- **Tracking**: `trackPageView` in `analytics.ts` logs visits to the `page_views` table.
- **Schema Pitfall**: The `page_views` table requires the following columns: `page_path`, `referrer`, `visitor_id`, `session_id`, `user_agent`, `country`, `city`, `region`, `latitude`, `longitude`, `device_type`.

## ✉️ Transactional Emails
- **Service**: Resend.
- **Logic**: Handled within the `stripe-webhook` edge function.
- **Templates**: Dynamic HTML templates for order confirmations and status updates.

## 🛑 Known Problems & Troubleshooting
1. **CSP Blocks**: Content Security Policy in `index.html` and `public/_headers` must whitelist `get.geojs.io` and `*.supabase.co`.
2. **Schema Cache**: After adding columns to Supabase tables, you **MUST** run `NOTIFY pgrst, 'reload schema';` in the SQL Editor to stop "column not found" errors.
3. **Netlify Build Errors**: Avoid including heavy binaries (like `supabase` CLI) in `package.json` devDependencies. Use `npx` for CLI commands instead.
4. **Interactive Login**: Stripe and Supabase require interactive login (2FA/SSO), which browser agents can struggle with. Automated secret retrieval is limited.
5. **Currency Handling (African markets)**: KES is a 2-decimal currency in Stripe, while UGX and RWF are zero-decimal. Our Edge Function (Step 1515) accounts for this mismatch with a manual lookup.
6. **Fallback Redirects**: The Edge Function's `GET` handler **must** return a `302 Found` with a `Location` header to correctly redirect the browser from fallback links (Direct redirection vs returning JSON).

## 🛠️ Essential Commands
- **Deploy Functions**: `npx supabase functions deploy <name> --project-ref wmeijbrqjuhvnksiijcz`
- **Set Secrets**: `npx supabase secrets set KEY=VALUE --project-ref wmeijbrqjuhvnksiijcz`
