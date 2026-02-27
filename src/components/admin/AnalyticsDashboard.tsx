import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, Users, Eye, Globe, Monitor, Smartphone, Tablet, MapPin, RefreshCw } from "lucide-react";

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  topPages: { path: string; count: number }[];
  visitsByDay: { date: string; count: number }[];
  visitorLocations: { location: string; country: string; count: number }[];
  recentVisitors: { created_at: string; page_path: string; country: string; city: string }[];
}

export function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const daysAgo = parseInt(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Fetch page views from database
      const { data: pageViews, error } = await supabase
        .from("page_views")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching page views:", error);
        // Set empty analytics if error
        setAnalytics({
          totalVisits: 0,
          uniqueVisitors: 0,
          topPages: [],
          deviceBreakdown: [],
          visitsByDay: [],
          visitorLocations: [],
          recentVisitors: [],
        });
        return;
      }

      const views = pageViews || [];

      // Calculate total visits
      const totalVisits = views.length;

      // Calculate unique visitors (by visitor_id or session_id)
      const uniqueIds = new Set(
        views.map((v: Record<string, unknown>) =>
          (v.visitor_id as string) || (v.session_id as string)
        ).filter(Boolean)
      );
      const uniqueVisitors = uniqueIds.size;

      // Calculate top pages
      const pageCounts: Record<string, number> = {};
      views.forEach((v: Record<string, unknown>) => {
        const path = v.page_path as string;
        pageCounts[path] = (pageCounts[path] || 0) + 1;
      });
      const topPages = Object.entries(pageCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Calculate visits by day
      const dayCounts: Record<string, number> = {};
      views.forEach((v: Record<string, unknown>) => {
        const date = new Date(v.created_at as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dayCounts[date] = (dayCounts[date] || 0) + 1;
      });
      const visitsByDay = Object.entries(dayCounts)
        .map(([date, count]) => ({ date, count }))
        .slice(-7);

      // Calculate visitor locations from country + city fields
      const locationCounts: Record<string, { country: string; count: number }> = {};
      views.forEach((v: Record<string, unknown>) => {
        const country = v.country as string;
        const city = v.city as string;
        if (city || country) {
          const location = city ? `${city}, ${country || 'Unknown'}` : (country || 'Unknown');
          if (!locationCounts[location]) {
            locationCounts[location] = { country: country || 'Unknown', count: 0 };
          }
          locationCounts[location].count++;
        }
      });
      const visitorLocations = Object.entries(locationCounts)
        .map(([location, data]) => ({ location, country: data.country, count: data.count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Recent visitors
      const recentVisitors = views.slice(0, 10).map((v: Record<string, unknown>) => ({
        created_at: v.created_at as string,
        page_path: v.page_path as string,
        country: (v.country as string) || 'Unknown',
        city: (v.city as string) || 'Unknown',
      }));

      setAnalytics({
        totalVisits,
        uniqueVisitors,
        topPages,
        visitsByDay,
        visitorLocations,
        recentVisitors,
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) return null;

  const maxVisits = Math.max(...(analytics.visitsByDay?.length > 0 ? analytics.visitsByDay.map((d) => d.count) : [1]), 1);
  const hasData = (analytics.totalVisits || 0) > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => fetchAnalytics(true)}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.totalVisits}</p>
                <p className="text-sm text-muted-foreground">Total Page Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-500/10 p-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.uniqueVisitors}</p>
                <p className="text-sm text-muted-foreground">Unique Visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-500/10 p-3">
                <Globe className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.visitorLocations?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Countries/Cities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.topPages?.length > 0 ? analytics.topPages[0].count : 0}</p>
                <p className="text-sm text-muted-foreground">Top Page Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-fit rounded-full bg-muted p-4 mb-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Analytics Data Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Analytics data will appear here as visitors browse your website. Enable Cloud to track page views, device types, and product interactions automatically.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Page Views Over Time</CardTitle>
              <CardDescription>Daily page visits</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.visitsByDay.length > 0 ? (
                <div className="space-y-2">
                  {analytics.visitsByDay.map((day) => (
                    <div key={day.date} className="flex items-center gap-3">
                      <span className="w-20 text-sm text-muted-foreground">{day.date}</span>
                      <div className="flex-1">
                        <div
                          className="h-6 rounded bg-primary/80 transition-all"
                          style={{ width: `${Math.max((day.count / maxVisits) * 100, 5)}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-sm font-medium">{day.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No visit data for this period</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.topPages.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topPages.map((page, i) => (
                    <div key={page.path} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium">{page.path}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{page.count} views</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No page data yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
              <CardDescription>Visitors by country</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.visitorLocations.length > 0 ? (
                <div className="space-y-3">
                  {[...new Map(analytics.visitorLocations.map(item => [item.country, item])).values()]
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 8)
                    .map((item) => (
                      <div key={item.country} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{item.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{item.count}</span>
                          <span className="text-xs text-muted-foreground">
                            ({analytics.totalVisits > 0 ? Math.round((item.count / analytics.totalVisits) * 100) : 0}%)
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No country data yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Visitor Locations
              </CardTitle>
              <CardDescription>Where your visitors are browsing from</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.visitorLocations.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {analytics.visitorLocations.map((item, i) => (
                    <div key={item.location} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="text-sm font-medium block truncate">{item.location}</span>
                        <span className="text-xs text-muted-foreground">{item.count} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No visitor location data yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
