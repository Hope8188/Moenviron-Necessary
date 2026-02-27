import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Message {
  id: string;
  sender_id: string;
  recipient_id?: string | null;
  content: string;
  created_at: string;
  sender_email?: string;
  sender_name?: string;
}

interface AdminUser {
  user_id: string;
  email?: string;
  full_name?: string;
  role: string;
}

export function AdminChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<AdminUser | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAdminUsers();
    fetchMessages();

    const channel = supabase
      .channel("admin_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "admin_messages",
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          
          const isRelevant = !newMessage.recipient_id || 
                            newMessage.sender_id === user?.id || 
                            newMessage.recipient_id === user?.id;
          
          if (!isRelevant) return;

          // Fetch sender info for the new message
          const { data: profile } = await (supabase as any)
            .from("profiles")
            .select("email, full_name")
            .eq("user_id", newMessage.sender_id)
            .single();
          
          setMessages((prev) => [
            ...prev,
            {
              ...newMessage,
              sender_email: profile?.email,
              sender_name: profile?.full_name,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedRecipient, user?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchAdminUsers = async () => {
    try {
      const { data: roles, error } = await (supabase as any)
        .from("user_roles")
        .select("user_id, role");

      if (error) throw error;

      const userIds = (roles || []).map((r: any) => r.user_id).filter((id: string) => id !== user?.id);
      const { data: profiles } = await (supabase as any)
        .from("profiles")
        .select("user_id, email, full_name")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));

      const formattedUsers = (roles || [])
        .filter((r: any) => r.user_id !== user?.id)
        .map((r: any) => {
          const profile = profileMap.get(r.user_id) as any;
          return {
            user_id: r.user_id,
            role: r.role,
            email: profile?.email,
            full_name: profile?.full_name,
          };
        });

      setAdminUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching admin users:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      let query = (supabase as any)
        .from("admin_messages")
        .select("*");

      if (selectedRecipient) {
        query = query.or(`and(sender_id.eq.${user?.id},recipient_id.eq.${selectedRecipient.user_id}),and(sender_id.eq.${selectedRecipient.user_id},recipient_id.eq.${user?.id})`);
      } else {
        query = query.is("recipient_id", null);
      }

      const { data: msgs, error } = await query
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) throw error;

      const senderIds = [...new Set((msgs || []).map((m: any) => m.sender_id))];
      const { data: profiles } = await (supabase as any)
        .from("profiles")
        .select("user_id, email, full_name")
        .in("user_id", senderIds);

      const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));

      const formattedMessages = (msgs || []).map((m: any) => {
        const profile = profileMap.get(m.sender_id) as any;
        return {
          ...m,
          sender_email: profile?.email,
          sender_name: profile?.full_name,
        };
      });

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || isSending) return;

    setIsSending(true);
    try {
      const { error } = await (supabase as any)
        .from("admin_messages")
        .insert({
          sender_id: user.id,
          recipient_id: selectedRecipient?.user_id || null,
          content: newMessage.trim(),
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (email?: string, name?: string) => {
    if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase();
    if (email) return email[0].toUpperCase();
    return "A";
  };

  return (
    <Card className="flex flex-col h-[600px] border-none shadow-none md:border md:shadow-sm overflow-hidden">
      <CardHeader className="border-b pb-4 flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-primary" />
          {selectedRecipient ? `Chat with ${selectedRecipient.full_name || selectedRecipient.email}` : "Global Admin Chat"}
        </CardTitle>
        {selectedRecipient && (
          <Button variant="ghost" size="sm" onClick={() => setSelectedRecipient(null)}>
            Back to Global
          </Button>
        )}
      </CardHeader>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - User List */}
        <div className="w-64 border-r bg-muted/30 hidden md:block overflow-y-auto">
          <div className="p-3 border-b">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Team Members</h3>
          </div>
          <div className="p-2 space-y-1">
            <button
              onClick={() => setSelectedRecipient(null)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                !selectedRecipient ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                G
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Global Chat</p>
                <p className="text-xs opacity-70 truncate">All admins</p>
              </div>
            </button>

            {adminUsers.map((u) => (
              <button
                key={u.user_id}
                onClick={() => setSelectedRecipient(u)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                  selectedRecipient?.user_id === u.user_id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted-foreground/20 text-muted-foreground text-xs">
                    {getInitials(u.email, u.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.full_name || u.email?.split("@")[0]}</p>
                  <p className="text-xs opacity-70 truncate capitalize">{u.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col h-full items-center justify-center text-muted-foreground space-y-2 py-20">
                <MessageSquare className="h-10 w-10 opacity-20" />
                <p className="text-sm italic">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isOwn = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                        <AvatarFallback className={isOwn ? "bg-primary text-primary-foreground text-xs" : "bg-muted text-xs"}>
                          {getInitials(msg.sender_email, msg.sender_name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-[80%]`}>
                        <div className="flex items-center gap-2 px-1 mb-1">
                          <span className="text-[10px] font-medium text-muted-foreground uppercase">
                            {isOwn ? "You" : (msg.sender_name || msg.sender_email?.split("@")[0] || "Admin")}
                          </span>
                          <span className="text-[10px] text-muted-foreground/60">
                            {format(new Date(msg.created_at), "HH:mm")}
                          </span>
                        </div>
                        
                        <div className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${
                          isOwn 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-muted text-foreground rounded-tl-none"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                placeholder={selectedRecipient ? `Message ${selectedRecipient.full_name || selectedRecipient.email}...` : "Message global chat..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
