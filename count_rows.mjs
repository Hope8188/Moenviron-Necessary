import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEmpty() {
    const tables = ['product_performance_stats', 'product_views', 'page_views', 'orders'];
    for (const table of tables) {
        const { data, count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
            console.log(`${table}: ERROR ${error.message}`);
        } else {
            console.log(`${table}: ${count} rows`);
        }
    }
}

checkEmpty();
