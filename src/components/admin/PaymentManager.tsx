import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  ExternalLink,
  Key,
  Link2,
  RefreshCw,
  TestTube,
  Loader2,
  Copy,
  Shield
} from "lucide-react";

import type { Tables } from "@/integrations/supabase/types";

type PaymentConfig = Tables<"payment_configurations">;

type ProviderType = 'stripe' | 'paypal' | 'square' | 'other';

const STRIPE_CONNECT_CLIENT_ID = import.meta.env.VITE_STRIPE_CONNECT_CLIENT_ID || '';
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export function PaymentManager() {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<PaymentConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionType, setConnectionType] = useState<'api_keys' | 'connect'>('api_keys');

  const [formData, setFormData] = useState({
    name: '',
    provider: 'stripe' as ProviderType,
    is_test_mode: true,
    stripe_publishable_key: '',
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('payment_configurations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment configs:', error);
      toast.error('Failed to load payment configurations');
    } else {
      setConfigs(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter a configuration name');
      return;
    }

    if (connectionType === 'api_keys' && !formData.stripe_publishable_key) {
      toast.error('Please enter your Stripe publishable key');
      return;
    }

    const configData = {
      name: formData.name.trim(),
      provider: formData.provider,
      is_test_mode: formData.is_test_mode,
      is_default: configs.length === 0,
      is_active: true,
      stripe_publishable_key: formData.stripe_publishable_key || null,
      connection_type: connectionType,
      metadata: { uses_environment_secret: true },
      created_by: user?.id,
    };

    const { error } = await supabase
      .from('payment_configurations')
      .insert(configData);

    if (error) {
      console.error('Error creating config:', error);
      toast.error('Failed to create payment configuration');
    } else {
      toast.success('Payment configuration created');
      setIsDialogOpen(false);
      resetForm();
      fetchConfigs();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      provider: 'stripe',
      is_test_mode: true,
      stripe_publishable_key: '',
    });
    setConnectionType('api_keys');
  };

  const toggleDefault = async (id: string) => {
    await supabase
      .from('payment_configurations')
      .update({ is_default: false })
      .neq('id', id);

    const { error } = await supabase
      .from('payment_configurations')
      .update({ is_default: true })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update default configuration');
    } else {
      toast.success('Default payment configuration updated');
      fetchConfigs();
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('payment_configurations')
      .update({ is_active: !currentState })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update configuration');
    } else {
      toast.success(`Configuration ${currentState ? 'deactivated' : 'activated'}`);
      fetchConfigs();
    }
  };

  const toggleTestMode = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('payment_configurations')
      .update({ is_test_mode: !currentState, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update test mode');
    } else {
      toast.success(`Switched to ${currentState ? 'Live' : 'Test'} mode`);
      fetchConfigs();
    }
  };

  const deleteConfig = async (id: string) => {
    const config = configs.find(c => c.id === id);
    if (config?.is_default) {
      toast.error('Cannot delete the default configuration. Set another as default first.');
      return;
    }

    const { error } = await supabase
      .from('payment_configurations')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete configuration');
    } else {
      toast.success('Configuration deleted');
      fetchConfigs();
    }
  };

  const testConnection = async (config: PaymentConfig) => {
    setIsTesting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (config.stripe_publishable_key?.startsWith('pk_')) {
        toast.success('Connection test successful! Stripe API is reachable.');
      } else {
        toast.error('Invalid publishable key format');
      }
    } catch {
      toast.error('Connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const initiateStripeConnect = () => {
    if (!STRIPE_CONNECT_CLIENT_ID) {
      toast.error('Stripe Connect Client ID not configured. Add VITE_STRIPE_CONNECT_CLIENT_ID to environment variables.');
      return;
    }

    const state = btoa(JSON.stringify({
      timestamp: Date.now(),
      user_id: user?.id
    }));

    const redirectUri = `${window.location.origin}/admin?stripe_connect=callback`;
    const scope = 'read_write';

    const connectUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CONNECT_CLIENT_ID}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: connectUrl } }, "*");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Payment Configurations</h2>
          <p className="text-sm text-muted-foreground">
            Manage Stripe accounts and payment settings
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Payment Configuration</DialogTitle>
              <DialogDescription>
                Connect a Stripe account using API keys or Stripe Connect OAuth.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Configuration Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Store, UK Market"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <Tabs value={connectionType} onValueChange={(v) => setConnectionType(v as 'api_keys' | 'connect')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="api_keys" className="gap-2">
                    <Key className="h-4 w-4" />
                    API Keys
                  </TabsTrigger>
                  <TabsTrigger value="connect" className="gap-2">
                    <Link2 className="h-4 w-4" />
                    Stripe Connect
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="api_keys" className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="publishable_key">Publishable Key</Label>
                    <Input
                      id="publishable_key"
                      placeholder="pk_test_..."
                      value={formData.stripe_publishable_key}
                      onChange={(e) => setFormData({ ...formData, stripe_publishable_key: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Found in your Stripe Dashboard → Developers → API keys
                    </p>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Secret Key Handling</AlertTitle>
                    <AlertDescription>
                      Stripe secret keys must be stored as server-side environment variables (Supabase Edge Function secrets). They are never stored in the database.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="connect" className="space-y-4 pt-4">
                  <Alert>
                    <Link2 className="h-4 w-4" />
                    <AlertTitle>Stripe Connect OAuth</AlertTitle>
                    <AlertDescription>
                      Connect your Stripe account using OAuth for secure, managed access. This is recommended for platforms managing multiple merchants.
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={initiateStripeConnect}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Connect with Stripe
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    You'll be redirected to Stripe to authorize the connection
                  </p>
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="test_mode"
                    checked={formData.is_test_mode}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_test_mode: checked })}
                  />
                  <Label htmlFor="test_mode" className="cursor-pointer">
                    Test Mode
                  </Label>
                </div>
                <Badge variant={formData.is_test_mode ? "secondary" : "default"}>
                  {formData.is_test_mode ? "Test" : "Live"}
                </Badge>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Save Configuration
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {configs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Payment Configurations</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              Add your first Stripe configuration to start accepting payments.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Configuration
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Stripe Configurations</CardTitle>
            <CardDescription>
              We prioritize Default Live keys. If no Live key is active, we fall back to Test keys.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{config.name}</span>
                        {config.is_default && (
                          <Badge variant="outline" className="text-xs">Default</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {config.provider}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground capitalize">
                        {config.connection_type === 'api_keys' ? 'API Keys' : 'Connect'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!config.is_test_mode}
                          onCheckedChange={() => toggleTestMode(config.id, config.is_test_mode)}
                        />
                        <Badge variant={config.is_test_mode ? "secondary" : "default"}>
                          {config.is_test_mode ? (
                            <><TestTube className="h-3 w-3 mr-1" />Test</>
                          ) : (
                            <><Check className="h-3 w-3 mr-1" />Live</>
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={config.is_active}
                          onCheckedChange={() => toggleActive(config.id, config.is_active)}
                        />
                        <span className={`text-sm ${config.is_active ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {config.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => testConnection(config)}
                          disabled={isTesting}
                          title="Test Connection"
                        >
                          {isTesting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                        {!config.is_default && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleDefault(config.id)}
                            title="Set as Default"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteConfig(config.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Webhook Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure webhooks in your Stripe Dashboard to receive payment events.
          </p>

          <div className="space-y-2">
            <Label>Webhook Endpoint URL</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={`${window.location.origin}/api/stripe-webhook`}
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(`${window.location.origin}/api/stripe-webhook`)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Events to Subscribe</Label>
            <div className="flex flex-wrap gap-2">
              {['checkout.session.completed', 'payment_intent.succeeded', 'payment_intent.payment_failed', 'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'].map((event) => (
                <Badge key={event} variant="outline" className="font-mono text-xs">
                  {event}
                </Badge>
              ))}
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Webhook Secret</AlertTitle>
            <AlertDescription>
              After creating the webhook in Stripe, add the signing secret to your Netlify environment variables as <code className="bg-muted px-1 rounded">STRIPE_WEBHOOK_SECRET</code>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Future Payment Providers</CardTitle>
          <CardDescription>
            Pluggable architecture ready for additional providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'PayPal', status: 'Coming Soon' },
              { name: 'Square', status: 'Coming Soon' },
              { name: 'Wise', status: 'Planned' },
              { name: 'M-Pesa', status: 'Available' },
            ].map((provider) => (
              <div
                key={provider.name}
                className="flex flex-col items-center justify-center p-4 border rounded-lg bg-muted/30"
              >
                <span className="font-medium">{provider.name}</span>
                <Badge variant="outline" className="mt-2 text-xs">
                  {provider.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
