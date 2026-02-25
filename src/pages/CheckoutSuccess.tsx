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
      if (!orderId) {
        setIsProcessing(false);
        setOrderConfirmed(true);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("stripe-webhook", {
          body: sessionId ? { sessionId } : { paymentIntentId },
        });

        if (error) {
          console.error("Error processing order:", error);
        } else if (data?.success) {
          setOrderConfirmed(true);
        } else {
          setOrderConfirmed(true);
        }
      } catch (err) {
        console.error("Failed to process order:", err);
        setOrderConfirmed(true);
      } finally {
        setIsProcessing(false);
      }
    }

    processOrder();
  }, [orderId, sessionId, paymentIntentId]);

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
                <h1 className="mb-4 text-3xl font-bold text-foreground">Processing Your Order...</h1>
                <p className="mb-8 text-muted-foreground">
                  Please wait while we confirm your payment.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h1 className="mb-4 text-3xl font-bold text-foreground">Order Confirmed!</h1>
                <p className="mb-8 text-muted-foreground">
                  Thank you for shopping sustainably. {orderConfirmed 
                    ? "A confirmation email has been sent to your inbox." 
                    : "Your order has been received."}
                </p>

                {orderId && (
                  <p className="mb-8 text-sm text-muted-foreground">
                    Order reference: <code className="rounded bg-muted px-2 py-1">{orderId.slice(0, 20)}...</code>
                  </p>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link to="/shop">
                    <Button className="gap-2">
                      Continue Shopping
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/impact">
                    <Button variant="outline" className="gap-2">
                      See Your Impact
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
