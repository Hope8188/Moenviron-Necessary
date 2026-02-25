# Deploy Checklist for Netlify

## Pre-deployment

- [ ] All tests passing locally
- [ ] Build completes without errors: `npm run build`
- [ ] No critical ESLint errors
- [ ] TypeScript compiles: `npx tsc --noEmit`

## Netlify Environment Variables

Add these in Netlify Dashboard → Site settings → Environment variables:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_live_...` or `pk_test_...` |

### Optional Variables (for full functionality)

| Variable | Description | Example |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key (server-side) | `sk_live_...` or `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `whsec_...` |
| `VITE_STRIPE_CONNECT_CLIENT_ID` | Stripe Connect client ID | `ca_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side) | `eyJ...` |

## Netlify Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 20 (set in netlify.toml)

## Post-deployment Checks

- [ ] Homepage loads correctly
- [ ] Navigation works (SPA routing)
- [ ] Auth flow works (login/signup)
- [ ] Shop page loads products from Supabase
- [ ] Admin dashboard accessible (admin users only)
- [ ] Payment configurations work in admin
- [ ] SSL certificate active
- [ ] robots.txt accessible: `/robots.txt`
- [ ] sitemap.xml accessible: `/sitemap.xml`

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.netlify.app/api/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy signing secret to Netlify env var `STRIPE_WEBHOOK_SECRET`

## DNS & Domain (if custom domain)

- [ ] Add custom domain in Netlify
- [ ] Update DNS records (CNAME or A record)
- [ ] Wait for SSL provisioning
- [ ] Update `sitemap.xml` with production URL
- [ ] Update `robots.txt` sitemap reference

## Google Search Console Submission

1. Verify domain ownership in Search Console
2. Submit sitemap URL: `https://your-domain.com/sitemap.xml`
3. Request indexing for main pages

## Rollback Plan

If issues occur:
1. Netlify automatically keeps previous deploys
2. Go to Deploys → select previous successful deploy → "Publish deploy"
