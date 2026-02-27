# Task Plan: Phase - Polish & Consolidation

## Objectives
1. **Clean Project Environment**: Remove legacy functions and maintenance backdoors.
2. **Standardize CLI Usage**: Transition from global `npx` to project-locked dependencies where possible.
3. **Log Changes**: Document the recent major refactor of the checkout process.
4. **Research / Learn**: Summarize key takeaways from the "Jack Roberts" methodology for internal application.

## 1. Cleanup Checklist
- [x] Delete `supabase/functions/maintenance`
- [x] Delete `supabase/functions/paystack-payment`
- [x] Delete `supabase/functions/paystack-webhook`
- [ ] Remove `test-resend` if unused.

## 2. Dependency Locking
- [x] Verify `supabase` is in `devDependencies`.
- [ ] Link local project to Supabase ID `wmeijbrqjuhvnksiijcz` (requires USER to set SUPABASE_ACCESS_TOKEN).

## 3. Shop UI/UX Pro Max (The Unicorn Phase)
- [ ] Implement Aurora background or premium glassmorphism on the Shop hero.
- [ ] Add micro-animations for product card hover (border beams/glow).
- [ ] Refine typography to use premium curated fonts (Outfit/Inter).

## 4. Digital Library Automation & Public Page
- [x] Design an "Auto-Sync" or "Auto-Categorize" logic (Implemented Auto-Fetch in Admin).
- [ ] Create a public-facing `Library.tsx` page to showcase resources.
- [ ] Add a "Quick Capture" tool for admins to turn URLs into library resources.
- [ ] Implement a "Reading Progress" or "View Tracking" for users.

## 5. Security Audit
- [x] Ensure all Stripe keys are correctly mapped to LIVE in the Edge Functions.
- [x] Purge test scripts and temporary bodies.
