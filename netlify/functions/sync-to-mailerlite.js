const { createClient } = require('@supabase/supabase-js');

const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';

async function mailerliteRequest(endpoint, apiKey, method = 'GET', body = null) {
  try {
    const response = await fetch(`${MAILERLITE_API_URL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    if (!response.ok) return { error: data.message || `API error: ${response.status}` };
    return { data };
  } catch (error) {
    return { error: error.message || 'Unknown error' };
  }
}

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
    const { action } = JSON.parse(event.body);

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: settingsData, error: settingsError } = await supabase
      .from('site_content')
      .select('content')
      .eq('section_key', 'mailerlite')
      .single();

    if (settingsError || !settingsData?.content?.api_key) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'MailerLite API key not configured' }) };
    }

    const apiKey = settingsData.content.api_key;
    const GROUP_NAME = 'Moenviron Newsletter';

    const { data: groupsData } = await mailerliteRequest('/groups?limit=100', apiKey);
    const groups = groupsData?.data || [];
    let group = groups.find(g => g.name === GROUP_NAME);

    if (!group) {
      const { data: newGroupData } = await mailerliteRequest('/groups', apiKey, 'POST', { name: GROUP_NAME });
      group = newGroupData?.data;
    }

    if (!group) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Failed to get/create group' }) };
    }

    if (action === 'test') {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Connection successful', group_id: group.id, group_name: group.name }) };
    }

    if (action === 'sync') {
      const { data: subscribers } = await supabase.from('newsletter_subscribers').select('*').eq('is_active', true);

      if (!subscribers?.length) {
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, synced_count: 0, message: 'No active subscribers' }) };
      }

      let syncedCount = 0;
      for (const sub of subscribers) {
        const [firstName, ...rest] = (sub.name || '').split(' ');
        await mailerliteRequest('/subscribers', apiKey, 'POST', {
          email: sub.email,
          fields: { name: firstName, last_name: rest.join(' ') },
          groups: [group.id],
          status: 'active',
        });
        syncedCount++;
        await new Promise(r => setTimeout(r, 100));
      }

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, synced_count: syncedCount, total: subscribers.length, group_id: group.id }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Invalid action' }) };
  } catch (error) {
    console.error('MailerLite sync error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: error.message }) };
  }
};
