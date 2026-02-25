import { safeToastError } from '@/lib/error-handler';
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, Package, MapPin, Loader2, Calendar, DollarSign, ExternalLink } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  currency: string;
  payment_method: string;
  items: unknown;
}

const Profile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Kenya");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfileAndOrders();
    }
  }, [user]);

  const fetchProfileAndOrders = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile fetch error:", profileError);
      }

      if (profileData) {
        setProfile(profileData as Profile);
        setFullName(profileData.full_name || "");
        setPhone(profileData.phone || "");
        setAddressLine1(profileData.address_line1 || "");
        setAddressLine2(profileData.address_line2 || "");
        setCity(profileData.city || "");
        setPostalCode(profileData.postal_code || "");
        setCountry(profileData.country || "Kenya");
      }

      // Fetch orders by email
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_email", user.email)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Orders fetch error:", ordersError);
      } else {
        setOrders(ordersData || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const profileData = {
        user_id: user.id,
        full_name: fullName,
        phone,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city,
        postal_code: postalCode,
        country,
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "user_id" });

      if (error) throw error;
      toast.success("Profile saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "failed":
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h1 className="mb-8 text-3xl font-bold text-foreground">My Account</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile & Address
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" />
                Order History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Saved Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+254 700 000 000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address1">Address Line 1</Label>
                    <Input
                      id="address1"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input
                      id="address2"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Nairobi"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="00100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Kenya"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isSaving} className="mt-4">
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Address"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="py-12 text-center">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
                      <p className="mt-4 text-muted-foreground">No orders yet</p>
                    </div>
                  ) : (
<div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="rounded-lg border border-border p-4 space-y-3 hover:border-primary/30 transition-colors"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {order.payment_method === "mpesa" ? "M-Pesa" : "Card"}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(order.created_at).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1 font-medium text-foreground">
                                  <DollarSign className="h-4 w-4" />
                                  {order.currency === "KES" ? "KSh" : "£"}
                                  {order.total_amount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <div className="text-sm text-muted-foreground flex-1">
                                <span className="font-mono text-xs text-primary">#{order.id.slice(0, 8).toUpperCase()}</span>
                                <span className="mx-2">•</span>
                                {Array.isArray(order.items) && order.items.map((item: { name?: string; quantity?: number }, i: number) => (
                                  <span key={i}>
                                    {item.name || "Item"} x{item.quantity || 1}
                                    {i < (order.items as unknown[]).length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </div>
                              <Link to={`/orders/${order.id}`}>
                                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                  Track Order
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;