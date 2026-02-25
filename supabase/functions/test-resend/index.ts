 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers":
     "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 interface TestRequest {
   action: "test" | "send";
   to?: string;
 }
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response("ok", { headers: corsHeaders });
   }
 
   try {
     const resendApiKey = Deno.env.get("RESEND_API_KEY");
     if (!resendApiKey) {
       console.error("RESEND_API_KEY not configured");
       return new Response(
         JSON.stringify({ success: false, error: "Resend API key not configured" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const { action, to }: TestRequest = await req.json();
     console.log("Resend action:", action, "to:", to);
 
     // Test connection
     if (action === "test") {
       // Verify the API key works by fetching domains
       const response = await fetch("https://api.resend.com/domains", {
         headers: { Authorization: `Bearer ${resendApiKey}` },
       });
 
       if (!response.ok) {
         const error = await response.text();
         console.error("Resend API error:", error);
         return new Response(
           JSON.stringify({ success: false, error: "Invalid API key or connection failed" }),
           { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
 
       const data = await response.json();
       console.log("Resend connection successful, domains:", data?.data?.length || 0);
       return new Response(
         JSON.stringify({ 
           success: true, 
           domains_count: data?.data?.length || 0,
           message: "Connection successful"
         }),
         { headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Send test email
     if (action === "send" && to) {
       const emailResponse = await fetch("https://api.resend.com/emails", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${resendApiKey}`,
         },
         body: JSON.stringify({
           from: "Moenviron <onboarding@resend.dev>",
           to: [to],
           subject: "Test Email from Moenviron",
           html: `
           <!DOCTYPE html>
           <html>
           <head>
             <meta charset="utf-8">
             <title>Test Email</title>
           </head>
           <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
             <div style="background: linear-gradient(135deg, #1a5f2a 0%, #2d8f3f 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
               <h1 style="color: white; margin: 0;">Moenviron</h1>
               <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Circular Fashion</p>
             </div>
             <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
               <h2 style="color: #1a5f2a;">🎉 Email Integration Working!</h2>
               <p>This is a test email to confirm your Resend integration is properly configured.</p>
               <p>You can now send:</p>
               <ul>
                 <li>Order confirmations</li>
                 <li>Shipping updates</li>
                 <li>Status notifications</li>
               </ul>
               <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
               <p style="font-size: 12px; color: #666; text-align: center;">
                 Sent from Moenviron Admin Dashboard
               </p>
             </div>
           </body>
           </html>
           `,
         }),
       });
 
       if (!emailResponse.ok) {
         const error = await emailResponse.text();
         console.error("Failed to send test email:", error);
         return new Response(
           JSON.stringify({ success: false, error: "Failed to send test email" }),
           { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
 
       const data = await emailResponse.json();
       console.log("Test email sent successfully:", data?.id);
       return new Response(
         JSON.stringify({ success: true, email_id: data?.id }),
         { headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     return new Response(
       JSON.stringify({ success: false, error: "Invalid action or missing email" }),
       { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     const errorMessage = error instanceof Error ? error.message : "Unknown error";
     console.error("Resend error:", error);
     return new Response(
       JSON.stringify({ success: false, error: errorMessage }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });