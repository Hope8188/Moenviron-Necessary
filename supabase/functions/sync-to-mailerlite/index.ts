 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers":
     "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 interface SyncRequest {
   action: "test" | "sync";
 }
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response("ok", { headers: corsHeaders });
   }
 
   try {
     const mailerliteApiKey = Deno.env.get("MAILERLITE_API_KEY");
     if (!mailerliteApiKey) {
       console.error("MAILERLITE_API_KEY not configured");
       return new Response(
         JSON.stringify({ success: false, error: "MailerLite API key not configured" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const { action }: SyncRequest = await req.json();
     console.log("MailerLite action:", action);
 
     const mailerliteHeaders = {
       "Content-Type": "application/json",
       "Authorization": `Bearer ${mailerliteApiKey}`,
     };
 
     // Test connection
     if (action === "test") {
       const response = await fetch("https://connect.mailerlite.com/api/groups", {
         headers: mailerliteHeaders,
       });
 
       if (!response.ok) {
         const error = await response.text();
         console.error("MailerLite API error:", error);
         return new Response(
           JSON.stringify({ success: false, error: "Invalid API key or connection failed" }),
           { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
 
       const data = await response.json();
       const groups = data.data || [];
       
       // Find or suggest the Moenviron group
       let targetGroup = groups.find((g: { name: string }) => 
         g.name.toLowerCase().includes("moenviron") || g.name.toLowerCase().includes("newsletter")
       );
       
       if (!targetGroup && groups.length > 0) {
         targetGroup = groups[0];
       }
 
       console.log("MailerLite connection successful, groups:", groups.length);
       return new Response(
         JSON.stringify({ 
           success: true, 
           group_id: targetGroup?.id || null,
           group_name: targetGroup?.name || null,
           groups_count: groups.length
         }),
         { headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Sync subscribers
     if (action === "sync") {
       const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
       const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
       const supabase = createClient(supabaseUrl, supabaseKey);
 
       // Get subscribers from database
       const { data: subscribers, error: dbError } = await supabase
         .from("newsletter_subscribers")
         .select("email, name")
         .eq("is_active", true);
 
       if (dbError) {
         console.error("Database error:", dbError);
         return new Response(
           JSON.stringify({ success: false, error: "Failed to fetch subscribers" }),
           { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
 
       // Get groups to find target group
       const groupsResponse = await fetch("https://connect.mailerlite.com/api/groups", {
         headers: mailerliteHeaders,
       });
       const groupsData = await groupsResponse.json();
       const groups = groupsData.data || [];
 
       // Find or create Moenviron group
       let targetGroup = groups.find((g: { name: string }) => 
         g.name.toLowerCase().includes("moenviron")
       );
 
       if (!targetGroup) {
         // Create the group
         const createResponse = await fetch("https://connect.mailerlite.com/api/groups", {
           method: "POST",
           headers: mailerliteHeaders,
           body: JSON.stringify({ name: "Moenviron Newsletter" }),
         });
         if (createResponse.ok) {
           const createData = await createResponse.json();
           targetGroup = createData.data;
         }
       }
 
       let syncedCount = 0;
       const errors: string[] = [];
 
       // Sync each subscriber
       for (const subscriber of subscribers || []) {
         try {
           const subscriberData: { email: string; groups?: string[]; fields?: { name: string } } = {
             email: subscriber.email,
           };
           
           if (targetGroup) {
             subscriberData.groups = [targetGroup.id];
           }
           if (subscriber.name) {
             subscriberData.fields = { name: subscriber.name };
           }
 
           const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
             method: "POST",
             headers: mailerliteHeaders,
             body: JSON.stringify(subscriberData),
           });
 
           if (response.ok || response.status === 200 || response.status === 201) {
             syncedCount++;
           } else {
             const error = await response.text();
             console.error(`Failed to sync ${subscriber.email}:`, error);
             errors.push(subscriber.email);
           }
         } catch (err) {
           console.error(`Error syncing ${subscriber.email}:`, err);
           errors.push(subscriber.email);
         }
       }
 
       console.log(`MailerLite sync complete: ${syncedCount}/${subscribers?.length || 0} synced`);
       return new Response(
         JSON.stringify({ 
           success: true, 
           synced_count: syncedCount,
           total: subscribers?.length || 0,
           errors: errors.length > 0 ? errors : undefined,
           group_id: targetGroup?.id,
           group_name: targetGroup?.name
         }),
         { headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     return new Response(
       JSON.stringify({ success: false, error: "Invalid action" }),
       { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     const errorMessage = error instanceof Error ? error.message : "Unknown error";
     console.error("MailerLite sync error:", error);
     return new Response(
       JSON.stringify({ success: false, error: errorMessage }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });