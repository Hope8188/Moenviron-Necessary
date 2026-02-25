import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Link2, CheckCircle2, XCircle, RefreshCw, ExternalLink, Eye, EyeOff, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MailerLiteSettings {
  api_key: string;
  connected: boolean;
  last_sync: string | null;
  synced_count: number;
  group_id: string | null;
  group_name: string | null;
}

export function MailerLiteIntegration() {
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudConnected, setCloudConnected] = useState<boolean | null>(null);
  const [cloudGroupName, setCloudGroupName] = useState<string | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["mailerlite-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "mailerlite")
        .maybeSingle();
      if (error) throw error;
      if (!data?.content) return null;

      // Parse content which might be string or object
      let content: Record<string, unknown>;
      if (typeof data.content === 'string') {
        try {
          content = JSON.parse(data.content);
        } catch {
          return null;
        }
      } else {
        content = data.content as Record<string, unknown>;
      }

      return {
        api_key: (content.api_key as string) || "",
        connected: (content.connected as boolean) || false,
        last_sync: (content.last_sync as string) || null,
        synced_count: (content.synced_count as number) || 0,
        group_id: (content.group_id as string) || null,
        group_name: (content.group_name as string) || null,
      } as MailerLiteSettings;
    },
  });

  // Auto-check cloud connection on mount
  useEffect(() => {
    const checkCloudConnection = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("sync-to-mailerlite", {
          body: { action: "test" },
        });
        if (!error && data?.success) {
          setCloudConnected(true);
          setCloudGroupName(data.group_name || null);
        } else {
          setCloudConnected(false);
        }
      } catch {
        setCloudConnected(false);
      }
    };
    checkCloudConnection();
  }, []);

  const saveMutation = useMutation({
    mutationFn: async (newApiKey: string) => {
      const newSettings = {
        api_key: newApiKey,
        connected: !!newApiKey,
        last_sync: settings?.last_sync || null,
        synced_count: settings?.synced_count || 0,
        group_id: settings?.group_id || null,
        group_name: settings?.group_name || null,
      };

      const { data: existing } = await supabase
        .from("site_content")
        .select("id")
        .eq("section_key", "mailerlite")
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("site_content")
          .update({
            content: JSON.stringify(newSettings),
            updated_at: new Date().toISOString(),
          })
          .eq("section_key", "mailerlite");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_content")
          .insert({
            page_name: "integrations",
            section_key: "mailerlite",
            content: JSON.stringify(newSettings),
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mailerlite-settings"] });
      setApiKey("");
      toast.success("MailerLite API key saved");
    },
    onError: () => {
      toast.error("Failed to save API key");
    },
  });

  const testConnection = async () => {
    if (!settings?.api_key) {
      toast.error("Please save an API key first");
      return;
    }

    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-to-mailerlite", {
        body: { action: "test" },
      });

      if (error) throw error;

      if (data?.success) {
        if (data.group_id && data.group_name) {
          await supabase
            .from("site_content")
            .update({
              content: JSON.stringify({
                ...settings,
                group_id: data.group_id,
                group_name: data.group_name,
              }),
              updated_at: new Date().toISOString(),
            })
            .eq("section_key", "mailerlite");
          queryClient.invalidateQueries({ queryKey: ["mailerlite-settings"] });
        }
        toast.success(`Connected! Using group: ${data.group_name || "Default"}`);
      } else {
        toast.error(data?.error || "Connection failed");
      }
    } catch {
      toast.error("Failed to test connection");
    } finally {
      setIsTesting(false);
    }
  };

  const syncSubscribers = async () => {
    if (!settings?.api_key) {
      toast.error("Please connect MailerLite first");
      return;
    }

    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-to-mailerlite", {
        body: { action: "sync" },
      });

      if (error) throw error;

      if (data?.success) {
        const { error: updateError } = await supabase
          .from("site_content")
          .update({
            content: JSON.stringify({
              ...settings,
              last_sync: new Date().toISOString(),
              synced_count: data.synced_count || 0,
              group_id: data.group_id || settings?.group_id,
              group_name: data.group_name || settings?.group_name,
            }),
            updated_at: new Date().toISOString(),
          })
          .eq("section_key", "mailerlite");

        if (!updateError) {
          queryClient.invalidateQueries({ queryKey: ["mailerlite-settings"] });
        }

        toast.success(`Synced ${data.synced_count} subscribers to MailerLite`);
      } else {
        toast.error(data?.error || "Sync failed");
      }
    } catch {
      toast.error("Failed to sync subscribers");
    } finally {
      setIsSyncing(false);
    }
  };

  const disconnectMailerLite = async () => {
    const { error } = await supabase
      .from("site_content")
      .update({
        content: JSON.stringify({
          api_key: "",
          connected: false,
          last_sync: null,
          synced_count: 0,
          group_id: null,
          group_name: null,
        }),
        updated_at: new Date().toISOString(),
      })
      .eq("section_key", "mailerlite");

    if (error) {
      toast.error("Failed to disconnect");
    } else {
      queryClient.invalidateQueries({ queryKey: ["mailerlite-settings"] });
      toast.success("MailerLite disconnected");
    }
  };

  const openMailerLiteDashboard = () => {
    window.parent.postMessage({
      type: "OPEN_EXTERNAL_URL",
      data: { url: "https://dashboard.mailerlite.com/campaigns" }
    }, "*");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isConnected = cloudConnected || (settings?.connected && settings?.api_key);
  const maskedKey = settings?.api_key
    ? `${settings.api_key.slice(0, 8)}${"•".repeat(24)}`
    : "";

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isConnected ? "bg-emerald-500/10" : "bg-muted"}`}>
              <Mail className={`h-5 w-5 ${isConnected ? "text-emerald-500" : "text-muted-foreground"}`} />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                MailerLite Integration
                {isConnected ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {cloudConnected ? "Cloud Connected" : "Connected"}
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Connected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Sync newsletter subscribers with MailerLite groups
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {cloudConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-sm font-medium text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                MailerLite is connected via Cloud secrets
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your MAILERLITE_API_KEY is configured in Supabase and ready to sync.
                Target Group: <span className="font-semibold">{cloudGroupName || settings?.group_name || "Default"}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={testConnection}
                disabled={isTesting}
              >
                {isTesting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Test Connection
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={syncSubscribers}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Sync Now
              </Button>
            </div>

            <Button
              className="w-full"
              onClick={openMailerLiteDashboard}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open MailerLite Dashboard
            </Button>
          </div>
        ) : !isConnected ? (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-medium">How to connect MailerLite:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Go to <span className="font-medium text-foreground">mailerlite.com</span> and log in</li>
                <li>Navigate to <span className="font-medium text-foreground">Integrations {">"} API</span></li>
                <li>Generate and copy a new API token</li>
                <li>Paste it below to establish connection</li>
              </ol>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="Enter API Key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                onClick={() => saveMutation.mutate(apiKey)}
                disabled={!apiKey || saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Link2 className="h-4 w-4 mr-2" />
                )}
                Connect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">API Key</p>
                <p className="text-xs text-muted-foreground font-mono">{maskedKey}</p>
              </div>
              <Button variant="outline" size="sm" onClick={disconnectMailerLite}>
                Disconnect
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Last Synced</p>
                <p className="font-medium">
                  {settings?.last_sync
                    ? new Date(settings.last_sync).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : "Never"
                  }
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Target Group</p>
                <p className="font-medium truncate">{settings?.group_name || "Newsletter"}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={testConnection}
                disabled={isTesting}
              >
                {isTesting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Test Connection
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={syncSubscribers}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Sync Now
              </Button>
            </div>

            <Button
              className="w-full"
              onClick={openMailerLiteDashboard}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open MailerLite Dashboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
