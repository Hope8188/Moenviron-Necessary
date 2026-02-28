import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Eye,
  MapPin,
  Globe,
  TrendingUp,
  Clock,
  RefreshCw,
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { getAnalytics } from "@/services/analytics";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { format } from "date-fns";

export function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const analytics = await getAnalytics();
      setData(analytics);
    } catch (err: any) {
      console.error("Error fetching analytics:", err);
      setError(err?.message || "Failed to load analytics data. Check RLS policies on page_views table.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleClearAnalytics = async () => {
    if (!confirm("Are you sure you want to clear all analytics data? This cannot be undone.")) return;

    setClearing(true);
    try {
      const { error: delError } = await supabase
        .from("page_views")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all rows

      if (delError) {
        toast.error("Failed to clear analytics: " + delError.message);
      } else {
        toast.success("Analytics data cleared successfully");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to clear analytics data");
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground text-center max-w-md">{error}</p>
        <p className="text-xs text-muted-foreground">
          Ensure the SELECT RLS policy exists for authenticated users on page_views. Run the SQL fix script.
        </p>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  if (!data || data.totalViews === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Eye className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">No analytics data available yet.</p>
        <p className="text-xs text-muted-foreground">
          Page views will appear here as visitors browse the site.
        </p>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>
    );
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Calculate engagement rate based on returning visitors
  const returningVisitors = data.recentViews.filter((v: any, i: number, arr: any[]) =>
    arr.findIndex((x: any) => x.visitor_id === v.visitor_id) !== i
  ).length;
  const engagementRate = data.totalViews > 0
    ? ((returningVisitors / data.totalViews) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Last updated: {format(new Date(), 'MMM d, h:mm a')}
        </p>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            onClick={handleClearAnalytics}
            variant="outline"
            size="sm"
            className="gap-2 text-destructive hover:bg-destructive/10"
            disabled={clearing}
          >
            <Trash2 className="h-4 w-4" />
            {clearing ? 'Clearing...' : 'Clear Data'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time page views</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Based on visitor IDs</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Country</CardTitle>
            <Globe className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.topCountries[0]?.name || "N/A"}</div>
            <p className="text-xs text-muted-foreground">{data.topCountries[0]?.count || 0} visits</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementRate}%</div>
            <p className="text-xs text-muted-foreground">Returning visitors</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Traffic Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {data.recentViews.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.recentViews.slice(0, 7).reverse()}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="created_at"
                      tickFormatter={(val) => format(new Date(val), 'HH:mm')}
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelFormatter={(val) => format(new Date(val), 'MMM d, h:mm a')}
                    />
                    <Area type="monotone" dataKey="id" name="Views" stroke="#10b981" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No traffic data to display
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Visitor Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {data.topCountries.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.topCountries}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="name"
                    >
                      {data.topCountries.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No location data
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {data.topCountries.map((country: any, i: number) => (
                <div key={country.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground">
                      {country.name === "Unknown" ? "Unknown (geo blocked)" : country.name}
                    </span>
                  </div>
                  <span className="font-semibold">{country.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentViews.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No recent activity</p>
            )}
            {data.recentViews.slice(0, 5).map((view: any) => (
              <div key={view.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4 transition-all hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{view.page_path}</p>
                    <p className="text-xs text-muted-foreground">
                      {view.city || "Unknown"}, {view.country || "Unknown"} • {format(new Date(view.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {view.device_type === 'mobile' ? '📱' : '🖥️'} {view.region || "Direct"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
