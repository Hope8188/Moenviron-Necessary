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
    const { to, subject, html, action } = JSON.parse(event.body);

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

    const { data: settings, error: settingsError } = await supabase
      .from('site_content')
      .select('content')
      .eq('section_key', 'resend')
      .single();

    if (settingsError || !settings?.content?.api_key) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ error: 'Resend not configured. Please add API key in admin dashboard.' }) 
      };
    }

    const resend = new Resend(settings.content.api_key);

    if (action === 'test') {
      const emailResponse = await resend.emails.send({
        from: 'Moenv <noreply@moenv.co.ke>',
        to: [to],
        subject: subject || 'Test Email from Moenv',
        html: html || `
          <!DOCTYPE html>
          <html>
          <body style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
            <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 40px 24px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Moenv</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Sustainable Fashion from Kenya</p>
            </div>
            <div style="background: white; padding: 32px 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 16px 0; color: #111827;">Email Connection Successful!</h2>
              <p style="color: #6b7280; line-height: 1.6;">
                This is a test email to confirm that your Resend integration is working correctly.
              </p>
              <p style="color: #6b7280; line-height: 1.6;">
                You can now send order confirmations, status updates, and newsletters to your customers.
              </p>
              <div style="margin-top: 24px; padding: 16px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #059669;">
                <p style="margin: 0; color: #059669; font-weight: 500;">All systems operational!</p>
              </div>
            </div>
            <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
              © ${new Date().getFullYear()} Moenv. Sustainable fashion, delivered.
            </p>
          </body>
          </html>
        `,
      });

      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify({ success: true, message: 'Test email sent!', data: emailResponse }) 
      };
    }

    const emailResponse = await resend.emails.send({
      from: 'Moenv <noreply@moenv.co.ke>',
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html,
    });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: emailResponse }) };
  } catch (error) {
    console.error('Send email error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
