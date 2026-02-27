import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const resend = new Resend(process.env.RESEND_API_KEY);
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing server-side Supabase env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to use the API server securely."
  );
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors());
app.use(express.json());

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { items, customerEmail, customerName } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    if (!customerEmail) {
      return res.status(400).json({ error: 'Customer email is required' });
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

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(400).json({ error: error.message || 'Payment setup failed' });
  }
});

app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, shippingAddress } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID required' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.json({
        success: false,
        status: paymentIntent.status,
        message: 'Payment not completed',
      });
    }

    res.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      shippingAddress,
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(400).json({ error: error.message || 'Failed to confirm payment' });
  }
});

// ============== MAILERLITE SYNC ==============
const MAILERLITE_API_URL = "https://connect.mailerlite.com/api";

async function mailerliteRequest(endpoint, apiKey, method = "GET", body = null) {
  try {
    const response = await fetch(`${MAILERLITE_API_URL}${endpoint}`, {
      method,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    if (!response.ok) return { error: data.message || `API error: ${response.status}` };
    return { data };
  } catch (error) {
    return { error: error.message || "Unknown error" };
  }
}

app.post('/api/sync-to-mailerlite', async (req, res) => {
  try {
    const { action } = req.body;
    
    const { data: settingsData, error: settingsError } = await supabase
      .from("site_content")
      .select("content")
      .eq("section_key", "mailerlite")
      .single();

    if (settingsError || !settingsData?.content?.api_key) {
      return res.status(400).json({ success: false, error: "MailerLite API key not configured" });
    }

    const apiKey = settingsData.content.api_key;
    const GROUP_NAME = "Moenviron Newsletter";

    // Get or create group
    const { data: groupsData } = await mailerliteRequest("/groups?limit=100", apiKey);
    const groups = groupsData?.data || [];
    let group = groups.find(g => g.name === GROUP_NAME);
    
    if (!group) {
      const { data: newGroupData } = await mailerliteRequest("/groups", apiKey, "POST", { name: GROUP_NAME });
      group = newGroupData?.data;
    }

    if (!group) {
      return res.status(400).json({ success: false, error: "Failed to get/create group" });
    }

    if (action === "test") {
      return res.json({ success: true, message: "Connection successful", group_id: group.id, group_name: group.name });
    }

    if (action === "sync") {
      const { data: subscribers } = await supabase.from("newsletter_subscribers").select("*").eq("is_active", true);
      
      if (!subscribers?.length) {
        return res.json({ success: true, synced_count: 0, message: "No active subscribers" });
      }

      let syncedCount = 0;
      for (const sub of subscribers) {
        const [firstName, ...rest] = (sub.name || "").split(" ");
        await mailerliteRequest("/subscribers", apiKey, "POST", {
          email: sub.email,
          fields: { name: firstName, last_name: rest.join(" ") },
          groups: [group.id],
          status: "active",
        });
        syncedCount++;
        await new Promise(r => setTimeout(r, 100));
      }

      return res.json({ success: true, synced_count: syncedCount, total: subscribers.length, group_id: group.id });
    }

    res.status(400).json({ success: false, error: "Invalid action" });
  } catch (error) {
    console.error("MailerLite sync error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============== ORDER EMAILS ==============
app.post('/api/send-order-confirmation', async (req, res) => {
  try {
    const { orderId, userEmail, userName, items, totalAmount, currency, shippingAddress, estimatedDelivery } = req.body;
    
    const currencySymbol = currency === "GBP" ? "£" : currency === "KES" ? "KSh" : "$";
    const shortOrderId = orderId.slice(0, 8).toUpperCase();
    const orderDate = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb;">
          <div><p style="margin: 0; font-weight: 500;">${item.name}</p><p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">Qty: ${item.quantity}</p></div>
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${currencySymbol}${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join("");

    const emailResponse = await resend.emails.send({
      from: "Moenviron <orders@moenviron.com>",
      to: [userEmail],
      subject: `Order Confirmed! #${shortOrderId}`,
      html: `
        <!DOCTYPE html><html><body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 40px 24px; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You for Your Order!</h1>
          </div>
          <div style="padding: 32px 24px;">
            <p>Hi <strong>${userName || "there"}</strong>,</p>
            <p>Your order has been confirmed. Order ID: <strong>#${shortOrderId}</strong></p>
            <p>Date: ${orderDate}</p>
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

    res.json({ success: true, data: emailResponse });
  } catch (error) {
    console.error("Order confirmation email error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/send-order-status-update', async (req, res) => {
  try {
    const { orderId, userEmail, userName, newStatus, totalAmount, currency } = req.body;
    
const statusMessages = {
        pending: { subject: "Order Received", heading: "We Received Your Order!" },
        confirmed: { subject: "Order Confirmed", heading: "Your Order is Confirmed!" },
        processing: { subject: "Order Processing", heading: "Your Order is Being Prepared!" },
        shipped: { subject: "Order Shipped", heading: "Your Order is On Its Way!" },
        arrived: { subject: "Order Has Arrived!", heading: "Your Package Has Arrived at Its Destination!" },
        delivered: { subject: "Order Delivered", heading: "Your Order Has Been Delivered!" },
        cancelled: { subject: "Order Cancelled", heading: "Order Cancelled" },
      };
    
    const statusInfo = statusMessages[newStatus?.toLowerCase()] || { subject: "Order Update", heading: `Status: ${newStatus}` };
    const currencySymbol = currency === 'KES' ? 'KES ' : '£';

    const emailResponse = await resend.emails.send({
      from: "Moenviron <orders@moenviron.com>",
      to: [userEmail],
      subject: `${statusInfo.subject} - Order #${orderId.slice(0, 8)}`,
      html: `
        <!DOCTYPE html><html><body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2d5a27, #4a7c43); padding: 40px; text-align: center;">
            <h1 style="color: white;">Moenviron</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #2d5a27;">${statusInfo.heading}</h2>
            <p>Hi ${userName || 'Valued Customer'},</p>
            <div style="background: #f8faf8; border-radius: 12px; padding: 25px; margin: 20px 0;">
              <p><strong>Order:</strong> ${orderId.slice(0, 8)}...</p>
              <p><strong>Status:</strong> ${newStatus}</p>
              <p><strong>Total:</strong> ${currencySymbol}${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </body></html>
      `,
    });

    res.json({ success: true, emailResponse });
  } catch (error) {
    console.error("Status update email error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============== DATA BACKUP/EXPORT ==============
app.get('/api/export-data', async (req, res) => {
  try {
    const { table, format = 'json' } = req.query;
    
    const tables = ['orders', 'products', 'newsletter_subscribers', 'site_content', 'admins'];
    
    if (table && !tables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    const exportData = {};
    const exportTables = table ? [table] : tables;

    for (const t of exportTables) {
      const { data, error } = await supabase.from(t).select('*');
      if (!error) exportData[t] = data;
    }

    exportData._meta = {
      exported_at: new Date().toISOString(),
      tables: exportTables,
      total_records: Object.values(exportData).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0),
    };

    if (format === 'download') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=moenviron-backup-${new Date().toISOString().split('T')[0]}.json`);
    }

    res.json(exportData);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/export-csv/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const validTables = ['orders', 'products', 'newsletter_subscribers'];
    
    if (!validTables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table' });
    }

    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;

    if (!data?.length) {
      return res.status(404).json({ error: 'No data found' });
    }

    // Convert to CSV
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${table}-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvRows.join('\n'));
  } catch (error) {
    console.error("CSV export error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
