# Moenviron Project Knowledge Base

This document serves as a persistent record of the Moenviron project architecture, integrated services, and known pitfalls to ensure consistent development and avoid repeating past errors.

## 🏗️ Core Architecture Overview
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + Lucide Icons.
- **Backend / API**: **Supabase Edge Functions** (migrated from Netlify Functions).
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS) enabled.
- **Deployment**: Netlify (frontend hosting) + Supabase (Edge Functions & Database).
- **Supabase Project Ref**: `wmeijbrqjuhvnksiijcz`
- **Live Domain**: `https://moenviron.com`

## 💳 Stripe Integration
- **Mechanism**: Stripe Checkout Sessions for both shop orders and donations.
- **Edge Functions**: `supabase/functions/create-checkout` and `supabase/functions/stripe-webhook`.
- **Secrets**: In Supabase Secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PUBLIC_SITE_URL`.
- **Webhook Events**: `checkout.session.completed`, `payment_intent.succeeded`.
- **CRITICAL — Currency Decimal Rules** (verified against Stripe docs Feb 2026):
  | Currency | Stripe Classification | `zeroDecimal` | Notes |
  |----------|----------------------|---------------|-------|
  | GBP, USD, EUR | Standard 2-decimal | `false` | amount × 100 |
  | KES | Standard 2-decimal | `false` | amount × 100 |
  | UGX | **Special case** | `false` | Despite being listed as zero-decimal, Stripe requires × 100 for backward compatibility |
  | TZS | Standard 2-decimal | `false` | amount × 100 |
  | RWF | Truly zero-decimal | `true` | send raw amount |
  | NGN, ZAR, GHS, ETB | Standard 2-decimal | `false` | amount × 100 |
- **Lesson**: Always check https://docs.stripe.com/currencies — the "zero-decimal" list has special cases.

## 📊 Analytics & Geolocation
- **Geolocation Provider**: `https://get.geojs.io/v1/ip/geo.json` (previous providers ipwho.is and ipapi.co caused CORS/CSP blocks).
- **Tracking Function**: `trackPageView()` in `src/services/analytics.ts` → inserts into `page_views` table.
- **Admin Dashboard**: `getAnalytics()` in `src/services/analytics.ts` → reads from `page_views` table.
- **Required `page_views` columns**: `page_path`, `referrer`, `visitor_id`, `session_id`, `user_agent`, `country`, `city`, `region`, `latitude`, `longitude`, `device_type`, `ip_hash`, `created_at`.
- **RLS Policies Required**:
  - `INSERT` policy for `public` role (anonymous visitors write page views).
  - `SELECT` policy for `authenticated` role (admins read analytics data).
  - **Previous bug**: Only INSERT policy existed — admin dashboard returned 0 rows.

## ✉️ Transactional Emails
- **Service**: Resend.
- **Logic**: Handled within `stripe-webhook` edge function.

## 🔐 Security Headers (IMPORTANT)
- **COOP**: Must be `same-origin-allow-popups` — Stripe uses popups for 3D Secure verification. Using `same-origin` breaks Stripe.
- **COEP**: Do **NOT** set `Cross-Origin-Embedder-Policy`. Stripe's `m-outer` iframe doesn't set CORP headers, so COEP blocks it.
- **CORP**: Set to `cross-origin` so external resources (Stripe, Unsplash, etc.) can load.
- **SharedArrayBuffer warning**: This is cosmetic (from ONNX/WASM libraries), not a security issue. Do not break Stripe to fix it.
- **CSP**: All three CSP locations must stay in sync:
  1. `index.html` `<meta>` tag
  2. `public/_headers` (Netlify)
  3. `vercel.json` (Vercel)

## 🛑 Known Problems & Troubleshooting
1. **CSP Blocks on Geolocation**: Only `get.geojs.io` is used. Remove references to `ipapi.co` and `ipwho.is` from all CSP directives.
2. **Schema Cache**: After altering Supabase tables, run `NOTIFY pgrst, 'reload schema';` in SQL Editor immediately.
3. **Netlify Build**: Do not add `supabase` CLI to `package.json` devDependencies. Use `npx` instead.
4. **Admin Analytics Empty**: Caused by missing `SELECT` RLS policy on `page_views`. Run `.gemini/fix_analytics_final.sql`.
5. **Donations failing for specific countries**: Check the currency decimal config in BOTH `src/lib/currency.ts` AND `supabase/functions/create-checkout/index.ts`. They must match and follow Stripe's actual rules.
6. **Stripe iframe blocked**: Caused by `Cross-Origin-Embedder-Policy` header. Solution: don't set COEP at all.

## 🛠️ Essential Commands
- **Deploy Edge Functions**: `npx supabase functions deploy create-checkout --project-ref wmeijbrqjuhvnksiijcz`
- **Deploy Webhook**: `npx supabase functions deploy stripe-webhook --project-ref wmeijbrqjuhvnksiijcz`
- **Set Secrets**: `npx supabase secrets set KEY=VALUE --project-ref wmeijbrqjuhvnksiijcz`
- **Build Frontend**: `npm run build`
- **Push to Deploy**: `git push origin main` (triggers Netlify auto-deploy)

## 📝 Form Field Best Practices
All `<input>` elements must have:
- `id` attribute (matches the `<label htmlFor>`)
- `name` attribute (enables form submission and autofill)
- `autoComplete` attribute (e.g., `email`, `name`, `current-password`, `new-password`, `tel`, `street-address`)
