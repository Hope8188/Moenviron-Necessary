import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { safeToastError } from "@/lib/error-handler";
import {
  Loader2,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  Mail,
  Truck,
  MessageSquare,
  BarChart3,
  Layout,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { AdminChat } from "@/components/admin/AdminChat";

interface Order {
  id: string;
  user_email: string;
  user_name: string | null;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  items: unknown;
  tracking_number?: string;
  tracking_carrier?: string;
  estimated_delivery?: string;
  shipped_at?: string;
  delivered_at?: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  stock_quantity: number;
  is_active: boolean;
}

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

const COLORS = ['#1A3C34', '#2D5A4E', '#4A7C6F', '#6B9D8F', '#8CBFAF'];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAdmin, userRole } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalSubscribers: 0,
    newSubscribersThisWeek: 0,
  });

  const isStaff = isAdmin && userRole && userRole !== "user";
  const canViewOrders = userRole === "admin" || userRole === "shipping" || userRole === "support";
  const canViewProducts = userRole === "admin" || userRole === "content";
  const canViewSubscribers = userRole === "admin" || userRole === "marketing";
  const canViewAnalytics = userRole === "admin" || userRole === "marketing";

  const getRoleTitle = () => {
    switch (userRole) {
      case "admin": return "Super Admin";
      case "marketing": return "Marketing Team";
      case "shipping": return "Shipping & Fulfillment";
      case "support": return "Customer Support";
      case "content": return "Content Manager";
      default: return "Staff Member";
    }
  };

  const getRoleDescription = () => {
    switch (userRole) {
      case "admin": return "Full access to all systems";
      case "marketing": return "Manage subscribers and campaigns";
      case "shipping": return "Track and manage shipments";
      case "support": return "Handle customer inquiries";
      case "content": return "Manage products and content";
      default: return "Assigned tasks";
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "marketing": return <Mail className="h-5 w-5" />;
      case "shipping": return <Truck className="h-5 w-5" />;
      case "support": return <MessageSquare className="h-5 w-5" />;
      case "content": return <Layout className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || !isStaff)) {
      navigate("/staff-login");
    }
  }, [user, isStaff, authLoading, navigate]);

  useEffect(() => {
    if (isStaff) {
      fetchData();
    }
  }, [isStaff]);

  const fetchData = async () => {
    setIsLoading(true);

    const [ordersRes, productsRes, subscribersRes] = await Promise.all([
      (supabase as any).from("orders").select("*").order("created_at", { ascending: false }),
      (supabase as any).from("products").select("*").order("created_at", { ascending: false }),
      (supabase as any).from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false }),
    ]);

    if (ordersRes.data) {
      setOrders(ordersRes.data as Order[]);
      const completed = ordersRes.data.filter((o: Order) => o.status === "delivered" || o.status === "completed");
      const pending = ordersRes.data.filter((o: Order) => o.status === "pending" || o.status === "processing");
      const revenue = completed.reduce((sum: number, o: Order) => sum + Number(o.total_amount), 0);

      setStats(prev => ({
        ...prev,
        totalOrders: ordersRes.data.length,
        pendingOrders: pending.length,
        completedOrders: completed.length,
        totalRevenue: revenue,
      }));
    }

    if (productsRes.data) {
      setProducts(productsRes.data as Product[]);
      const lowStock = productsRes.data.filter((p: Product) => p.stock_quantity < 10);
      setStats(prev => ({
        ...prev,
        totalProducts: productsRes.data.length,
        lowStockProducts: lowStock.length,
      }));
    }

    if (subscribersRes.data) {
      setSubscribers(subscribersRes.data);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newSubs = subscribersRes.data.filter(s => new Date(s.subscribed_at) > oneWeekAgo);
      setStats(prev => ({
        ...prev,
        totalSubscribers: subscribersRes.data.length,
        newSubscribersThisWeek: newSubs.length,
      }));
    }

    setIsLoading(false);
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const updateData: Record<string, unknown> = { status };
    if (status === "shipped") {
      updateData.shipped_at = new Date().toISOString();
    } else if (status === "delivered") {
      updateData.delivered_at = new Date().toISOString();
    }

    const { error } = await supabase.from("orders").update(updateData).eq("id", id);
    if (error) {
      safeToastError(error);
      return;
    }

    toast.success("Order status updated");
    fetchData();

    if (['shipped', 'delivered', 'confirmed', 'arrived', 'processing'].includes(status.toLowerCase())) {
      try {
        await supabase.functions.invoke('send-order-status-update', {
          body: {
            orderId: order.id,
            userEmail: order.user_email,
            userName: order.user_name || 'Valued Customer',
            newStatus: status,
            totalAmount: order.total_amount,
            currency: 'GBP'
          }
        });
        toast.success(`Email notification sent`);
      } catch (emailError) {
        console.error("Error sending status email:", emailError);
      }
    }
  };

  const getOrdersByDate = () => {
    const last7Days: Record<string, number> = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toLocaleDateString('en-GB', { weekday: 'short' });
      last7Days[key] = 0;
    }

    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      const diffTime = today.getTime() - orderDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 7) {
        const key = orderDate.toLocaleDateString('en-GB', { weekday: 'short' });
        if (last7Days[key] !== undefined) {
          last7Days[key]++;
        }
      }
    });

    return Object.entries(last7Days).map(([day, count]) => ({ day, orders: count }));
  };

  const getOrderStatusDistribution = () => {
    const statusCounts: Record<string, number> = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-forest" />
      </div>
    );
  }

  if (!isStaff) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest text-white">
              {getRoleIcon()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{getRoleTitle()} Dashboard</h1>
              <p className="text-sm text-muted-foreground">{getRoleDescription()}</p>
            </div>
            <Badge variant="outline" className="capitalize text-forest border-forest">
              {userRole}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {canViewOrders && (
              <>
                <Card className="border-l-4 border-l-forest">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-forest" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.pendingOrders} pending
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">£{stats.totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      From {stats.completedOrders} completed orders
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
            {canViewProducts && (
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.lowStockProducts} low stock
                  </p>
                </CardContent>
              </Card>
            )}
            {canViewSubscribers && (
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                  <Mail className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.newSubscribersThisWeek} this week
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <Tabs defaultValue={canViewOrders ? "orders" : canViewAnalytics ? "analytics" : "chat"} className="w-full">
            <TabsList className="mb-6 flex-wrap">
              {canViewAnalytics && (
                <TabsTrigger value="analytics" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
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
              <TabsTrigger value="chat" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Team Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Orders This Week</CardTitle>
                    <CardDescription>Daily order volume for the past 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getOrdersByDate()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                          <XAxis dataKey="day" stroke="#888" fontSize={12} />
                          <YAxis stroke="#888" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e5e5',
                              borderRadius: '8px'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="orders"
                            stroke="#1A3C34"
                            fill="#1A3C34"
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Status Distribution</CardTitle>
                    <CardDescription>Current order status breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getOrderStatusDistribution()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getOrderStatusDistribution().map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Completed</p>
                          <p className="text-xl font-bold text-green-600">{stats.completedOrders}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg">
                        <Clock className="h-8 w-8 text-amber-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Pending</p>
                          <p className="text-xl font-bold text-amber-600">{stats.pendingOrders}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                        <Package className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Products</p>
                          <p className="text-xl font-bold text-blue-600">{stats.totalProducts}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                        <TrendingUp className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">New Subs</p>
                          <p className="text-xl font-bold text-purple-600">+{stats.newSubscribersThisWeek}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Orders Management</CardTitle>
                  <CardDescription>View and manage customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.slice(0, 20).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-sm">
                              {order.id.slice(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{order.user_name || "Guest"}</p>
                                <p className="text-sm text-muted-foreground">{order.user_email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">£{Number(order.total_amount).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{order.payment_method}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === "delivered" || order.status === "completed"
                                    ? "default"
                                    : order.status === "pending"
                                      ? "secondary"
                                      : "outline"
                                }
                                className={
                                  order.status === "delivered" || order.status === "completed"
                                    ? "bg-green-500"
                                    : order.status === "shipped"
                                      ? "bg-blue-500 text-white"
                                      : ""
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
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
                                <option value="arrived">Arrived</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Products Overview</CardTitle>
                  <CardDescription>View product inventory and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>£{product.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <span className={product.stock_quantity < 10 ? "text-red-500 font-medium" : ""}>
                                {product.stock_quantity}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={product.is_active ? "default" : "secondary"}>
                                {product.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscribers">
              <Card>
                <CardHeader>
                  <CardTitle>Newsletter Subscribers</CardTitle>
                  <CardDescription>Manage your subscriber list</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Subscribed Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribers.map((subscriber) => (
                          <TableRow key={subscriber.id}>
                            <TableCell className="font-medium">{subscriber.email}</TableCell>
                            <TableCell>{new Date(subscriber.subscribed_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                                {subscriber.is_active ? "Active" : "Unsubscribed"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <AdminChat />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StaffDashboard;
