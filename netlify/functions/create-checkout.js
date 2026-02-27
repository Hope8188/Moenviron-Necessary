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

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    const baseUrl = process.env.URL || process.env.DEPLOY_URL || 'https://moenviron.com';

    // Handle GET redirect (for fallback URLs)
    if (event.httpMethod === 'GET') {
      const amount = parseFloat(event.queryStringParameters.amount || '0');
      const currency = (event.queryStringParameters.currency || 'gbp').toLowerCase();
      const email = event.queryStringParameters.email;
      const isDonation = event.queryStringParameters.isDonation === 'true';

      if (amount <= 0) {
        return {
          statusCode: 302,
          headers: { ...headers, Location: 'https://donate.stripe.com/dRm7sKgzH3qtapRg8wd3i00' },
          body: ''
        };
      }

      const ZERO_DECIMAL_CURRENCIES = new Set(['ugx', 'rwf', 'bif', 'clp', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'vnd', 'xaf', 'xof', 'xpf']);
      const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency);
      const unitAmount = isZeroDecimal ? Math.round(amount) : Math.round(amount * 100);

      const sessionConfig = {
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency,
            product_data: { name: isDonation ? 'Donation' : 'Purchase' },
            unit_amount: unitAmount,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: isDonation
          ? `${baseUrl}/donation-success?session_id={CHECKOUT_SESSION_ID}&amount=${amount}`
          : `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: isDonation
          ? `${baseUrl}/donate?status=cancelled`
          : `${baseUrl}/cart`,
        customer_email: email || undefined,
        submit_type: isDonation ? 'donate' : 'pay'
      };

      const session = await stripe.checkout.sessions.create(sessionConfig);

      return {
        statusCode: 302,
        headers: { ...headers, Location: session.url },
        body: ''
      };
    }

    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    // Handle POST checkout creation
    const { items, customerEmail, customerName, customerLocation, locationMetadata, mode, currency: requestedCurrency, isDonation } = JSON.parse(event.body);

    if (!items || items.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No items provided' }) };
    }

    if (!customerEmail) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Customer email is required' }) };
    }

    const ZERO_DECIMAL_CURRENCIES = new Set(['ugx', 'rwf', 'bif', 'clp', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'vnd', 'xaf', 'xof', 'xpf']);
    const currency = (requestedCurrency || 'gbp').toLowerCase();
    const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = isDonation ? 0 : (currency === 'gbp' ? 5 : 0);
    const total = subtotal + shippingCost;
    const totalAmount = isZeroDecimal ? Math.round(total) : Math.round(total * 100);

    // If using Payment Intents directly
    if (mode === 'payment_intent') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency,
        receipt_email: customerEmail,
        metadata: {
          isDonation: isDonation ? 'true' : 'false',
        },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id
        })
      };
    }

    // Checkout Session Mode
    const lineItems = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: isZeroDecimal ? Math.round(item.price) : Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      submit_type: isDonation ? 'donate' : 'pay',
      success_url: isDonation
        ? `${baseUrl}/donation-success?session_id={CHECKOUT_SESSION_ID}&amount=${total}`
        : `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: isDonation ? `${baseUrl}/donate?status=cancelled` : `${baseUrl}/cart`,
      metadata: {
        customer_name: customerName || '',
        customer_location: customerLocation || '',
        location_metadata: locationMetadata ? JSON.stringify(locationMetadata) : '',
        items: JSON.stringify(items.map(i => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price }))),
      },
    };

    if (!isDonation) {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['GB', 'KE', 'UG', 'TZ', 'RW', 'US', 'NG', 'ZA', 'GH', 'ET'],
      };
      if (shippingCost > 0) {
        sessionConfig.shipping_options = [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: isZeroDecimal ? shippingCost : shippingCost * 100, currency },
              display_name: 'Standard Shipping',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 5 },
                maximum: { unit: 'business_day', value: 10 },
              },
            },
          },
        ];
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url, sessionId: session.id }),
    };
  } catch (error) {
    console.error('Checkout error:', error);
    return { statusCode: error.statusCode || 400, headers, body: JSON.stringify({ error: error.message || 'Checkout failed' }) };
  }
};
