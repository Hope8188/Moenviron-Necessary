import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "marketing" | "shipping" | "support" | "content" | "user";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  userRole: AppRole | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<AppRole | null>(null);

  const checkAdminRole = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      const role = data.role as AppRole;
      setUserRole(role);
      setIsAdmin(role === "admin" || ["marketing", "shipping", "support", "content"].includes(role));
    } else {
      setUserRole("user");
      setIsAdmin(false);
    }
  }, []);

  const ensureProfileExists = useCallback(async (authUser: User) => {
    // Create a minimal profile row on first login.
    // This enables backend triggers/policies that depend on profiles.
    const { data: existing, error: selectError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", authUser.id)
      .maybeSingle();

    if (selectError) return;

    if (!existing) {
      await supabase.from("profiles").insert({
        user_id: authUser.id,
        email: authUser.email ?? null,
        full_name:
          (authUser.user_metadata?.full_name as string | undefined) ??
          (authUser.user_metadata?.name as string | undefined) ??
          null,
      });
    }

    // NEW: Check for pending invitations and convert to roles
    try {
      console.log("Checking for pending invitations for:", authUser.email);
      const { data: invResult, error: invError } = await supabase.functions.invoke("maintenance", {
        body: {
          action: "check_invitation",
          email: authUser.email,
          target_user_id: authUser.id
        }
      });

      if (!invError && invResult?.role) {
        console.log("Invitation processed successfully:", invResult.role);
        // Refresh the local admin status after granting role
        await checkAdminRole(authUser.id);
      }
    } catch (err) {
      console.error("Invitation check failed:", err);
    }
  }, [checkAdminRole]);

  const refreshAdminStatus = useCallback(async () => {
    if (user) {
      await checkAdminRole(user.id);
    }
  }, [user, checkAdminRole]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            ensureProfileExists(session.user);
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setUserRole(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          ensureProfileExists(session.user);
          checkAdminRole(session.user.id);
        }, 0);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkAdminRole, ensureProfileExists]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAdmin, userRole, signIn, signUp, signOut, refreshAdminStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
