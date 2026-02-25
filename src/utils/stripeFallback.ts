import { toast } from "sonner";
import { invokeEdgeFunction } from "@/integrations/supabase/edgeFunctions";

/**
 * Dynamically creates a Stripe Checkout session through Supabase and redirects.
 * This path intentionally avoids static payment links.
 */
export const redirectToStripeFallback = async (
  email?: string,
  amount?: number,
  currency: string = 'gbp'
) => {
    toast.info("Redirecting...", {
        description: "Taking you to secure checkout.",
        duration: 2000,
    });

    if (!amount || amount <= 0) {
      toast.error("Unable to start checkout", {
        description: "Please enter a valid amount and try again.",
      });
      return;
    }

    const { data, error } = await invokeEdgeFunction<{ url?: string }>("create-checkout", {
      items: [
        {
          id: "fallback_donation",
          name: "Donation to Moenviron",
          price: amount,
          quantity: 1,
        },
      ],
      customerEmail: email,
      currency,
      mode: "checkout_session",
      isDonation: true,
    });

    if (!error && data?.url) {
      window.location.href = data.url;
      return;
    }

    console.error("Dynamic checkout redirect failed", error || data);
    toast.error("Unable to redirect to secure checkout", {
      description: "Please try again in a moment.",
    });
};
