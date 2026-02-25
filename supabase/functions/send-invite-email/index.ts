// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const { email, role, responsibilities }: InviteRequest = await req.json();

    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "onboarding@resend.dev";
    const fromName = Deno.env.get("RESEND_FROM_NAME") || "Moenviron Team";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [email],
        subject: `You've been invited to join Moenviron as ${role}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Invitation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a5f2a 0%, #2d8f3f 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Welcome to Moenviron</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1a5f2a;">You've been invited!</h2>
              <p>You have been invited to join the Moenviron team as: <strong>${role}</strong></p>
              ${responsibilities ? `<p><strong>Responsibilities:</strong> ${responsibilities}</p>` : ''}
              <p>Please sign up to accept your invitation.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${req.headers.get("origin") || "https://moenviron.com"}/auth?type=signup&email=${email}" style="background-color: #1a5f2a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Create Account</a>
              </div>
              <p style="font-size: 12px; color: #666; text-align: center;">
                If you didn't expect this invitation, you can ignore this email.
              </p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error("Failed to send email: " + error);
    }

    const data = await res.json();

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
