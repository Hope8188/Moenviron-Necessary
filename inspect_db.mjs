import pg from 'pg';
const { Client } = pg;

const password = process.env.PGPASSWORD;
const client = new Client({
    host: 'db.wmeijbrqjuhvnksiijcz.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: password,
    ssl: { rejectUnauthorized: false }
});

async function query(label, sql) {
    console.log(`\n=== ${label} ===`);
    try {
        const res = await client.query(sql);
        console.log(JSON.stringify(res.rows, null, 2));
        return res.rows;
    } catch (err) {
        console.error(`Error: ${err.message}`);
        return null;
    }
}

try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL!');
} catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
}

await query('page_views TABLE COLUMNS',
    `SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_schema = 'public' AND table_name = 'page_views' 
   ORDER BY ordinal_position`
);

await query('page_views ROW COUNT',
    `SELECT COUNT(*) as total FROM public.page_views`
);

await query('page_views SAMPLE (last 5)',
    `SELECT id, page_path, session_id, device_type, country, city, created_at 
   FROM public.page_views ORDER BY created_at DESC LIMIT 5`
);

await query('RLS POLICIES ON page_views',
    `SELECT policyname, cmd, roles::text, qual, with_check 
   FROM pg_policies 
   WHERE schemaname = 'public' AND tablename = 'page_views'`
);

await query('ALL TABLE RLS STATUS',
    `SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   ORDER BY tablename`
);

await query('SUPABASE VAULT SECRETS (names only)',
    `SELECT name FROM vault.secrets ORDER BY name`
);

await query('EDGE FUNCTION JWT CONFIG via pg_net (check functions schema)',
    `SELECT routine_name, routine_type 
   FROM information_schema.routines 
   WHERE routine_schema = 'supabase_functions' 
   LIMIT 20`
);

await query('check supabase_functions schema tables',
    `SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'supabase_functions'`
);

await query('EDGE FUNCTION SETTINGS',
    `SELECT * FROM supabase_functions.hooks LIMIT 5`
);

await query('page_views: do anon SELECTs work with RLS?',
    `SELECT pg_has_role('anon', 'USAGE') as anon_role_exists`
);

await query('COUNT rows with country data',
    `SELECT 
    COUNT(*) as total_rows,
    COUNT(country) as has_country,
    COUNT(city) as has_city
   FROM public.page_views`
);

await client.end();
console.log('\n✅ All checks complete.');
