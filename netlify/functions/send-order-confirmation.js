const { Resend } = require('resend');

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
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { orderId, userEmail, userName, items, totalAmount, currency, paymentMethod, shippingAddress } = JSON.parse(event.body);

    const currencySymbol = currency === 'GBP' ? '£' : currency === 'KES' ? 'KSh' : '$';
    const shortOrderId = orderId.slice(0, 8).toUpperCase();
    const orderDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb;">
          <div><p style="margin: 0; font-weight: 500;">${item.name}</p><p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">Qty: ${item.quantity}</p></div>
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${currencySymbol}${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailResponse = await resend.emails.send({
      from: 'Moenviron <orders@moenviron.com>',
      to: [userEmail],
      subject: `Order Confirmed! #${shortOrderId}`,
      html: `
        <!DOCTYPE html><html><body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 40px 24px; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You for Your Order!</h1>
          </div>
          <div style="padding: 32px 24px;">
            <p>Hi <strong>${userName || 'there'}</strong>,</p>
            <p>Your order has been confirmed. Order ID: <strong>#${shortOrderId}</strong></p>
            <p>Date: ${orderDate} | Payment: ${paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'}</p>
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
              ${itemsHtml}
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 16px 12px; font-weight: 600;">Total</td>
                <td style="padding: 16px 12px; text-align: right; font-weight: 700; font-size: 20px; color: #059669;">${currencySymbol}${totalAmount.toFixed(2)}</td>
              </tr>
            </table>
            ${shippingAddress ? `<p><strong>Shipping:</strong> ${shippingAddress.line1}, ${shippingAddress.city}, ${shippingAddress.postal_code}</p>` : ''}
          </div>
          <div style="padding: 24px; text-align: center; background: #f3f4f6;"><p>Thank you for choosing sustainable fashion!</p></div>
        </body></html>
      `,
    });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: emailResponse }) };
  } catch (error) {
    console.error('Order confirmation email error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
