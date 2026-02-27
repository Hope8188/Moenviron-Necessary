import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from "recharts";
import { Leaf, ShoppingBag, Users, TrendingUp, Globe, Recycle, Loader2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

const ImpactMetric = ({ title, value, unit, icon: Icon, color }: any) => (
    <Card className="overflow-hidden border-none bg-zinc-50/50 backdrop-blur-md shadow-sm">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">{title}</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-2xl font-bold text-zinc-900">{value}</h3>
                        <span className="text-sm font-medium text-zinc-500">{unit}</span>
                    </div>
                </div>
                <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center shadow-inner`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </CardContent>
    </Card>
);

export const AdvancedAnalytics = () => {
    // Fetch live orders for revenue
    const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
        queryKey: ["admin-analytics-orders"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("orders")
                .select("total_amount, created_at, items")
                .order("created_at", { ascending: true });
            if (error) throw error;
            return data;
        },
    });

    // Fetch live page views for traffic
    const { data: pageViews = [], isLoading: isLoadingViews } = useQuery({
        queryKey: ["admin-analytics-views"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("page_views")
                .select("country, created_at")
                .limit(1000);
            if (error) throw error;
            return data;
        },
    });

    // Fetch product performance (might be empty if table just created)
    const { data: stats = [], error: statsError } = useQuery({
        queryKey: ["admin-analytics-stats"],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from("product_performance_stats")
                .select("*");
            if (error) throw error;
            return data;
        },
        retry: false,
    });

    if (isLoadingOrders || isLoadingViews) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#7CC38A]" />
            </div>
        );
    }

    // Process Revenue Data for Chart
    const dailyRevenue: Record<string, number> = {};
    orders.forEach((o: any) => {
        const date = new Date(o.created_at).toLocaleDateString('en-GB', { weekday: 'short' });
        dailyRevenue[date] = (dailyRevenue[date] || 0) + o.total_amount;
    });

    const revenueChartData = Object.entries(dailyRevenue).map(([name, total]) => ({
        name,
        total,
        offset: (total * 0.05).toFixed(2) // Mock offset correlation for now
    }));

    // Process Country Data
    const countryCounts: Record<string, number> = {};
    pageViews.forEach((v: any) => {
        const country = v.country || "Other";
        countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    const topCountries = Object.entries(countryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([country, count]) => ({
            country,
            share: `${Math.round((count / pageViews.length) * 100)}%`,
            value: Math.round((count / pageViews.length) * 100)
        }));

    // Total Calculations
    const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.total_amount, 0);
    const cartCount = stats.reduce((sum: number, s: any) => sum + (s.add_to_cart || 0), 0);

    return (
        <div className="space-y-8 p-1">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-display font-medium">Command Center</h2>
                        <p className="text-muted-foreground font-light text-sm md:text-base">Real-time narrative of your circular impact and business health.</p>
                    </div>
                    {statsError && (
                        <Badge variant="destructive" className="animate-pulse">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Tracking Tables Missing
                        </Badge>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <ImpactMetric title="Net Revenue" value={`£${totalRevenue.toLocaleString()}`} unit="+100%" icon={TrendingUp} color="bg-zinc-900" />
                <ImpactMetric title="Cart Additions" value={cartCount} unit="items" icon={ShoppingBag} color="bg-[#7CC38A]" />
                <ImpactMetric title="Circular Views" value={pageViews.length} unit="sessions" icon={Users} color="bg-blue-500" />
                <ImpactMetric title="CO₂ Prevented" value={(totalRevenue * 0.1).toFixed(1)} unit="kg" icon={Leaf} color="bg-[#2D5A43]" />
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Revenue Velocity</CardTitle>
                        <CardDescription>Sales processed via Stripe Live.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] w-full pt-4">
                        {revenueChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueChartData}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2D5A43" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2D5A43" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#2D5A43" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground italic">
                                Awaiting first successful transaction...
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Eco-Traffic Heatmap</CardTitle>
                        <CardDescription>Geographic distribution of sustainablity seekers.</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-8">
                        <div className="space-y-5">
                            {topCountries.length > 0 ? topCountries.map((item) => (
                                <div key={item.country} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-light">{item.country}</span>
                                        <span className="font-bold text-[#7CC38A]">{item.share}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.value}%` }}
                                            className="h-full bg-[#7CC38A]"
                                        />
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 text-zinc-400">Capturing global traffic...</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-zinc-900 text-white overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Recycle className="h-5 w-5 text-[#7CC38A]" />
                        Circular Funnel Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-2">Discovery</p>
                            <p className="text-3xl font-bold">{pageViews.length}</p>
                            <p className="text-xs text-zinc-400 mt-1">Unique Page Loads</p>
                        </div>
                        <div>
                            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-2">Intent</p>
                            <p className="text-3xl font-bold text-[#7CC38A]">{cartCount}</p>
                            <p className="text-xs text-zinc-400 mt-1">Added to Cart</p>
                        </div>
                        <div>
                            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-2">Conversion</p>
                            <p className="text-3xl font-bold">{orders.length}</p>
                            <p className="text-xs text-zinc-400 mt-1">Successful Orders</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
