const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = event.headers['stripe-signature'];

    // SECURITY: Both secret and signature are required — no fallback to unsigned payloads
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Webhook secret not configured' }) };
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is missing');
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Stripe key not configured' }) };
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is missing');
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database key not configured' }) };
    }

    if (!sig) {
      console.error('Missing stripe-signature header');
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing stripe-signature header' }) };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    let stripeEvent;

    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return { statusCode: 400, headers, body: JSON.stringify({ error: `Webhook signature invalid: ${err.message}` }) };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (stripeEvent.type === 'v2.core.event_destination.ping') {
      return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
    }

    if (stripeEvent.type === 'payment_intent.succeeded') {
      const paymentIntent = stripeEvent.data.object;
      const metadata = paymentIntent.metadata || {};

      const orderData = {
        user_email: metadata.customer_email || paymentIntent.receipt_email,
        user_name: metadata.customer_name || '',
        total_amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        payment_method: 'stripe',
        stripe_payment_intent_id: paymentIntent.id,
        items: metadata.items ? JSON.parse(metadata.items) : [],
        status: 'confirmed',
      };

      const { data: order } = await supabase.from('orders').insert(orderData).select().single();

      if (order && process.env.RESEND_API_KEY && orderData.user_email) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const currencySymbol =
          orderData.currency === 'GBP' ? '£' :
            orderData.currency === 'EUR' ? '€' :
              orderData.currency === 'USD' ? '$' :
                orderData.currency === 'KES' ? 'KSh' :
                  orderData.currency;
        const shortOrderId = order.id.slice(0, 8).toUpperCase();

        const itemsHtml = (orderData.items || []).map(item => `
          <tr>
            <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb;">
              <div><p style="margin: 0; font-weight: 500;">${item.name}</p><p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">Qty: ${item.qty || item.quantity}</p></div>
            </td>
            <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${currencySymbol}${((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}</td>
          </tr>
        `).join('');

        await resend.emails.send({
          from: 'Moenviron <orders@moenviron.com>',
          to: [orderData.user_email],
          subject: `Order Confirmed! #${shortOrderId}`,
          html: `
            <!DOCTYPE html><html><body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 40px 24px; text-align: center;">
                <h1 style="color: white; margin: 0;">Thank You for Your Order!</h1>
              </div>
              <div style="padding: 32px 24px;">
                <p>Hi <strong>${orderData.user_name || 'there'}</strong>,</p>
                <p>Your order has been confirmed. Order ID: <strong>#${shortOrderId}</strong></p>
                <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                  ${itemsHtml}
                  <tr style="background-color: #f3f4f6;">
                    <td style="padding: 16px 12px; font-weight: 600;">Total</td>
                    <td style="padding: 16px 12px; text-align: right; font-weight: 700; font-size: 20px; color: #059669;">${currencySymbol}${orderData.total_amount.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
              <div style="padding: 24px; text-align: center; background: #f3f4f6;"><p>Thank you for choosing sustainable fashion!</p></div>
            </body></html>
          `,
        });
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
  }
};
