import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStats() {
    console.log('Checking product_performance_stats table...');
    const { data, error } = await supabase
        .from('product_performance_stats')
        .select('*');

    if (error) {
        console.error('Error fetching stats:', error);
        return;
    }

    if (data.length === 0) {
        console.log('Table is EMPTY. No tracking data has been recorded in the database yet.');
    } else {
        console.log(`Found ${data.length} statistics records:`);
        data.forEach(stat => {
            console.log(`- Date: ${stat.date}, ProductID: ${stat.product_id}, Views: ${stat.views}, Cart: ${stat.add_to_cart}, Sales: ${stat.purchases}, Revenue: ${stat.revenue}`);
        });
    }

    console.log('\nChecking impact_metrics table...');
    const { data: impact, error: iError } = await supabase
        .from('impact_metrics')
        .select('*');

    if (iError) console.error('Error fetching impact:', iError);
    else console.log(`Found ${impact.length} impact records.`);

    console.log('\nChecking orders table...');
    const { data: orders, error: oError } = await supabase
        .from('orders')
        .select('id, total_amount, created_at');

    if (oError) console.error('Error fetching orders:', oError);
    else console.log(`Found ${orders.length} orders.`);
}

checkStats();
