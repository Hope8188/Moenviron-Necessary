# Moenviron

## Circular Fashion from UK to Kenya

Moenviron is a sustainable fashion platform focused on textile waste transformation. We collect discarded textiles in the UK, process them in Kenya, and bring them back as premium circular fashion.

## Project Structure

- `src/app/`: Next.js app directory (if applicable)
- `src/components/`: Reusable React components
- `src/hooks/`: Custom React hooks
- `src/lib/`: Utility functions and external service configurations (Supabase, Stripe, etc.)
- `src/pages/`: Page components
- `src/supabase/`: Supabase functions and migrations

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Payments**: Stripe
- **Email**: Resend and Mailer Lite for Email marketing
- **Analytics**: Custom dashboard with Recharts

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Run the development server: `npm run dev`

## Environment Variables

Required variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `RESEND_API_KEY`
