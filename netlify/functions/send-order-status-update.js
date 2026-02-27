const { Resend } = require('resend');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Server misconfigured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
        }),
      };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: settings } = await supabase
      .from('site_content')
      .select('content')
      .eq('section_key', 'resend')
      .single();

    const apiKey = settings?.content?.api_key || process.env.RESEND_API_KEY;
    if (!apiKey) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Resend API key not configured' }) };
    }

    const resend = new Resend(apiKey);
    const { orderId, userEmail, userName, status, trackingNumber, trackingCarrier, estimatedDelivery, totalAmount, currency } = JSON.parse(event.body);

    const statusMessages = {
      pending: { subject: 'Order Received', heading: 'We Received Your Order!', icon: '📦', color: '#f59e0b' },
      processing: { subject: 'Order Processing', heading: 'Your Order is Being Prepared!', icon: '⚙️', color: '#3b82f6' },
      shipped: { subject: 'Order Shipped', heading: 'Your Order is On Its Way!', icon: '🚚', color: '#8b5cf6' },
      arrived: { subject: 'Order Has Arrived!', heading: 'Your Package Has Arrived at Its Destination!', icon: '🎉', color: '#6366f1' },
      delivered: { subject: 'Order Delivered', heading: 'Your Order Has Been Delivered!', icon: '✅', color: '#22c55e' },
      cancelled: { subject: 'Order Cancelled', heading: 'Order Cancelled', icon: '❌', color: '#ef4444' },
    };

    const statusInfo = statusMessages[status?.toLowerCase()] || { subject: 'Order Update', heading: `Status: ${status}`, icon: '📬', color: '#059669' };
    const currencySymbol = currency === 'KES' ? 'KSh' : '£';
    const shortOrderId = orderId?.slice(0, 8).toUpperCase() || 'N/A';

    const trackingSection = trackingNumber ? `
      <div style="background: #f0fdf4; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 12px 0; color: #059669; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">📦 Tracking Information</h3>
        <p style="margin: 0;"><strong>Tracking Number:</strong> <span style="font-family: monospace; font-size: 14px;">${trackingNumber}</span></p>
        ${trackingCarrier ? `<p style="margin: 8px 0 0 0;"><strong>Carrier:</strong> ${trackingCarrier.toUpperCase()}</p>` : ''}
        ${estimatedDelivery ? `<p style="margin: 8px 0 0 0;"><strong>Estimated Delivery:</strong> ${new Date(estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>` : ''}
      </div>
    ` : '';

    const emailResponse = await resend.emails.send({
      from: 'Moenviron <orders@moenviron.com>',
      to: [userEmail],
      subject: `${statusInfo.subject} - Order #${shortOrderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 40px 24px; text-align: center;">
            <div style="display: inline-block; background-color: rgba(255,255,255,0.2); border-radius: 50%; padding: 16px; margin-bottom: 16px;">
              <span style="font-size: 32px;">${statusInfo.icon}</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">${statusInfo.heading}</h1>
          </div>
          
          <div style="background-color: white; padding: 32px 24px;">
            <p style="font-size: 18px; margin: 0 0 24px 0;">
              Hi <strong>${userName || 'there'}</strong>,
            </p>
            
            <div style="background: ${statusInfo.color}15; border-left: 4px solid ${statusInfo.color}; border-radius: 0 8px 8px 0; padding: 16px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 16px; color: ${statusInfo.color}; font-weight: 600;">
                Order #${shortOrderId} is now: ${status.toUpperCase()}
              </p>
            </div>

            ${trackingSection}

            ${totalAmount ? `
            <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Order Total</p>
              <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 700; color: #1f2937;">${currencySymbol}${parseFloat(totalAmount).toFixed(2)}</p>
            </div>
            ` : ''}

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://moenviron.com/orders/${orderId}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                View Order Details
              </a>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                Questions about your order?
              </p>
              <a href="mailto:moses@moenviron.com" style="color: #059669; text-decoration: none; font-weight: 500;">moses@moenviron.com</a>
            </div>
          </div>
          
          <div style="padding: 24px; text-align: center; background-color: #f3f4f6;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
              With love,<br>
              <strong style="color: #1f2937;">The Moenviron Team</strong>
            </p>
            <p style="margin: 16px 0 0 0; font-size: 12px; color: #9ca3af;">
              🌿 Sustainable Fashion for a Better Tomorrow
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, emailResponse }) };
  } catch (error) {
    console.error('Status update email error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
