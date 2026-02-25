import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function testResend() {
    console.log("Testing test-resend function...");
    const { data, error } = await supabase.functions.invoke("test-resend", {
        body: { action: "test" },
    });

    if (error) {
        if (error.context) {
            try {
                const body = await error.context.json();
                console.log("Error body:", body);
            } catch (e) {
                console.log("Error body not JSON");
            }
        }
        console.error("Function error:", error);
    } else {
        console.log("Function response:", data);
    }
}

testResend();
