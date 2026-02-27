import { safeToastError } from '@/lib/error-handler';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Package, ShoppingCart, BarChart3, Shield, Layout, TrendingUp, MapPin, Image, Terminal, MessageSquare } from "lucide-react";
import { CMSManager } from "@/components/admin/CMSManager";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { ProductPerformance } from "@/components/admin/ProductPerformance";
import { SystemTools } from "@/components/admin/SystemTools";
import { ImpactMetricsManager } from "@/components/admin/ImpactMetricsManager";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { AdminUserManager } from "@/components/admin/AdminUserManager";
import { AdminChat } from "@/components/admin/AdminChat";
import { LibraryManager } from "@/components/admin/LibraryManager";
import { ReportManager } from "@/components/admin/ReportManager";
import { PaymentManager } from "@/components/admin/PaymentManager";
import { SubscribersManager } from "@/components/admin/SubscribersManager";
import { OrdersManager } from "@/components/admin/OrdersManager";
import { BookOpen, FileText, CreditCard, Mail } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  carbon_offset_kg: number | null;
  stock_quantity: number;
  is_active: boolean;
}

interface Order {
  id: string;
  user_email: string;
  user_name: string | null;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  items: unknown;
  customer_location: string | null;
}

interface ImpactMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  unit: string;
  recorded_at: string;
}

import { AdvancedAnalytics } from "@/components/admin/AdvancedAnalytics";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAdmin, userRole } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const isSuperAdmin = userRole === "admin";
  const canViewOrders = isSuperAdmin || userRole === "shipping" || userRole === "support";
  const canViewProducts = isSuperAdmin || userRole === "content";
  const canViewContent = isSuperAdmin || userRole === "content";
  const canViewSubscribers = isSuperAdmin || userRole === "marketing";
  const canViewAnalytics = isSuperAdmin || userRole === "marketing";
  const canViewPayments = isSuperAdmin;
  const canViewAdmins = isSuperAdmin;
  const canViewTools = isSuperAdmin;

  const getRoleTitle = () => {
    switch (userRole) {
      case "admin": return "Super Admin Dashboard";
      case "marketing": return "Marketing Dashboard";
      case "shipping": return "Shipping & Fulfillment Dashboard";
      case "support": return "Customer Support Dashboard";
      case "content": return "Content Management Dashboard";
      default: return "Admin Dashboard";
    }
  };

  const getRoleDescription = () => {
    switch (userRole) {
      case "admin": return "Full access to all systems and settings";
      case "marketing": return "Manage subscribers, campaigns, and analytics";
      case "shipping": return "Track and manage order fulfillment";
      case "support": return "Handle customer orders and inquiries";
      case "content": return "Manage products and website content";
      default: return "Manage your assigned tasks";
    }
  };

  // Product form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Clothing",
    image_url: "",
    carbon_offset_kg: "",
    stock_quantity: "",
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin-login");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    const [productsRes, ordersRes, metricsRes] = await Promise.all([
      (supabase as any).from("products").select("*").order("created_at", { ascending: false }),
      (supabase as any).from("orders").select("*").order("created_at", { ascending: false }),
      (supabase as any).from("impact_metrics").select("*").order("recorded_at", { ascending: false }),
    ]);

    if (productsRes.data) setProducts(productsRes.data as Product[]);
    if (ordersRes.data) setOrders(ordersRes.data as Order[]);
    if (metricsRes.data) setMetrics(metricsRes.data as ImpactMetric[]);
    setIsLoading(false);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      category: formData.category,
      image_url: formData.image_url || null,
      carbon_offset_kg: formData.carbon_offset_kg ? parseFloat(formData.carbon_offset_kg) : null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast.error("Failed to update product");
      } else {
        toast.success("Product updated");
        fetchData();
      }
    } else {
      const { error } = await supabase.from("products").insert(productData);

      if (error) {
        toast.error("Failed to create product");
      } else {
        toast.success("Product created");
        fetchData();
      }
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success("Product deleted");
      fetchData();
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      toast.error("Failed to update order");
      return;
    }

    toast.success("Order updated");
    fetchData();

    // Send status update email for shipped/delivered/confirmed/arrived statuses
    if (['shipped', 'delivered', 'confirmed', 'arrived', 'processing'].includes(status.toLowerCase())) {
      try {
        const response = await supabase.functions.invoke('send-order-status-update', {
          body: {
            orderId: order.id,
            userEmail: order.user_email,
            userName: order.user_name || 'Valued Customer',
            newStatus: status,
            totalAmount: order.total_amount,
            currency: 'GBP'
          }
        });

        if (response.error) {
          console.error("Failed to send status email:", response.error);
        } else {
          toast.success(`Status update email sent to ${order.user_email}`);
        }
      } catch (emailError) {
        console.error("Error sending status email:", emailError);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Clothing",
      image_url: "",
      carbon_offset_kg: "",
      stock_quantity: "",
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url || "",
      carbon_offset_kg: product.carbon_offset_kg?.toString() || "",
      stock_quantity: product.stock_quantity.toString(),
    });
    setIsDialogOpen(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{getRoleTitle()}</h1>
              <p className="text-sm text-muted-foreground">{getRoleDescription()}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {canViewAnalytics && (
                <Button
                  variant="default"
                  size="sm"
                  className="hidden md:flex gap-2 bg-emerald-600 hover:bg-emerald-700 font-bold"
                  onClick={() => {
                    const tabsElement = document.querySelector('[role="tablist"]');
                    const analyticsTab = tabsElement?.querySelector('[value="analytics"]') as HTMLElement;
                    analyticsTab?.click();
                  }}
                >
                  <BarChart3 className="h-4 w-4" />
                  View Analytics
                </Button>
              )}
              {userRole && userRole !== "admin" && (
                <Badge variant="outline" className="capitalize">{userRole}</Badge>
              )}
            </div>
          </div>

          <Tabs defaultValue={canViewAnalytics ? "analytics" : canViewOrders ? "orders" : "chat"} className="w-full">
            <TabsList className="mb-6 flex-wrap w-full justify-start h-auto">
              {canViewAnalytics && (
                <TabsTrigger value="analytics" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              )}
              {canViewAnalytics && (
                <TabsTrigger value="performance" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Product Insights
                </TabsTrigger>
              )}
              {canViewOrders && (
                <TabsTrigger value="orders" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Orders
                </TabsTrigger>
              )}
              {canViewProducts && (
                <TabsTrigger value="products" className="gap-2">
                  <Package className="h-4 w-4" />
                  Products
                </TabsTrigger>
              )}
              {canViewSubscribers && (
                <TabsTrigger value="subscribers" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Subscribers
                </TabsTrigger>
              )}
              {isSuperAdmin && (
                <TabsTrigger value="library" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Digital Library
                </TabsTrigger>
              )}
              {canViewContent && (
                <TabsTrigger value="content" className="gap-2">
                  <Layout className="h-4 w-4" />
                  Content
                </TabsTrigger>
              )}
              {isSuperAdmin && (
                <TabsTrigger value="reports" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Reports
                </TabsTrigger>
              )}
              {canViewPayments && (
                <TabsTrigger value="payments" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payments
                </TabsTrigger>
              )}
              {canViewAdmins && (
                <TabsTrigger value="admins" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Staff
                </TabsTrigger>
              )}
              {canViewTools && (
                <TabsTrigger value="tools" className="gap-2">
                  <Terminal className="h-4 w-4" />
                  Tools
                </TabsTrigger>
              )}
              <TabsTrigger value="insights" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <Card className="bg-emerald-50 border-emerald-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-800">Traffic Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-900">Live Traffic</div>
                    <p className="text-xs text-emerald-600">Updated in real-time</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-800">New Subscribers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900">MailerLite Ready</div>
                    <p className="text-xs text-blue-600">Sync is active</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-purple-800">Impact Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-900">Graphs Verified</div>
                    <p className="text-xs text-purple-600">6 months of historical data</p>
                  </CardContent>
                </Card>
              </div>
              <AnalyticsDashboard />
            </TabsContent>

            {/* Advanced Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <AdvancedAnalytics />
            </TabsContent>

            {/* Product Performance Tab */}
            <TabsContent value="performance">
              <ProductPerformance />
            </TabsContent>

            {/* Digital Library Tab */}
            <TabsContent value="library">
              <LibraryManager />
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports">
              <ReportManager />
            </TabsContent>


            {/* System Tools Tab */}
            <TabsContent value="tools">
              <SystemTools />
            </TabsContent>

            {/* Products Tab */}

            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Products</CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Input
                              id="category"
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div>
                            <Label htmlFor="price">Price (£)</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                              id="stock"
                              type="number"
                              value={formData.stock_quantity}
                              onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="carbon">Carbon (kg)</Label>
                            <Input
                              id="carbon"
                              type="number"
                              step="0.1"
                              value={formData.carbon_offset_kg}
                              onChange={(e) => setFormData({ ...formData, carbon_offset_kg: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="image">Image URL</Label>
                          <Input
                            id="image"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          {editingProduct ? "Update Product" : "Create Product"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>£{product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.stock_quantity}</TableCell>
                          <TableCell>
                            <Badge variant={product.is_active ? "default" : "secondary"}>
                              {product.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.user_name || "Guest"}</p>
                              <p className="text-sm text-muted-foreground">{order.user_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {order.customer_location ? (
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                {order.customer_location}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>£{order.total_amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.payment_method}</Badge>
                          </TableCell>
                          <TableCell>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="rounded border border-border bg-background px-2 py-1 text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="arrived">Arrived at Destination</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Impact Metrics Tab */}
            <TabsContent value="metrics">
              <ImpactMetricsManager />
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content">
              <CMSManager />
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Media Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-6">
                    Upload images here and copy the URL to use anywhere on the site.
                  </p>
                  <ImageUploader label="Upload New Image" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admins Tab */}
            <TabsContent value="admins">
              <AdminUserManager />
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat">
              <AdminChat />
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <PaymentManager />
            </TabsContent>

            {/* Subscribers Tab */}
            <TabsContent value="subscribers">
              <SubscribersManager />
            </TabsContent>
          </Tabs>


        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
