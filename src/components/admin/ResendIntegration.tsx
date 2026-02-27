import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Link2, CheckCircle2, XCircle, RefreshCw, ExternalLink, Eye, EyeOff, Send, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ResendSettings {
  api_key: string;
  from_email?: string;
  from_name?: string;
  connected: boolean;
  last_sync: string | null;
  synced_count: number;
}

export function ResendIntegration() {
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [cloudConnected, setCloudConnected] = useState<boolean | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["resend-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "resend")
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
        from_email: (content.from_email as string) || undefined,
        from_name: (content.from_name as string) || undefined,
        connected: (content.connected as boolean) || false,
        last_sync: (content.last_sync as string) || null,
        synced_count: (content.synced_count as number) || 0,
      } as ResendSettings;
    },
  });

  // Auto-check cloud connection on mount
  useEffect(() => {
    const checkCloudConnection = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("test-resend", {
          body: { action: "test" },
        });
        setCloudConnected(!error && data?.success);
      } catch {
        setCloudConnected(false);
      }
    };
    checkCloudConnection();
  }, []);

  const saveMutation = useMutation({
    mutationFn: async (newApiKey: string) => {
      const { error } = await supabase
        .from("site_content")
        .update({
          content: JSON.stringify({
            api_key: newApiKey,
            connected: !!newApiKey,
            last_sync: settings?.last_sync || null,
            synced_count: settings?.synced_count || 0,
          }),
          updated_at: new Date().toISOString(),
        })
        .eq("section_key", "resend");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resend-settings"] });
      setApiKey("");
      toast.success("Resend API key saved");
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
       const { data, error } = await supabase.functions.invoke("test-resend", {
        body: { action: "test" },
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success("Connection successful! Resend is ready to use.");
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
      toast.error("Please connect Resend first");
      return;
    }
    
    setIsSyncing(true);
    try {
       const { data, error } = await supabase.functions.invoke("test-resend", {
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
            }),
            updated_at: new Date().toISOString(),
          })
          .eq("section_key", "resend");
        
        if (!updateError) {
          queryClient.invalidateQueries({ queryKey: ["resend-settings"] });
        }
        
        toast.success(`Synced ${data.synced_count} subscribers to Resend`);
      } else {
        toast.error(data?.error || "Sync failed");
      }
    } catch {
      toast.error("Failed to sync subscribers");
    } finally {
      setIsSyncing(false);
    }
  };

  const disconnectResend = async () => {
    const { error } = await supabase
      .from("site_content")
      .update({
        content: JSON.stringify({
          api_key: "",
          connected: false,
          last_sync: null,
          synced_count: 0,
        }),
        updated_at: new Date().toISOString(),
      })
      .eq("section_key", "resend");
    
    if (error) {
      toast.error("Failed to disconnect");
    } else {
      queryClient.invalidateQueries({ queryKey: ["resend-settings"] });
      toast.success("Resend disconnected");
    }
  };

  const openResendDashboard = () => {
    window.parent.postMessage({ 
      type: "OPEN_EXTERNAL_URL", 
      data: { url: "https://resend.com/broadcasts" } 
    }, "*");
  };

  const sendTestEmail = async () => {
    if (!testEmail || !settings?.api_key) {
      toast.error("Please enter an email address");
      return;
    }
    
    setIsSendingTest(true);
    try {
       const { data, error } = await supabase.functions.invoke("test-resend", {
         body: { action: "send", to: testEmail },
      });
      
       if (error) throw error;
 
      if (data.success) {
        toast.success(`Test email sent to ${testEmail}!`);
        setTestEmail("");
      } else {
        toast.error(data.error || "Failed to send test email");
      }
     } catch {
      toast.error("Failed to send test email");
    } finally {
      setIsSendingTest(false);
    }
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
            <div className={`p-2 rounded-lg ${isConnected ? "bg-green-500/10" : "bg-muted"}`}>
              <Send className={`h-5 w-5 ${isConnected ? "text-green-500" : "text-muted-foreground"}`} />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                Resend Integration
                {isConnected ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
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
                Connect Resend to sync subscribers and send newsletters
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {cloudConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm font-medium text-green-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Resend is connected via Cloud secrets
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your RESEND_API_KEY is configured and ready to use.
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
                className="flex-1" 
                onClick={openResendDashboard}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Resend
              </Button>
            </div>

            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium">Send Test Email</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={sendTestEmail}
                  disabled={isSendingTest || !testEmail}
                  variant="secondary"
                >
                  {isSendingTest ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Send
                </Button>
              </div>
            </div>
          </div>
        ) : !isConnected ? (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-medium">How to get your Resend API Key:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Go to <span className="font-medium text-foreground">resend.com</span> and sign up/log in</li>
                <li>Navigate to <span className="font-medium text-foreground">API Keys</span> section</li>
                <li>Create a new API key with full access</li>
                <li>Copy and paste it below</li>
              </ol>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="re_xxxxxxxx..."
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
              <Button variant="outline" size="sm" onClick={disconnectResend}>
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
                <p className="text-sm text-muted-foreground">Synced Contacts</p>
                <p className="font-medium">{settings?.synced_count || 0}</p>
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
                onClick={openResendDashboard}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Resend Dashboard to Send Newsletters
              </Button>

              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-medium">Send Test Email</p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendTestEmail}
                    disabled={isSendingTest || !testEmail}
                    variant="secondary"
                  >
                    {isSendingTest ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    Send
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
              Subscribers will be available in Resend as Contacts. Use Resend's Broadcast feature to send newsletters.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
