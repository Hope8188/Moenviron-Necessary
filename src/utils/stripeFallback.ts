import { toast } from "sonner";
export const STRIPE_DYNAMIC_CHECKOUT_URL = "/api/create-checkout";

// Fallback static URL - the user's preferred donation link
export const STRIPE_PAYMENT_LINK_STATIC_URL = "https://donate.stripe.com/dRm7sKgzH3qtapRg8wd3i00";

/**
 * Generates a dynamic redirect URL via our create-checkout function.
 * @param email - The customer's email address
 * @param amount - The donation amount
 * @param currency - The currency code (default: gbp)
 * @returns A fully qualified URL to initiate the checkout
 */
export const getStripeRedirectUrl = (
    email: string,
    amount: number,
    currency: string = "gbp",
    isDonation: boolean = true
) => {
    const url = new URL(STRIPE_DYNAMIC_CHECKOUT_URL, window.location.origin);
    url.searchParams.append("email", email);
    url.searchParams.append("amount", amount.toString());
    url.searchParams.append("currency", currency);
    url.searchParams.append("isDonation", isDonation ? "true" : "false");
    return url.toString();
};

/**
 * Handles the fallback redirection when the primary checkout method fails.
 * Attempts to use the dynamic redirect function first, then falls back to 
 * the static Stripe payment link.
 */
export const redirectToStripeFallback = (email: string, amount: number, currency: string = "gbp") => {
    try {
        const dynamicUrl = getStripeRedirectUrl(email, amount, currency);
        toast.info("Redirecting to secure checkout...");
        window.location.href = dynamicUrl;
    } catch (err) {
        console.error("Fallback redirect failed:", err);
        toast.info("Reconnecting to payment provider...");
        window.location.href = STRIPE_PAYMENT_LINK_STATIC_URL;
    }
};
