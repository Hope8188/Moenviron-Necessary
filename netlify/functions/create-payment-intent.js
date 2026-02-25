const Stripe = require('stripe');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    const { items, customerEmail, customerName } = JSON.parse(event.body);

    if (!items || items.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No items in cart' }) };
    }

    if (!customerEmail) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Customer email is required' }) };
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingStandard = 5;
    const totalAmount = Math.round((subtotal + shippingStandard) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'gbp',
      automatic_payment_methods: { enabled: true },
      metadata: {
        customer_email: customerEmail,
        customer_name: customerName || '',
        items: JSON.stringify(items.map(i => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price }))),
      },
      receipt_email: customerEmail,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: totalAmount,
      }),
    };
  } catch (error) {
    console.error('Payment intent error:', error);
    return { statusCode: 400, headers, body: JSON.stringify({ error: error.message || 'Payment setup failed' }) };
  }
};
