# AI Agent Guidelines & Workflow

## Pulse Checks
- Before starting any task, verify the `task_plan.md`.
- Report Estimated Token Usage and Remaining Budget (if applicable).
- Automatically log changes in a `CHANGELOG.md` or similar.

## The "Vibe Coder" Standards
- **Quality over Quantity**: Write robust, reusable code. No half-done work.
- **Outside-the-Box**: If a CLI tool is breaking, find a "Maintenance Function" or SQL bypass approach.
- **Learn on the Job**: Always incorporate new insights from external resources (Jack Roberts, etc.).

## Security & Secrets
- All keys/passwords must be stored in `.env` or verified through `supabase secrets list`.
- Never commit `.env` files.
- Maintain a local `SECURE_NOTES.tmp` (only if needed for immediate session context, then purge).

## Pareto Implementation
- Don't over-engineer trivial UI elements.
- Focus effort on Checkout integrity, Data sync, and Auth security.
- Use 80/20 analysis for every feature request.

## Critical Communication
- Alert the user if a command is "hitting a wall."
- Provide clear suggestions for bypassing technical bottlenecks.
- Keep the user informed of architectural decisions.
