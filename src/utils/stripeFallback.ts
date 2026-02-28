import { toast } from "sonner";
export const STRIPE_DYNAMIC_CHECKOUT_URL = "https://wmeijbrqjuhvnksiijcz.supabase.co/functions/v1/create-checkout";

// Fallback static URL - the user's preferred donation link
export const STRIPE_PAYMENT_LINK_STATIC_URL = "https://donate.stripe.com/dRm7sKgzH3qtapRg8wd3i00";

/**
 * Generates a dynamic redirect URL via our create-checkout function.
 * @param email - The customer's email address
 * @param amount - The amount to charge
 * @param currency - The currency code (e.g. 'gbp', 'eur')
 */
export const getStripeFallbackUrl = (email?: string, amount?: number, currency: string = 'gbp'): string => {
    if (!amount || amount <= 0) return STRIPE_PAYMENT_LINK_STATIC_URL;

    const params = new URLSearchParams();
    params.append('amount', amount.toString());
    params.append('currency', currency.toLowerCase());

    if (email) {
        params.append('email', email);
    }

    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
    if (anonKey) {
        params.append('apikey', anonKey);
    }

    params.append('isDonation', 'true');

    return `${STRIPE_DYNAMIC_CHECKOUT_URL}?${params.toString()}`;
};

/**
 * Handles payment redirection efficiently with user feedback.
 */
export const redirectToStripeFallback = (email?: string, amount?: number, currency: string = 'gbp') => {
    toast.info("Redirecting...", {
        description: "Taking you to secure checkout.",
        duration: 2000,
    });

    const url = getStripeFallbackUrl(email, amount, currency);

    // Immediate redirect for smoother experience
    window.location.href = url;
};
