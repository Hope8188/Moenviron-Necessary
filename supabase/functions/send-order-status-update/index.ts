import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StatusUpdateRequest {
  orderId: string;
  userEmail: string;
  userName: string;
  newStatus: string;
  totalAmount: number;
  currency?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  estimatedDelivery?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      orderId,
      userEmail,
      userName,
      newStatus,
      totalAmount,
      currency = "GBP",
      trackingNumber,
      trackingCarrier,
      estimatedDelivery
    }: StatusUpdateRequest = await req.json();

    if (!orderId || !userEmail || !newStatus) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const statusMessages: Record<string, { subject: string; message: string }> = {
      processing: {
        subject: "Your order is being processed",
        message: "We've started processing your order and will update you once it ships.",
      },
      shipped: {
        subject: "Your order has been shipped!",
        message: trackingNumber
          ? `Great news! Your order is on its way. Track it with: ${trackingCarrier || "carrier"} - ${trackingNumber}`
          : "Great news! Your order is on its way.",
      },
      arrived: {
        subject: "Your order has arrived at destination",
        message: "Your order has arrived at the destination and will be delivered soon.",
      },
      delivered: {
        subject: "Your order has been delivered!",
        message: "Your order has been successfully delivered. We hope you love your sustainable fashion!",
      },
      confirmed: {
        subject: "Your order is confirmed",
        message: "Thank you! Your order has been confirmed and payment received.",
      },
    };

    const statusInfo = statusMessages[newStatus.toLowerCase()] || {
      subject: `Order Update: ${newStatus}`,
      message: `Your order status has been updated to: ${newStatus}`,
    };

    const currencySymbol = currency === "KES" ? "KSh" : "£";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${statusInfo.subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a5f2a 0%, #2d8f3f 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Moenviron</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Circular Fashion</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1a5f2a; margin-top: 0;">${statusInfo.subject}</h2>
          
          <p>Hi ${userName || "Valued Customer"},</p>
          
          <p>${statusInfo.message}</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a5f2a;">
            <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> ${orderId.slice(0, 8)}...</p>
            <p style="margin: 0 0 10px 0;"><strong>Status:</strong> <span style="color: #1a5f2a; font-weight: bold; text-transform: capitalize;">${newStatus}</span></p>
            <p style="margin: 0;"><strong>Total:</strong> ${currencySymbol}${totalAmount.toFixed(2)}</p>
            ${trackingNumber ? `<p style="margin: 10px 0 0 0;"><strong>Tracking:</strong> ${trackingCarrier || ""} ${trackingNumber}</p>` : ""}
            ${estimatedDelivery ? `<p style="margin: 10px 0 0 0;"><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>` : ""}
          </div>
          
          <p>Thank you for supporting sustainable fashion!</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://moenviron.com/order-tracking" style="background: #1a5f2a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Track Your Order</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            Questions? Reply to this email or contact us at support@moenviron.com
          </p>
        </div>
      </body>
      </html>
    `;

    // For now, log the email (in production, integrate with Resend or another email service)
    console.log("Order status update email prepared:", {
      to: userEmail,
      subject: statusInfo.subject,
      orderId,
      newStatus,
    });

    // Order status logged. Future email notifications can be routed to a generic SMTP/MailerLite here.

    return new Response(
      JSON.stringify({ success: true, message: "Status update processed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error processing order status update:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});