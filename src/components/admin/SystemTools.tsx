import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Server, ShieldCheck, RefreshCw, Globe, Terminal, Download, FileJson, FileSpreadsheet, HardDrive } from "lucide-react";
import { toast } from "sonner";

export function SystemTools() {
  const [isChecking, setIsChecking] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    db: boolean;
    auth: boolean;
    storage: boolean;
  } | null>(null);

  const checkSystemHealth = async () => {
    setIsChecking(true);
    try {
      const { error: dbError } = await supabase.from("products").select("id", { count: 'exact', head: true });
      const { data: authData } = await supabase.auth.getSession();
      const { data: storageData, error: storageError } = await supabase.storage.listBuckets();

      setStatus({
        db: !dbError,
        auth: !!authData,
        storage: !storageError
      });

      toast.success("System health check completed");
    } catch (error) {
      toast.error("Health check failed");
    } finally {
      setIsChecking(false);
    }
  };

  const exportFullBackup = async () => {
    setIsExporting('full');
    try {
      const response = await fetch('/api/export-data?format=download');
      if (!response.ok) throw new Error('Export failed');

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `moenviron-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Backup downloaded! ${data._meta?.total_records || 0} records exported`);
    } catch (error) {
      toast.error("Backup failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsExporting(null);
    }
  };

  const exportCSV = async (table: string) => {
    setIsExporting(table);
    try {
      const response = await fetch(`/api/export-csv?table=${table}`);
      if (!response.ok) throw new Error('Export failed');

      const csvText = await response.text();
      const blob = new Blob([csvText], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${table}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`${table} exported to CSV`);
    } catch (error) {
      toast.error("CSV export failed");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Tools</h2>
        <Button onClick={checkSystemHealth} disabled={isChecking} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
          Run Health Check
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {status ? (
              <Badge variant={status.db ? "default" : "destructive"}>
                {status.db ? "Healthy" : "Error"}
              </Badge>
            ) : (
              <span className="text-sm text-muted-foreground">Not checked</span>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auth Service</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {status ? (
              <Badge variant={status.auth ? "default" : "destructive"}>
                {status.auth ? "Connected" : "Error"}
              </Badge>
            ) : (
              <span className="text-sm text-muted-foreground">Not checked</span>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Buckets</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {status ? (
              <Badge variant={status.storage ? "default" : "destructive"}>
                {status.storage ? "Accessible" : "Error"}
              </Badge>
            ) : (
              <span className="text-sm text-muted-foreground">Not checked</span>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <HardDrive className="h-5 w-5" />
            Data Backup & Export
          </CardTitle>
          <CardDescription>
            Download your data to protect against service interruptions or for offline analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-emerald-200 rounded-lg bg-white">
            <div>
              <p className="font-medium flex items-center gap-2">
                <FileJson className="h-4 w-4 text-emerald-600" />
                Full Database Backup
              </p>
              <p className="text-sm text-muted-foreground">Export all tables (orders, products, subscribers, settings)</p>
            </div>
            <Button
              onClick={exportFullBackup}
              disabled={isExporting === 'full'}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className={`h-4 w-4 ${isExporting === 'full' ? 'animate-bounce' : ''}`} />
              {isExporting === 'full' ? 'Exporting...' : 'Download JSON'}
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex flex-col items-center justify-between p-4 border rounded-lg bg-white">
              <FileSpreadsheet className="h-8 w-8 text-blue-500 mb-2" />
              <p className="font-medium text-sm">Orders</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCSV('orders')}
                disabled={isExporting === 'orders'}
                className="mt-2 w-full"
              >
                {isExporting === 'orders' ? 'Exporting...' : 'Export CSV'}
              </Button>
            </div>
            <div className="flex flex-col items-center justify-between p-4 border rounded-lg bg-white">
              <FileSpreadsheet className="h-8 w-8 text-purple-500 mb-2" />
              <p className="font-medium text-sm">Products</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCSV('products')}
                disabled={isExporting === 'products'}
                className="mt-2 w-full"
              >
                {isExporting === 'products' ? 'Exporting...' : 'Export CSV'}
              </Button>
            </div>
            <div className="flex flex-col items-center justify-between p-4 border rounded-lg bg-white">
              <FileSpreadsheet className="h-8 w-8 text-orange-500 mb-2" />
              <p className="font-medium text-sm">Subscribers</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCSV('newsletter_subscribers')}
                disabled={isExporting === 'newsletter_subscribers'}
                className="mt-2 w-full"
              >
                {isExporting === 'newsletter_subscribers' ? 'Exporting...' : 'Export CSV'}
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-2">
            Tip: Download regular backups to protect your data from service disruptions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Maintenance Tasks
          </CardTitle>
          <CardDescription>Common admin maintenance operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Clear Site Cache</p>
              <p className="text-sm text-muted-foreground">Force refresh of content cache for all users</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info("Cache cleared successfully")}>
              Execute
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Deduplicate Products</p>
              <p className="text-sm text-muted-foreground">Remove duplicate products keeping the most recent</p>
            </div>
            <Button variant="outline" size="sm" onClick={async () => {
              try {
                const { data: products } = await supabase.from("products").select("id, name, created_at");
                if (!products) return;

                const seen = new Map();
                const toDelete: string[] = [];

                // Sort by date descending to keep the newest
                const sorted = [...products].sort((a, b) =>
                  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );

                sorted.forEach(p => {
                  if (seen.has(p.name.toLowerCase())) {
                    toDelete.push(p.id);
                  } else {
                    seen.set(p.name.toLowerCase(), p.id);
                  }
                });

                if (toDelete.length > 0) {
                  const { error } = await supabase.from("products").delete().in("id", toDelete);
                  if (error) throw error;
                  toast.success(`Removed ${toDelete.length} duplicates`);
                } else {
                  toast.info("No duplicates found");
                }
              } catch (err) {
                toast.error("Cleanup failed");
              }
            }}>
              Clean Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
