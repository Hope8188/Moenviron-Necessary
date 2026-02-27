import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('--- Product Performance Stats ---');
    const { data: stats, error: statsError } = await supabase.from('product_performance_stats').select('*').limit(5);
    if (statsError) console.error(statsError);
    else console.log(stats);

    console.log('--- Product Views ---');
    const { data: views, error: viewsError } = await supabase.from('product_views').select('*').limit(5);
    if (viewsError) console.error(viewsError);
    else console.log(views);

    console.log('--- Page Views ---');
    const { data: pviews, error: pviewsError } = await supabase.from('page_views').select('*').limit(5);
    if (pviewsError) console.error(pviewsError);
    else console.log(pviews);
}

checkData();
