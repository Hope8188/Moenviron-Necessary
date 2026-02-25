const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const params = event.queryStringParameters || {};
    const { table } = params;
    const validTables = ['orders', 'products', 'newsletter_subscribers'];

    if (!table || !validTables.includes(table)) {
      return { statusCode: 400, headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Invalid table' }) };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;

    if (!data?.length) {
      return { statusCode: 404, headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'No data found' }) };
    }

    const csvHeaders = Object.keys(data[0]);
    const csvRows = [csvHeaders.join(',')];

    for (const row of data) {
      const values = csvHeaders.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=${table}-${new Date().toISOString().split('T')[0]}.csv`,
      },
      body: csvRows.join('\n'),
    };
  } catch (error) {
    console.error('CSV export error:', error);
    return { statusCode: 500, headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: error.message }) };
  }
};
