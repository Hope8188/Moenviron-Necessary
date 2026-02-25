import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Users, Loader2, AlertCircle } from "lucide-react";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const StaffAuth = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin, userRole } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isLoading) {
      if (isAdmin && userRole && userRole !== "user") {
        navigate("/staff");
      }
    }
  }, [user, isLoading, isAdmin, userRole, navigate]);

  const validateForm = () => {
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleStaffSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setAuthError(null);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setIsSubmitting(false);
      if (error.message.includes("Invalid login credentials")) {
        setAuthError("Invalid email or password");
      } else {
        setAuthError(error.message);
      }
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .maybeSingle();
      
      if (roleData && roleData.role !== "user") {
        toast.success(`Welcome, ${roleData.role.charAt(0).toUpperCase() + roleData.role.slice(1)}!`);
        navigate("/staff");
      } else {
        await supabase.auth.signOut();
        setAuthError("Access denied. This account does not have staff privileges.");
      }
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center py-12">
        <div className="container max-w-md">
          <Card className="border-border/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Staff Portal</CardTitle>
              <CardDescription>
                Sign in with your staff credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {authError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleStaffSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="staff-email">Email</Label>
                  <Input
                    id="staff-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@example.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="staff-password">Password</Label>
                  <Input
                    id="staff-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-forest hover:bg-forest/90" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In as Staff"
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Admin access?{" "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/admin-login")}>
                    Go to Admin Portal
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StaffAuth;
