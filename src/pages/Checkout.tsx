import { useState, useEffect } from "react";
import { redirectToStripeFallback } from "@/utils/stripeFallback";
import { useNavigate, Link } from "react-router-dom";
import type { Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { safeToastError } from "@/lib/error-handler";
import { Leaf, Loader2, ArrowLeft, ShoppingBag, Lock, CheckCircle2, MapPin, CreditCard } from "lucide-react";

import stripeLogo from "@/assets/stripe-logo.webp";

// Lazy load Stripe.js
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = import("@stripe/stripe-js").then(mod => mod.loadStripe(stripePublishableKey));
  }
  return stripePromise;
};

type PaymentMethod = "stripe";

interface CartItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  image_url: string | null;
  carbon_offset_kg: number | null;
}

interface ShippingAddress {
  name: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
}

function CheckoutForm({
  cartItems,
  subtotal,
  clientSecret,
  paymentIntentId,
  customerEmail,
  customerName,
}: {
  cartItems: CartItem[];
  subtotal: number;
  clientSecret: string;
  paymentIntentId: string;
  customerEmail: string;
  customerName: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [addressComplete, setAddressComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);

  const shipping = 5;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !shippingAddress) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(submitError.message || "Please check your payment details");
        setIsProcessing(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          receipt_email: customerEmail,
          shipping: {
            name: shippingAddress.name,
            phone: shippingAddress.phone,
            address: {
              line1: shippingAddress.address.line1,
              line2: shippingAddress.address.line2 || "",
              city: shippingAddress.address.city,
              state: shippingAddress.address.state || "",
              postal_code: shippingAddress.address.postal_code,
              country: shippingAddress.address.country,
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        const { error: confirmError } = await supabase.functions.invoke("stripe-webhook", {
          body: {
            paymentIntentId: paymentIntent.id,
            shippingAddress: {
              name: shippingAddress.name,
              phone: shippingAddress.phone,
              line1: shippingAddress.address.line1,
              line2: shippingAddress.address.line2,
              city: shippingAddress.address.city,
              state: shippingAddress.address.state,
              postal_code: shippingAddress.address.postal_code,
              country: shippingAddress.address.country,
            },
          },
        });

        if (confirmError) {
          console.error("Order confirmation error:", confirmError);
        }

        localStorage.removeItem("moenviron-cart");
        window.dispatchEvent(new CustomEvent("cart-updated"));
        setIsComplete(true);
        toast.success("Payment successful!");

        setTimeout(() => {
          navigate(`/checkout/success?payment_intent=${paymentIntent.id}`);
        }, 2000);
      }
    } catch (err) {
      safeToastError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">Payment Successful!</h2>
        <p className="text-muted-foreground">Redirecting to your order confirmation...</p>
        <Loader2 className="mt-4 h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Shipping Address</h2>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <AddressElement
            options={{
              mode: "shipping",
              autocomplete: { mode: "google_maps_api", apiKey: "" },
              fields: { phone: "always" },
              validation: { phone: { required: "auto" } },
              defaultValues: {
                name: customerName,
              },
            }}
            onChange={(event) => {
              setAddressComplete(event.complete);
              if (event.complete && event.value) {
                setShippingAddress(event.value);
              }
            }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Payment Details</h2>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
            onChange={(event) => setPaymentComplete(event.complete)}
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">£{shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full gap-2"
        size="lg"
        disabled={!stripe || !elements || isProcessing || !addressComplete || !paymentComplete}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Pay £{total.toFixed(2)}
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        <Lock className="mr-1 inline h-3 w-3" />
        Secure payment powered by Stripe
      </p>
    </form>
  );
}

export function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [emailError, setEmailError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("stripe");

  const detectLocation = () => {
    setIsDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const locationString = `${data.city || data.locality}, ${data.countryName}`;
            setCustomerLocation(locationString);
            toast.success(`Location detected: ${locationString}`);
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            toast.error("Could not determine city name, but location captured.");
          } finally {
            setIsDetectingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Location access denied or unavailable.");
          setIsDetectingLocation(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
      setIsDetectingLocation(false);
    }
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("moenviron-cart");
    if (savedCart) {
      const items = JSON.parse(savedCart);
      if (items.length === 0) {
        navigate("/cart");
      } else {
        setCartItems(items);
      }
    } else {
      navigate("/cart");
    }
  }, [navigate]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCarbon = cartItems.reduce((sum, item) => sum + (item.carbon_offset_kg || 0) * item.quantity, 0);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleContinueToPayment = async () => {
    if (!customerEmail) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(customerEmail)) {
      setEmailError("Please enter a valid email");
      return;
    }
    setEmailError("");
    setIsLoading(true);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          customerEmail,
          customerName,
          mode: "payment_intent",
        }
      });

      if (invokeError) throw invokeError;

      if (data?.clientSecret) {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
        setShowPayment(true);
      } else {
        throw new Error("Failed to create payment intent");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      // Automatic fallback redirection - using total (subtotal + shipping)
      redirectToStripeFallback(customerEmail, subtotal + 5, "gbp");
    } finally {
      setIsLoading(false);
    }
  };

  const canCheckout = !!stripePublishableKey;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container max-w-6xl">
          <Link to="/cart" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h1 className="mb-6 text-2xl font-bold text-foreground">Checkout</h1>

                {!showPayment ? (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => {
                          setCustomerEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                        placeholder="you@example.com"
                        className={emailError ? "border-destructive" : ""}
                      />
                      {emailError && (
                        <p className="mt-1 text-sm text-destructive">{emailError}</p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        We'll send your order confirmation here
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium flex items-center justify-between">
                        <span>Delivery Location</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px] text-primary hover:text-primary hover:bg-primary/5"
                          onClick={detectLocation}
                          disabled={isDetectingLocation}
                        >
                          {isDetectingLocation ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : (
                            <MapPin className="mr-1 h-3 w-3" />
                          )}
                          Detect My Location
                        </Button>
                      </Label>
                      <Input
                        id="location"
                        value={customerLocation}
                        onChange={(e) => setCustomerLocation(e.target.value)}
                        placeholder="City, Country"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Capturing your location helps us calculate environmental impact
                      </p>
                    </div>

                    {/* Payment Method - Only Stripe */}
                    <div className="space-y-3 pt-4 border-t border-border">
                      <Label className="text-sm font-medium">Payment Method</Label>
                      <div className="flex items-center space-x-3 rounded-lg border border-primary bg-primary/5 p-3">
                        <img src={stripeLogo} alt="Stripe" className="h-6 w-auto object-contain" />
                        <div>
                          <p className="font-medium">Card Payment</p>
                          <p className="text-xs text-muted-foreground">Secure payment via Stripe</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleContinueToPayment}
                      className="w-full gap-2"
                      size="lg"
                      disabled={isLoading || !canCheckout}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <img src={stripeLogo} alt="" className="h-4 w-auto" />
                          Continue to Payment
                        </>
                      )}
                    </Button>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={getStripe()}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#16a34a",
                          borderRadius: "8px",
                        },
                      },
                    }}
                  >
                    <CheckoutForm
                      cartItems={cartItems}
                      subtotal={subtotal}
                      clientSecret={clientSecret}
                      paymentIntentId={paymentIntentId || ""}
                      customerEmail={customerEmail}
                      customerName={customerName}
                    />
                  </Elements>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </h2>

                <div className="max-h-64 space-y-3 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Leaf className="h-6 w-6 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-foreground">
                          £{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">£5.00</span>
                  </div>
                  {totalCarbon > 0 && (
                    <div className="flex justify-between text-primary">
                      <span className="flex items-center gap-1">
                        <Leaf className="h-3 w-3" />
                        Carbon Offset
                      </span>
                      <span className="font-medium">-{totalCarbon.toFixed(1)}kg CO₂</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                    <span>Total</span>
                    <span>£{(subtotal + 5).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-primary/5 p-3">
                  <div className="flex items-start gap-2">
                    <Leaf className="mt-0.5 h-4 w-4 text-primary" />
                    <div className="text-xs">
                      <p className="font-medium text-foreground">Sustainable Purchase</p>
                      <p className="text-muted-foreground">
                        Your order helps offset {totalCarbon.toFixed(1)}kg of CO₂ emissions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Checkout;
