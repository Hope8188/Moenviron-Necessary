import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  CreditCard,
  Calendar,
  Copy,
  ArrowLeft,
  Loader2,
  AlertCircle,
  PackageCheck,
  Box
} from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface ShippingAddress {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
}

interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  total_amount: number;
  currency: string;
  payment_method: string;
  items: OrderItem[];
  user_name: string | null;
  user_email: string;
  shipping_address: ShippingAddress | null;
  estimated_delivery_date: string | null;
  mpesa_transaction_id: string | null;
  stripe_session_id: string | null;
  tracking_number: string | null;
  tracking_carrier: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
}

const ORDER_STATUSES = [
  { key: "pending", label: "Order Placed", icon: Clock, description: "We've received your order" },
  { key: "confirmed", label: "Confirmed", icon: PackageCheck, description: "Payment verified, preparing your order" },
  { key: "processing", label: "Processing", icon: Box, description: "Your items are being prepared" },
  { key: "shipped", label: "Shipped", icon: Truck, description: "Your order is on the way" },
  { key: "delivered", label: "Delivered", icon: CheckCircle2, description: "Order delivered successfully" },
];

const OrderTracking = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id]);

  const fetchOrder = async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          setError("Order not found. Please check your order ID.");
        } else {
          throw fetchError;
        }
        return;
      }

      const typedItems: OrderItem[] = Array.isArray(data.items) 
        ? (data.items as unknown as OrderItem[])
        : [];
      
      const typedShipping = data.shipping_address as unknown as ShippingAddress | null;

      setOrder({
        ...data,
        items: typedItems,
        shipping_address: typedShipping,
      });
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id.slice(0, 8).toUpperCase());
      toast.success("Order ID copied to clipboard");
    }
  };

  const getStatusIndex = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === "completed") return 4;
    if (normalizedStatus === "cancelled" || normalizedStatus === "failed") return -1;
    return ORDER_STATUSES.findIndex(s => s.key === normalizedStatus);
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "KES": return "KSh";
      case "GBP": return "£";
      case "USD": return "$";
      default: return currency;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-stone-50 to-white">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-emerald-600" />
            <p className="mt-4 text-stone-600">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-stone-50 to-white">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4">
          <Card className="max-w-md w-full border-red-200 bg-red-50/50">
            <CardContent className="pt-8 text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-red-400" />
              <h2 className="mt-4 text-xl font-semibold text-stone-800">Order Not Found</h2>
              <p className="mt-2 text-stone-600">{error || "We couldn't find this order."}</p>
              <div className="mt-6 flex flex-col gap-3">
                <Link to="/profile">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    View My Orders
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex(order.status);
  const isCancelled = order.status.toLowerCase() === "cancelled" || order.status.toLowerCase() === "failed";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-stone-50 to-white">
      <Navbar />
      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-4xl px-4">
          <Link to="/profile" className="mb-6 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to My Orders
          </Link>

          <div className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
                  Order Tracking
                </h1>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-mono text-lg font-semibold text-emerald-700">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <button
                    onClick={copyOrderId}
                    className="p-1.5 rounded-md hover:bg-stone-100 transition-colors"
                    title="Copy Order ID"
                  >
                    <Copy className="h-4 w-4 text-stone-400" />
                  </button>
                </div>
              </div>
              <Badge 
                className={`text-sm px-4 py-1.5 ${
                  isCancelled 
                    ? "bg-red-100 text-red-700 border-red-200" 
                    : currentStatusIndex === 4
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-amber-100 text-amber-700 border-amber-200"
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>

          {!isCancelled && (
            <Card className="mb-8 border-stone-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Progress
                </h2>
              </div>
              <CardContent className="p-6 md:p-8">
                <div className="relative">
                  <div className="absolute left-[22px] top-8 bottom-8 w-0.5 bg-stone-200 md:hidden" />
                  
                  <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-stone-200" style={{ left: '10%', right: '10%' }} />
                  <div 
                    className="hidden md:block absolute top-6 left-0 h-0.5 bg-emerald-500 transition-all duration-500"
                    style={{ 
                      left: '10%', 
                      width: `${Math.max(0, Math.min(80, (currentStatusIndex / 4) * 80))}%` 
                    }}
                  />

                  <div className="space-y-6 md:space-y-0 md:flex md:justify-between">
                    {ORDER_STATUSES.map((status, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const Icon = status.icon;

                      return (
                        <div 
                          key={status.key} 
                          className={`relative flex md:flex-col md:items-center md:text-center gap-4 md:gap-2 ${
                            index <= currentStatusIndex ? "opacity-100" : "opacity-40"
                          }`}
                        >
                          <div 
                            className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                              isCompleted 
                                ? "border-emerald-500 bg-emerald-500 text-white" 
                                : "border-stone-300 bg-white text-stone-400"
                            } ${isCurrent ? "ring-4 ring-emerald-100" : ""}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="md:mt-3">
                            <p className={`font-medium text-sm ${isCompleted ? "text-stone-800" : "text-stone-500"}`}>
                              {status.label}
                            </p>
                            <p className="text-xs text-stone-500 mt-0.5 hidden md:block max-w-[100px]">
                              {status.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {order.estimated_delivery_date && (
                  <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-stone-600">Estimated Delivery</p>
                        <p className="font-semibold text-emerald-700">
                          {formatDate(order.estimated_delivery_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-stone-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-600" />
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg bg-stone-100 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-6 w-6 text-stone-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 truncate">{item.name}</p>
                        <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-stone-800">
                        {getCurrencySymbol(order.currency)}{item.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-medium text-stone-600">Total</span>
                  <span className="text-xl font-bold text-emerald-700">
                    {getCurrencySymbol(order.currency)}{order.total_amount.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-stone-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    Shipping Address
                  </h3>
                  {order.shipping_address ? (
                    <div className="text-stone-600 space-y-1">
                      {order.shipping_address.name && (
                        <p className="font-medium text-stone-800">{order.shipping_address.name}</p>
                      )}
                      {order.shipping_address.line1 && <p>{order.shipping_address.line1}</p>}
                      {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                      <p>
                        {[order.shipping_address.city, order.shipping_address.postal_code]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {order.shipping_address.country && <p>{order.shipping_address.country}</p>}
                      {order.shipping_address.phone && (
                        <p className="mt-2 text-sm">Phone: {order.shipping_address.phone}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-stone-500 text-sm">
                      Shipping address will be confirmed via email.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Tracking Information Card */}
              {(order.tracking_number || order.tracking_carrier) && (
                <Card className="border-emerald-200 bg-emerald-50/30">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-emerald-600" />
                      Tracking Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      {order.tracking_carrier && (
                        <div className="flex justify-between">
                          <span className="text-stone-500">Carrier</span>
                          <span className="font-medium text-stone-800">{order.tracking_carrier}</span>
                        </div>
                      )}
                      {order.tracking_number && (
                        <div className="flex justify-between items-center">
                          <span className="text-stone-500">Tracking Number</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-stone-800">{order.tracking_number}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(order.tracking_number || "");
                                toast.success("Tracking number copied");
                              }}
                              className="p-1 rounded hover:bg-stone-100"
                            >
                              <Copy className="h-3 w-3 text-stone-400" />
                            </button>
                          </div>
                        </div>
                      )}
                      {order.shipped_at && (
                        <div className="flex justify-between">
                          <span className="text-stone-500">Shipped On</span>
                          <span className="font-medium text-stone-800">{formatShortDate(order.shipped_at)}</span>
                        </div>
                      )}
                      {order.delivered_at && (
                        <div className="flex justify-between">
                          <span className="text-stone-500">Delivered On</span>
                          <span className="font-medium text-emerald-700">{formatShortDate(order.delivered_at)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-stone-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                    Payment Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Method</span>
                      <span className="font-medium text-stone-800">
                        {order.payment_method === "mpesa" ? "M-Pesa" : 
                         order.payment_method === "paystack" ? "Paystack" : "Card Payment"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Date</span>
                      <span className="font-medium text-stone-800">
                        {formatShortDate(order.created_at)}
                      </span>
                    </div>
                    {order.mpesa_transaction_id && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">M-Pesa Ref</span>
                        <span className="font-mono text-stone-800">
                          {order.mpesa_transaction_id}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mt-8 border-emerald-200 bg-emerald-50/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-stone-800">Need Help?</h3>
                  <p className="text-sm text-stone-600 mt-1">
                    Contact us at <a href="mailto:info@moenviron.com" className="text-emerald-600 hover:underline">info@moenviron.com</a> or via WhatsApp
                  </p>
                </div>
                <Link to="/contact">
                  <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
