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

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const params = event.queryStringParameters || {};
    const { table, format = 'json' } = params;

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const tables = ['orders', 'products', 'newsletter_subscribers', 'site_content', 'admins'];

    if (table && !tables.includes(table)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid table name' }) };
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
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Disposition': `attachment; filename=moenviron-backup-${new Date().toISOString().split('T')[0]}.json`,
        },
        body: JSON.stringify(exportData),
      };
    }

    return { statusCode: 200, headers, body: JSON.stringify(exportData) };
  } catch (error) {
    console.error('Export error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
