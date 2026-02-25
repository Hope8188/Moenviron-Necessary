import { toast } from "sonner";

/**
 * Converts a technical error into a user-friendly message for security and UX.
 * Avoids leaking database details, stack traces, or technical jargon.
 */
export const getSafeErrorMessage = (error: any): string => {
    if (!error) return "An unexpected error occurred.";

    const message = typeof error === 'string' ? error : error.message || "";

    // Auth errors that are safe to show
    if (message.includes("Invalid login credentials")) return "Invalid email or password.";
    if (message.includes("Email not confirmed")) return "Please verify your email address before continuing.";
    if (message.includes("already registered")) return "An account with this email already exists.";
    if (message.includes("User not found")) return "No account found with this email.";

    // Payment errors
    if (message.includes("Stripe")) return "There was a problem processing your payment. Please try again.";
    if (message.includes("insufficient funds")) return "Your card has insufficient funds.";

    // Generic security masking for everything else
    console.error("Technical Error Hidden from User:", error);
    return "Something went wrong on our end. Please try again later or contact support if the issue persists.";
};

/**
 * Standardized toast wrapper for errors
 */
export const safeToastError = (error: any) => {
    toast.error(getSafeErrorMessage(error));
};
