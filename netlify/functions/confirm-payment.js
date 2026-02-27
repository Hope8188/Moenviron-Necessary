const Stripe = require('stripe');

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
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    const { paymentIntentId, shippingAddress } = JSON.parse(event.body);

    if (!paymentIntentId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Payment intent ID required' }) };
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          status: paymentIntent.status,
          message: 'Payment not completed',
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        paymentIntentId: paymentIntent.id,
        shippingAddress,
      }),
    };
  } catch (error) {
    console.error('Confirm payment error:', error);
    return { statusCode: 400, headers, body: JSON.stringify({ error: error.message || 'Failed to confirm payment' }) };
  }
};
