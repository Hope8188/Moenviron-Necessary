import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, ShoppingCart, Target, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProductStat {
  product_id: string;
  product_name: string;
  views: number;
  add_to_cart: number;
  purchases: number;
  revenue: number;
  conversion_rate: number;
}

export function ProductPerformance() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ProductStat[]>([]);

  useEffect(() => {
    fetchProductStats();
  }, []);

  const fetchProductStats = async () => {
    try {
      setIsLoading(true);
      
      // Get aggregated stats from product_performance_stats
      const { data: perfData, error: perfError } = await supabase
        .from('product_performance_stats')
        .select('product_id, views, add_to_cart, purchases, revenue');

      if (perfError) {
        console.error('Error fetching product stats:', perfError);
        setIsLoading(false);
        return;
      }

      if (!perfData || perfData.length === 0) {
        setStats([]);
        setIsLoading(false);
        return;
      }

      // Aggregate stats by product_id
      const aggregated: Record<string, { views: number; add_to_cart: number; purchases: number; revenue: number }> = {};
      
      perfData.forEach(row => {
        if (!aggregated[row.product_id]) {
          aggregated[row.product_id] = { views: 0, add_to_cart: 0, purchases: 0, revenue: 0 };
        }
        aggregated[row.product_id].views += row.views || 0;
        aggregated[row.product_id].add_to_cart += row.add_to_cart || 0;
        aggregated[row.product_id].purchases += row.purchases || 0;
        aggregated[row.product_id].revenue += Number(row.revenue) || 0;
      });

      // Convert to array with calculated conversion rate
      const statsArray: ProductStat[] = Object.entries(aggregated).map(([product_id, data]) => ({
        product_id,
        product_name: `Product ${product_id.slice(0, 8)}...`,
        views: data.views,
        add_to_cart: data.add_to_cart,
        purchases: data.purchases,
        revenue: data.revenue,
        conversion_rate: data.views > 0 ? (data.purchases / data.views) * 100 : 0
      }));

      // Sort by views descending
      statsArray.sort((a, b) => b.views - a.views);
      
      setStats(statsArray);
    } catch (error) {
      console.error('Error in fetchProductStats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Total Product Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.reduce((acc, s) => acc + s.views, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Total Cart Adds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.reduce((acc, s) => acc + s.add_to_cart, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Average Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.reduce((acc, s) => acc + s.conversion_rate, 0) / (stats.length || 1)).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Performance Breakdown</CardTitle>
          <CardDescription>
            Tracking views, cart adds, purchases, and revenue per product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Cart Adds</TableHead>
                <TableHead className="text-right">Purchases</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Conversion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat) => (
                <TableRow key={stat.product_id}>
                  <TableCell className="font-mono text-sm">{stat.product_id.slice(0, 8)}...</TableCell>
                  <TableCell className="text-right">{stat.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{stat.add_to_cart.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={stat.purchases > 0 ? "default" : "secondary"}>
                      {stat.purchases}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    £{stat.revenue.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-mono">{stat.conversion_rate.toFixed(1)}%</span>
                      {stat.conversion_rate > 10 && (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {stats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No product data tracked yet. Browse products to start tracking.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
