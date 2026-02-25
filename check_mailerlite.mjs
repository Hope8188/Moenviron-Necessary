import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function testSync() {
    console.log("Testing sync-to-mailerlite function...");
    const { data, error } = await supabase.functions.invoke("sync-to-mailerlite", {
        body: { action: "test" },
    });

    if (error) {
        if (error.context) {
            const body = await error.context.json();
            console.log("Error body:", body);
        }
        console.error("Function error:", error);
    } else {
        console.log("Function response:", data);
    }
}

testSync();
