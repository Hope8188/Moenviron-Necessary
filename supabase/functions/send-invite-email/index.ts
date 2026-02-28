// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface InviteRequest {
  email: string;
  role: string;
  responsibilities?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase configuration");
    }

    const { email, role, responsibilities }: InviteRequest = await req.json();

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Call Supabase's native invite API
    // This sends an email using the built-in Supabase auth template 
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        role,
        responsibilities,
        is_admin_invited: true
      },
      // Optionally redirectTo can be added if needed, but defaults to SITE_URL
    });

    if (error) {
      throw error;
    }

    // You could also directly assign them in your user_roles tables here or via a database trigger 
    // when they confirm their email. For now, we update user_roles table preemptively so they get access:
    const { error: dbError } = await supabaseAdmin
      .from('user_roles')
      .upsert({ user_id: data.user.id, role: role, responsibilities: responsibilities || null });

    // Ignore dbError if it fails (e.g. because they already exist)
    if (dbError) {
      console.error("Warning: Could not add to user_roles table directly:", dbError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Invitation sent via Supabase", user: data.user }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
