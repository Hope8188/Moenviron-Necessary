# Changelog

## [2026-02-19] - Refine & Architect Phase

### Fixed
- **Checkout Botttleneck**: Refactored `Cart.tsx` to use dynamic Stripe Checkout sessions via Edge Functions, bypassing static link limitations.
- **Database Integrity**: Identified and purged 14+ duplicate product records from the live database.
- **Admin Permissions**: Bypassed CLI friction to promote user to Admin role via SQL/Maintenance protocols.

### Removed
- **Legacy Payments**: Purged M-Pesa, Paystack, PayPal, Google Pay, and Apple Pay integrations from frontend and backend (Stripe-only focus).
- **Asset Bloat**: Deleted 4+ unused payment logo assets.
- **Security Risks**: Removed the temporary `maintenance` Edge Function and test scripts.

### Improved
- **Admin UX**: Reordered 12+ dashboard tabs into a high-efficiency logical flow (Analytics-first).
- **Developer Workflow**: Established `PROJECT_CONSTITUTION.md`, `GUIDELINES.md`, and `task_plan.md` based on BLAST/SWARM frameworks.
- **Dependency Management**: Locked `supabase` CLI to project `devDependencies` for consistency.

### Architected
- Implemented **Pareto Principle** (80/20) for task prioritization.
- Adopted **BLAST** (Blueprint, Link, Architect, Style, Trigger) methodology.
- Integrated **SWARM** protocol for task parallelization.
