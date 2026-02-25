import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log('Testing insert into product_views...');
    const { data, error } = await supabase
        .from('product_views')
        .insert([{
            product_id: '00000000-0000-0000-0000-000000000000',
            ip_address: '127.0.0.1'
        }]);

    if (error) {
        console.error('Insert Error:', error);
    } else {
        console.log('Insert Success!', data);
    }
}

testInsert();
