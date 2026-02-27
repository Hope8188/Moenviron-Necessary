import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const paymentIntentId = searchParams.get("payment_intent");
  const orderId = sessionId || paymentIntentId;
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    localStorage.removeItem("moenviron-cart");
    window.dispatchEvent(new CustomEvent("cart-updated"));

    async function processOrder() {
      // Small delay to allow webhook to fire, though the UI is just for feedback
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);
      setOrderConfirmed(true);
    }

    processOrder();
  }, [orderId, sessionId, paymentIntentId]);

  const isDonation = searchParams.get("type") === "donation";
  const donationAmount = searchParams.get("amount");
  const currency = searchParams.get("currency")?.toUpperCase() || "GBP";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container">
          <div className="mx-auto max-w-lg text-center">
            {isProcessing ? (
              <>
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
                <h1 className="mb-4 text-3xl font-bold text-foreground">
                  {isDonation ? "Verifying Donation..." : "Processing Your Order..."}
                </h1>
                <p className="mb-8 text-muted-foreground">
                  Please wait while we confirm your contribution to the circular loop.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h1 className="mb-4 text-3xl font-bold text-foreground">
                  {isDonation ? "Thank You for Your Support!" : "Order Confirmed!"}
                </h1>

                <div className="mb-8 space-y-4">
                  <p className="text-muted-foreground">
                    {isDonation
                      ? `Your donation of ${donationAmount} ${currency} has been received and will be directly invested into textile recycling infrastructure.`
                      : "Thank you for shopping sustainably. Your order has been confirmed."}
                  </p>

                  {isDonation && (
                    <div className="rounded-2xl bg-zinc-50 p-6 border border-zinc-100">
                      <p className="text-sm font-bold uppercase tracking-widest text-[#7CC38A] mb-2">Estimated ROI:</p>
                      <p className="text-2xl font-display">~{(Number(donationAmount) * 2).toFixed(1)}kg CO₂ Offset</p>
                      <p className="text-xs text-muted-foreground mt-2 italic">Based on Moenviron's circular processing metrics.</p>
                    </div>
                  )}
                </div>

                {orderId && (
                  <p className="mb-8 text-sm text-muted-foreground">
                    Reference: <code className="rounded bg-muted px-2 py-1">{orderId.slice(0, 20)}...</code>
                  </p>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link to={isDonation ? "/" : "/shop"}>
                    <Button className="gap-2">
                      {isDonation ? "Back to Home" : "Continue Shopping"}
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/impact">
                    <Button variant="outline" className="gap-2">
                      Track the Aggregate Impact
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
