import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { safeToastError } from "@/lib/error-handler";
import {
  Loader2, UserPlus, Trash2, Mail, Shield, Briefcase, Clock, CheckCircle2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type AppRole = "admin" | "moderator" | "marketing" | "shipping" | "support" | "content" | "user";

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  responsibilities: string | null;
  created_at: string;
  status: 'active' | 'pending';
}

interface PendingInvitation {
  email: string;
  role: AppRole;
  responsibilities: string | null;
  created_at: string;
  invited_by: string;
}

export function AdminUserManager() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("admin");
  const [responsibilities, setResponsibilities] = useState("");

  const { data: admins, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // 1. Get active admins
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("id, user_id, role, responsibilities, created_at")
        .neq("role", "user");

      if (error) throw error;

      let activeAdmins: AdminUser[] = [];

      if (roles && roles.length > 0) {
        // Get profile information for these users
        const userIds = roles.map((r) => r.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, email, full_name")
          .in("user_id", userIds);

        const profileMap = new Map(
          (profiles || []).map((p) => [p.user_id, p])
        );

        activeAdmins = roles.map((role) => {
          const profile = profileMap.get(role.user_id);
          return {
            id: role.id,
            user_id: role.user_id,
            email: profile?.email || "Unknown",
            full_name: profile?.full_name || null,
            role: role.role as AppRole,
            responsibilities: (role as any).responsibilities || null,
            created_at: role.created_at,
            status: 'active'
          };
        });
      }

      // 2. Get pending invitations
      const { data: inviteData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "pending_invitations")
        .maybeSingle();

      let pendingAdmins: AdminUser[] = [];

      if (inviteData?.content) {
        try {
          // Handle both string and object content
          const content = typeof inviteData.content === 'string'
            ? JSON.parse(inviteData.content)
            : inviteData.content;

          const invitations = (Array.isArray(content) ? content : []) as PendingInvitation[];

          pendingAdmins = invitations.map((invite, index) => ({
            id: `invite-${index}`,
            user_id: `pending-${index}`,
            email: invite.email,
            full_name: null,
            role: invite.role,
            responsibilities: invite.responsibilities,
            created_at: invite.created_at,
            status: 'pending'
          }));
        } catch (e) {
          console.error("Failed to parse invitations", e);
        }
      }

      // 3. Combine both lists
      return [...activeAdmins, ...pendingAdmins].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });

  const addAdminMutation = useMutation({
    mutationFn: async ({
      userEmail,
      role,
      resp
    }: { userEmail: string; role: AppRole; resp: string }) => {
      const emailLower = userEmail.toLowerCase();

      // 1. Check if user exists in profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", emailLower)
        .maybeSingle();

      if (profile) {
        // User exists - check if they already have this role
        const { data: existingRole } = await supabase
          .from("user_roles")
          .select("id")
          .eq("user_id", profile.user_id)
          .eq("role", role)
          .maybeSingle();

        if (existingRole) {
          throw new Error("User already has this role");
        }

        // Assign role
        const { error } = await supabase
          .from("user_roles")
          .insert({
            user_id: profile.user_id,
            role: role,
            responsibilities: resp || null,
          } as any);

        if (error) throw error;
        return { success: true, type: 'assigned' };
      } else {
        // User does not exist - create invitation
        // First get existing invitations
        const { data: inviteData } = await supabase
          .from("site_content")
          .select("content, id")
          .eq("section_key", "pending_invitations")
          .maybeSingle();

        let invitations: PendingInvitation[] = [];
        let rowId = inviteData?.id;

        if (inviteData?.content) {
          try {
            const content = typeof inviteData.content === 'string'
              ? JSON.parse(inviteData.content)
              : inviteData.content;
            invitations = Array.isArray(content) ? content : [];
          } catch (e) {
            invitations = [];
          }
        }

        // Check if already invited
        if (invitations.some(i => i.email.toLowerCase() === emailLower && i.role === role)) {
          throw new Error("User already has a pending invitation for this role");
        }

        const { data: currentUser } = await supabase.auth.getUser();

        const newInvite: PendingInvitation = {
          email: emailLower,
          role,
          responsibilities: resp || null,
          created_at: new Date().toISOString(),
          invited_by: currentUser.user?.id || 'system'
        };

        const newContent = [...invitations, newInvite];

        if (rowId) {
          // Update existing row
          const { error } = await supabase
            .from("site_content")
            .update({
              content: JSON.stringify(newContent),
              updated_at: new Date().toISOString()
            })
            .eq("id", rowId);
          if (error) throw error;
        } else {
          // Create new row
          const { error } = await supabase
            .from("site_content")
            .insert({
              section_key: "pending_invitations",
              page_name: "admin",
              content: JSON.stringify(newContent)
            });
          if (error) throw error;
        }

        // Send email notification
        try {
          const { error: fnError } = await supabase.functions.invoke("send-invite-email", {
            body: {
              email: emailLower,
              role,
              responsibilities: resp
            }
          });
          if (fnError) {
            console.error("Failed to send invite email:", fnError);
            toast.error("Invitation saved but email delivery failed.");
          }
        } catch (emailError) {
          console.error("Failed to send invite email:", emailError);
        }

        return { success: true, type: 'invited' };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["site-content", "pending_invitations"] });
      if (data.type === 'assigned') {
        toast.success("Role assigned successfully");
      } else {
        toast.success("Invitation sent successfully");
      }
      setEmail("");
      setResponsibilities("");
    },
    onError: (error) => {
      safeToastError(error);
    },
  });

  const removeAdminMutation = useMutation({
    mutationFn: async (admin: AdminUser) => {
      if (admin.status === 'active') {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("id", admin.id);
        if (error) throw error;
      } else {
        // Remove from pending invitations
        const { data: inviteData } = await supabase
          .from("site_content")
          .select("content, id")
          .eq("section_key", "pending_invitations")
          .maybeSingle();

        if (inviteData?.content) {
          const invitations = typeof inviteData.content === 'string'
            ? JSON.parse(inviteData.content)
            : inviteData.content;

          const newInvitations = invitations.filter((i: any) =>
            !(i.email.toLowerCase() === admin.email.toLowerCase() && i.role === admin.role)
          );

          const { error } = await supabase
            .from("site_content")
            .update({
              content: JSON.stringify(newInvitations),
              updated_at: new Date().toISOString()
            })
            .eq("id", inviteData.id);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["site-content", "pending_invitations"] });
      toast.success("Administrator role removed");
    },
    onError: (error) => {
      safeToastError(error);
    },
  });

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    addAdminMutation.mutate({ userEmail: email, role: selectedRole, resp: responsibilities });
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case "admin": return "default";
      case "moderator": return "outline";
      case "marketing": return "secondary";
      case "shipping": return "secondary";
      case "support": return "secondary";
      case "content": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Admin Role
          </CardTitle>
          <CardDescription>
            Assign administrative roles by email. If the user doesn't have an account, they will be invited.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Admin Role</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">Responsibilities</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="responsibilities"
                  placeholder="Describe this admin's responsibilities..."
                  className="pl-9 min-h-[80px]"
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto" disabled={addAdminMutation.isPending}>
              {addAdminMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign / Invite
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Administrators
          </CardTitle>
          <CardDescription>
            A list of all users with administrative privileges. Pending users are shown with a clock icon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin / Role</TableHead>
                    <TableHead>Responsibilities</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined / Invited</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins?.map((admin) => (
                    <TableRow key={`${admin.id}-${admin.role}`}>
                      <TableCell className="font-medium align-top">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold truncate max-w-[200px]" title={admin.email}>
                            {admin.email}
                          </div>
                          <Badge variant={getRoleBadgeVariant(admin.role)} className="text-[10px] font-bold uppercase tracking-wider">
                            {admin.role.replace("_", " ")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[250px] text-sm text-muted-foreground align-top">
                        {admin.responsibilities || "No specific responsibilities assigned."}
                      </TableCell>
                      <TableCell className="align-top">
                        {admin.status === 'active' ? (
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground align-top whitespace-nowrap">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right align-top">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAdminMutation.mutate(admin)}
                          disabled={removeAdminMutation.isPending}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          title="Remove role or invitation"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {admins?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No administrators found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
