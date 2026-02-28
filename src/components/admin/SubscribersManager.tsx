import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Search, Mail, Download, Trash2, UserPlus, Users, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MailerLiteIntegration } from "./MailerLiteIntegration";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  subscribed_at: string;
  source: string;
  is_active: boolean;
}

export function SubscribersManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({ email: "", name: "" });

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });
      if (error) throw error;
      return data as Subscriber[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ email, name }: { email: string; name: string }) => {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, name: name || null, source: "admin" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscribers"] });
      setIsAddDialogOpen(false);
      setNewSubscriber({ email: "", name: "" });
      toast.success("Subscriber added");
    },
    onError: (error: Error) => {
      if (error.message.includes("duplicate")) {
        toast.error("This email is already subscribed");
      } else {
        toast.error("Failed to add subscriber");
      }
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({
          is_active,
          unsubscribed_at: is_active ? null : new Date().toISOString()
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscribers"] });
      toast.success("Subscriber updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscribers"] });
      toast.success("Subscriber deleted");
    },
  });

  const exportToCSV = () => {
    if (!subscribers) return;
    const activeSubscribers = subscribers.filter(s => s.is_active);
    const csv = [
      "Email,Name,Subscribed At,Source",
      ...activeSubscribers.map(s =>
        `${s.email},${s.name || ""},${new Date(s.subscribed_at).toLocaleDateString()},${s.source}`
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to CSV");
  };

  const filteredSubscribers = subscribers?.filter(s =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeCount = subscribers?.filter(s => s.is_active).length || 0;
  const totalCount = subscribers?.length || 0;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-1">
        <MailerLiteIntegration />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCount}</p>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Active Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-full">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCount - activeCount}</p>
                <p className="text-sm text-muted-foreground">Unsubscribed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Newsletter Subscribers
            </CardTitle>
            <CardDescription>Manage your email list and export for campaigns</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Subscriber
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Subscriber</DialogTitle>
                  <DialogDescription>Manually add a subscriber to your list</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Email Address *</Label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={newSubscriber.email}
                      onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Name (optional)</Label>
                    <Input
                      placeholder="John Doe"
                      value={newSubscriber.name}
                      onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => addMutation.mutate(newSubscriber)}
                    disabled={!newSubscriber.email || addMutation.isPending}
                  >
                    {addMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Add Subscriber
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or name..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 font-medium text-sm">
              <div className="col-span-4">Email</div>
              <div className="col-span-2">Name</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            {filteredSubscribers?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No subscribers found
              </div>
            ) : (
              filteredSubscribers?.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="grid grid-cols-12 gap-4 p-3 border-t items-center text-sm"
                >
                  <div className="col-span-4 flex items-center gap-2">
                    <span className={subscriber.is_active ? "" : "text-muted-foreground line-through"}>
                      {subscriber.email}
                    </span>
                    {!subscriber.is_active && (
                      <Badge variant="secondary" className="text-xs">Unsubscribed</Badge>
                    )}
                  </div>
                  <div className="col-span-2 text-muted-foreground">
                    {subscriber.name || "-"}
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {subscriber.source}
                    </Badge>
                  </div>
                  <div className="col-span-2 text-muted-foreground">
                    {new Date(subscriber.subscribed_at).toLocaleDateString()}
                  </div>
                  <div className="col-span-2 flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActiveMutation.mutate({
                        id: subscriber.id,
                        is_active: !subscriber.is_active
                      })}
                      className={subscriber.is_active ? "text-orange-500 hover:text-orange-600" : "text-green-500 hover:text-green-600"}
                    >
                      {subscriber.is_active ? "Unsubscribe" : "Reactivate"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(subscriber.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
