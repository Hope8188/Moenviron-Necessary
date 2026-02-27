import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { safeToastError } from "@/lib/error-handler";
import { toast } from "sonner";
import { Loader2, Search, Package, Download, Eye, DollarSign, Clock, CheckCircle, XCircle, Truck, Send, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Order {
  id: string;
  user_email: string;
  user_name: string | null;
  payment_method: string;
  total_amount: number;
  currency: string;
  status: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  shipping_address: { line1?: string; city?: string; country?: string; phone?: string } | null;
  created_at: string;
  stripe_session_id: string | null;
  mpesa_transaction_id: string | null;
  tracking_number: string | null;
  tracking_carrier: string | null;
  estimated_delivery: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  admin_notes: string | null;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "processing", label: "Processing", color: "bg-blue-500" },
  { value: "shipped", label: "Shipped", color: "bg-purple-500" },
  { value: "arrived", label: "Arrived at Destination", color: "bg-indigo-500" },
  { value: "delivered", label: "Delivered", color: "bg-green-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
];

export function OrdersManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSavingTracking, setIsSavingTracking] = useState(false);
  const [isSendingUpdate, setIsSendingUpdate] = useState(false);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      // Map the database data to our Order interface
      return (data || []).map(item => ({
        ...item,
        items: Array.isArray(item.items) ? item.items as unknown as Order['items'] : [],
        shipping_address: item.shipping_address as Order['shipping_address'],
        tracking_number: null,
        tracking_carrier: null,
        estimated_delivery: item.estimated_delivery_date,
        shipped_at: null,
        delivered_at: null,
        admin_notes: null,
      })) as Order[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updateData: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === "shipped" && !selectedOrder?.shipped_at) {
        updateData.shipped_at = new Date().toISOString();
      }
      if (status === "delivered" && !selectedOrder?.delivered_at) {
        updateData.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
  });

  const saveTrackingInfo = async () => {
    if (!selectedOrder) return;
    setIsSavingTracking(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          tracking_number: trackingNumber || null,
          tracking_carrier: trackingCarrier || null,
          estimated_delivery: estimatedDelivery || null,
          admin_notes: adminNotes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedOrder.id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Tracking info saved");
    } catch (error) {
      safeToastError(error);
    } finally {
      setIsSavingTracking(false);
    }
  };

  const sendStatusUpdate = async () => {
    if (!selectedOrder) return;
    setIsSendingUpdate(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-order-status-update", {
        body: {
          orderId: selectedOrder.id,
          userEmail: selectedOrder.user_email,
          userName: selectedOrder.user_name,
          newStatus: selectedOrder.status,
          totalAmount: selectedOrder.total_amount,
          currency: selectedOrder.currency,
          trackingNumber: trackingNumber || selectedOrder.tracking_number,
          trackingCarrier: trackingCarrier || selectedOrder.tracking_carrier,
          estimatedDelivery: estimatedDelivery || selectedOrder.estimated_delivery,
        },
      });

      if (error) throw error;
      toast.success("Status update email sent!");
    } catch (error) {
      safeToastError(error);
    } finally {
      setIsSendingUpdate(false);
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.tracking_number || "");
    setTrackingCarrier(order.tracking_carrier || "");
    setEstimatedDelivery(order.estimated_delivery || "");
    setAdminNotes(order.admin_notes || "");
  };

  const exportToCSV = () => {
    if (!orders) return;
    const csv = [
      "Order ID,Email,Name,Amount,Currency,Status,Payment Method,Date",
      ...orders.map(o =>
        `${o.id},${o.user_email},${o.user_name || ""},${o.total_amount},${o.currency},${o.status},${o.payment_method},${new Date(o.created_at).toLocaleDateString()}`
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to CSV");
  };

  const filteredOrders = orders?.filter(o => {
    const matchesSearch =
      o.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.user_name && o.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders?.reduce((sum, o) => {
    if (o.status !== "cancelled") {
      return sum + (o.total_amount || 0);
    }
    return sum;
  }, 0) || 0;

  const pendingCount = orders?.filter(o => o.status === "pending").length || 0;
  const completedCount = orders?.filter(o => o.status === "delivered").length || 0;

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      KES: "KSh ",
      EUR: "€",
      GBP: "£",
      USD: "$",
    };
    return `${symbols[currency] || currency + " "}${amount.toFixed(2)}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
    return (
      <Badge className={`${statusConfig.color} text-white`}>
        {statusConfig.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orders?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue, "GBP")}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Orders
            </CardTitle>
            <CardDescription>View and manage customer orders</CardDescription>
          </div>
          <Button variant="outline" onClick={exportToCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, name, or order ID..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 font-medium text-sm">
              <div className="col-span-2">Order ID</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1 text-right">Action</div>
            </div>
            {filteredOrders?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No orders found
              </div>
            ) : (
              filteredOrders?.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-12 gap-4 p-3 border-t items-center text-sm"
                >
                  <div className="col-span-2 font-mono text-xs truncate">
                    {order.id.slice(0, 8)}...
                  </div>
                  <div className="col-span-3">
                    <div className="font-medium">{order.user_name || "-"}</div>
                    <div className="text-xs text-muted-foreground">{order.user_email}</div>
                  </div>
                  <div className="col-span-2 font-medium">
                    {formatCurrency(order.total_amount || 0, order.currency)}
                  </div>
                  <div className="col-span-2">
                    <Select
                      value={order.status}
                      onValueChange={(status) => updateStatusMutation.mutate({ id: order.id, status })}
                    >
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                  <div className="col-span-1 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openOrderDetails(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono text-sm">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Email</p>
                  <p>{selectedOrder.user_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p>{selectedOrder.user_name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <Badge variant="outline" className="capitalize">{selectedOrder.payment_method}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-lg">
                    {formatCurrency(selectedOrder.total_amount || 0, selectedOrder.currency)}
                  </p>
                </div>
              </div>

              {selectedOrder.shipping_address && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Shipping Address</p>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {selectedOrder.shipping_address.line1 && <p>{selectedOrder.shipping_address.line1}</p>}
                    {selectedOrder.shipping_address.city && <p>{selectedOrder.shipping_address.city}</p>}
                    {selectedOrder.shipping_address.country && <p>{selectedOrder.shipping_address.country}</p>}
                    {selectedOrder.shipping_address.phone && <p className="mt-2 text-muted-foreground">Phone: {selectedOrder.shipping_address.phone}</p>}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Order Items</p>
                <div className="border rounded-md">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between p-3 border-b last:border-0">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-medium">{formatCurrency(item.price * item.quantity, selectedOrder.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium flex items-center gap-2 mb-4">
                  <Truck className="h-4 w-4" />
                  Tracking Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tracking_number">Tracking Number</Label>
                    <Input
                      id="tracking_number"
                      placeholder="Enter tracking number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tracking_carrier">Carrier</Label>
                    <Select value={trackingCarrier} onValueChange={setTrackingCarrier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dhl">DHL</SelectItem>
                        <SelectItem value="fedex">FedEx</SelectItem>
                        <SelectItem value="ups">UPS</SelectItem>
                        <SelectItem value="usps">USPS</SelectItem>
                        <SelectItem value="royal_mail">Royal Mail</SelectItem>
                        <SelectItem value="kenya_post">Kenya Post</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated_delivery">Estimated Delivery</Label>
                    <Input
                      id="estimated_delivery"
                      type="date"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Update Status</Label>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(status) => updateStatusMutation.mutate({ id: selectedOrder.id, status })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="admin_notes">Admin Notes</Label>
                  <Textarea
                    id="admin_notes"
                    placeholder="Internal notes about this order..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {(selectedOrder.stripe_session_id || selectedOrder.mpesa_transaction_id) && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Payment Reference</p>
                  <p className="font-mono text-xs bg-muted p-2 rounded">
                    {selectedOrder.stripe_session_id || selectedOrder.mpesa_transaction_id}
                  </p>
                </div>
              )}

              {(selectedOrder.shipped_at || selectedOrder.delivered_at) && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedOrder.shipped_at && (
                    <div>
                      <p className="text-muted-foreground">Shipped At</p>
                      <p>{new Date(selectedOrder.shipped_at).toLocaleString()}</p>
                    </div>
                  )}
                  {selectedOrder.delivered_at && (
                    <div>
                      <p className="text-muted-foreground">Delivered At</p>
                      <p>{new Date(selectedOrder.delivered_at).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex gap-2 pt-4">
            <Button variant="outline" onClick={saveTrackingInfo} disabled={isSavingTracking}>
              {isSavingTracking && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Info
            </Button>
            <Button onClick={sendStatusUpdate} disabled={isSendingUpdate}>
              {isSendingUpdate ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Send Update Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
