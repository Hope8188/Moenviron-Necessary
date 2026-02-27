// src/pages/Cart.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Plus, Minus, ShoppingBag, Leaf, ArrowRight, Loader2 } from "lucide-react";
import stripeLogo from "@/assets/stripe-logo.webp";
import { formatPrice } from "@/lib/currency";

interface CartItem {
  id: string;
  name: string;
  price: number; // major currency unit (e.g. 25 = £25)
  currency: string;
  quantity: number;
  image_url: string | null;
  carbon_offset_kg: number | null;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("moenviron-cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem("moenviron-cart", JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updated);
  };

  const removeItem = (id: string) => {
    saveCart(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = cartItems.length > 0 ? 5 : 0;
  const total = subtotal + shipping;

  const totalCarbon = cartItems.reduce(
    (sum, item) => sum + (item.carbon_offset_kg || 0) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!customerEmail) {
      toast.error("Please enter your email address");
      return;
    }

    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      const currency = cartItems[0]?.currency || "GBP";
      const { data, error: invokeError } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: [{
            id: "cart_order",
            name: "Moenviron Order",
            price: total,
            quantity: 1,
          }],
          customerEmail: customerEmail,
          currency,
          mode: "checkout_session",
          isDonation: false,
        }
      });

      if (invokeError) {
        console.error("Checkout failed:", invokeError);
        toast.error("Unable to start checkout. Please try again.");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Stripe session was not created.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <h1 className="mb-8 text-3xl font-bold text-foreground">
            Shopping Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30" />
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                Your cart is empty
              </h2>
              <p className="mt-2 text-muted-foreground">
                Start shopping our sustainable collection
              </p>
              <Link to="/shop" className="mt-6 inline-block">
                <Button className="gap-2">
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-xl border border-border bg-card p-4"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Leaf className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {item.name}
                        </h3>
                        {item.carbon_offset_kg && (
                          <span className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
                            <Leaf className="h-3 w-3" />
                            -{item.carbon_offset_kg}kg CO₂
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-foreground">
                            {formatPrice(
                              item.price * item.quantity,
                              item.currency
                            )}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-6 text-xl font-semibold text-foreground">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">
                      {formatPrice(subtotal, "GBP")}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-foreground">
                      {formatPrice(shipping, "GBP")}
                    </span>
                  </div>

                  {totalCarbon > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span className="flex items-center gap-1">
                        <Leaf className="h-4 w-4" />
                        Carbon Offset
                      </span>
                      <span className="font-medium">
                        -{totalCarbon.toFixed(1)}kg CO₂
                      </span>
                    </div>
                  )}

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-foreground">
                        Total
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {formatPrice(total, "GBP")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Order confirmation will be sent here
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-primary bg-primary/5 p-3">
                    <img src={stripeLogo} alt="Stripe" className="h-5 w-auto" />
                    <div>
                      <p className="text-sm font-medium">Card Payment</p>
                      <p className="text-[10px] text-muted-foreground">
                        Secure payment via Stripe
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  className="mt-6 w-full gap-2"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <img src={stripeLogo} alt="" className="h-4 w-auto" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;