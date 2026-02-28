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
1. **CSP Blocks on Geolocation**: `get.geojs.io`, `ipapi.co`, and `api.ipify.org` are all in CSP connect-src now.
2. **Schema Cache**: After altering Supabase tables, run `NOTIFY pgrst, 'reload schema';` in SQL Editor immediately.
3. **Netlify Build**: Do not add `supabase` CLI to `package.json` devDependencies. Use `npx` instead.
4. **Admin Analytics Empty**: Caused by missing `SELECT` RLS policy on `page_views`. Run `.gemini/fix_supabase_performance.sql`.
5. **Donations failing for specific countries**: Check the currency decimal config in BOTH `src/lib/currency.ts` AND `supabase/functions/create-checkout/index.ts`. They must match and follow Stripe's actual rules.
6. **Stripe iframe blocked**: Caused by `Cross-Origin-Embedder-Policy` header. Solution: don't set COEP at all.
7. **Product page loading forever**: Caused by `trackProductInteraction()` using `.single()` which throws on missing RLS. Fixed by using `.maybeSingle()` and fire-and-forget pattern. Analytics must NEVER block UI rendering.
8. **product_performance_stats table**: Needs public INSERT/UPDATE + public SELECT RLS. The `.gemini/fix_supabase_performance.sql` script handles this.
9. **app_role enum**: The PostgreSQL enum may not have all values (moderator, content, etc.). Always use `role::text` casting in RLS policies to avoid "invalid input value for enum" errors. Or run the enum-adding DO block first.
10. **Newsletter popup timing**: Set to 15 seconds. At 3 seconds, users haven't engaged yet and feel interrupted. 15s = they've scrolled, read, and are more receptive.

## 🛒 Shop & Product Architecture
- **Size selection**: Products support XS, S, M, L, XL, XXL. Size is stored in cart items.
- **Cart format** in localStorage key `moenviron-cart`: `{ id, name, price, currency, quantity, size, image_url, carbon_offset_kg }`
- **Quick-add overlay**: On shop grid, clicking + opens an in-card size selector with "Add to Bag — M" button.
- **Sort options**: Newest, Price Low→High, Price High→Low, Name A-Z.
- **Filter panel**: Expandable with size buttons + sort dropdown.
- **Mobile CTA**: Always-visible ShoppingBag icon on mobile (no hover dependency).

## 🛠️ Essential Commands
- **Deploy Edge Functions**: `npx supabase functions deploy create-checkout --project-ref wmeijbrqjuhvnksiijcz`
- **Deploy Webhook**: `npx supabase functions deploy stripe-webhook --project-ref wmeijbrqjuhvnksiijcz`
- **Set Secrets**: `npx supabase secrets set KEY=VALUE --project-ref wmeijbrqjuhvnksiijcz`
- **Build Frontend**: `npm run build`
- **Push to Deploy**: `git push origin main` (triggers Netlify auto-deploy)
- **Run SQL Fix**: Paste `.gemini/fix_supabase_performance.sql` into Supabase SQL Editor

## 📝 Form Field Best Practices
All `<input>` elements must have:
- `id` attribute (matches the `<label htmlFor>`)
- `name` attribute (enables form submission and autofill)
- `autoComplete` attribute (e.g., `email`, `name`, `current-password`, `new-password`, `tel`, `street-address`)

## 🔍 SEO & AI Crawlability
- **robots.txt**: Allows all AI crawlers (GPTBot, Claude, PerplexityBot, Applebot-Extended, Meta-ExternalAgent, CCBot, Googlebot, Bingbot)
- **sitemap.xml**: Updated monthly. Shop page has priority 0.95.
- **Structured Data**: Organization, WebSite, Product (with offers, shipping, manufacturer), Article, BreadcrumbList schemas.
- **Geo targeting**: meta tags for GB-WIL region, ICBM coordinates.
- **Multi-locale**: OG locale supports en_GB, en_KE, sw_KE.
