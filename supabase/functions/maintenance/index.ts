// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        const payload = await req.json()
        const { action, target_user_id, target_role, email, password, sql } = payload

        if (action === 'check_invitation') {
            console.log(`Checking invitation for ${email}`)

            // 1. Get pending invitations from site_content
            const { data: inviteData, error: fetchError } = await supabaseClient
                .from('site_content')
                .select('content, id')
                .eq('section_key', 'pending_invitations')
                .maybeSingle()

            if (fetchError || !inviteData?.content) {
                return new Response(JSON.stringify({ message: 'No invitations found', found: false }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200
                })
            }

            let invitations = []
            try {
                invitations = typeof inviteData.content === 'string'
                    ? JSON.parse(inviteData.content)
                    : inviteData.content
                if (!Array.isArray(invitations)) invitations = []
            } catch (e) {
                return new Response(JSON.stringify({ error: 'Failed to parse invitations' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 500
                })
            }

            const inviteIdx = invitations.findIndex((i: any) => i.email.toLowerCase() === email.toLowerCase())

            if (inviteIdx === -1) {
                return new Response(JSON.stringify({ message: 'No pending invitation for this email', found: false }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200
                })
            }

            const invitation = invitations[inviteIdx]
            console.log(`Matched invitation for ${email}: ${invitation.role}`)

            // 2. Grant the role
            const { error: roleError } = await supabaseClient
                .from('user_roles')
                .upsert({
                    user_id: target_user_id,
                    role: invitation.role,
                    responsibilities: invitation.responsibilities
                }, { onConflict: 'user_id' })

            if (roleError) throw roleError

            // 3. Remove from pending
            invitations.splice(inviteIdx, 1)
            const { error: updateError } = await supabaseClient
                .from('site_content')
                .update({ content: JSON.stringify(invitations) })
                .eq('id', inviteData.id)

            if (updateError) throw updateError

            return new Response(JSON.stringify({
                message: 'Invitation processed and role granted',
                role: invitation.role
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        if (action === 'grant_role') {
            console.log(`Granting ${target_role} to ${target_user_id}`)
            await supabaseClient.from('user_roles').delete().eq('user_id', target_user_id)
            const { data, error } = await supabaseClient
                .from('user_roles')
                .insert({ user_id: target_user_id, role: target_role })
                .select()
            if (error) throw error
            return new Response(JSON.stringify({ message: 'Role granted', data }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        if (action === 'fix_auth') {
            console.log(`Fixing Auth for ${email}`)
            const { data: { users }, error: listError } = await supabaseClient.auth.admin.listUsers()
            if (listError) throw listError

            const existingUser = users.find(u => u.email === email)

            if (existingUser) {
                const { data, error } = await supabaseClient.auth.admin.updateUserById(
                    existingUser.id,
                    { password: password, email_confirm: true }
                )
                if (error) throw error
                return new Response(JSON.stringify({ message: 'User password updated', user: data.user }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
            } else {
                const { data, error } = await supabaseClient.auth.admin.createUser({
                    email,
                    password,
                    email_confirm: true
                })
                if (error) throw error
                return new Response(JSON.stringify({ message: 'User created', user: data.user }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
            }
        }

        if (action === 'fix_schema') {
            console.log('Running schema fixes...')
            const results: string[] = []

            // 1. Add responsibilities column to user_roles if missing
            try {
                // Use a raw query via supabase-js - select to check if column exists
                const { data: testData, error: testError } = await supabaseClient
                    .from('user_roles')
                    .select('responsibilities')
                    .limit(0)

                if (testError && testError.message.includes('does not exist')) {
                    // Column doesn't exist - we need to add it via Management API
                    const dbUrl = Deno.env.get('SUPABASE_DB_URL')
                    if (dbUrl) {
                        // Use postgres connection directly via Deno
                        const { Client } = await import("https://deno.land/x/postgres@v0.17.0/mod.ts")
                        const client = new Client(dbUrl)
                        await client.connect()
                        await client.queryObject(`ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS responsibilities TEXT;`)

                        // Add enum values
                        const enumValues = ['marketing', 'shipping', 'support', 'content', 'moderator']
                        for (const val of enumValues) {
                            try {
                                await client.queryObject(`ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS '${val}';`)
                                results.push(`Added enum value: ${val}`)
                            } catch (e) {
                                results.push(`Enum value ${val}: ${e.message}`)
                            }
                        }

                        // Recreate is_admin with all roles
                        await client.queryObject(`
                            CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
                            RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
                            AS $fn$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role::text IN ('admin','moderator','marketing','shipping','support','content')) $fn$;
                        `)

                        // Fix RLS policies on user_roles
                        await client.queryObject(`DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;`)
                        await client.queryObject(`DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;`)
                        await client.queryObject(`DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;`)
                        await client.queryObject(`DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;`)
                        await client.queryObject(`DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;`)

                        await client.queryObject(`CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));`)
                        await client.queryObject(`CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));`)
                        await client.queryObject(`CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));`)
                        await client.queryObject(`CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));`)

                        // Reload PostgREST schema cache  
                        await client.queryObject(`NOTIFY pgrst, 'reload schema';`)

                        await client.end()
                        results.push('Added responsibilities column')
                        results.push('Fixed RLS policies')
                        results.push('Reloaded schema cache')
                    } else {
                        results.push('SUPABASE_DB_URL not available - cannot alter schema')
                    }
                } else {
                    results.push('responsibilities column already exists')
                }
            } catch (e) {
                results.push(`Schema fix error: ${e.message}`)
            }

            return new Response(JSON.stringify({ message: 'Schema fix completed', results }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        if (action === 'execute_sql') {
            // Try using direct postgres connection if available
            const dbUrl = Deno.env.get('SUPABASE_DB_URL')
            if (dbUrl) {
                const { Client } = await import("https://deno.land/x/postgres@v0.17.0/mod.ts")
                const client = new Client(dbUrl)
                await client.connect()
                const result = await client.queryObject(sql)
                await client.end()
                return new Response(JSON.stringify({ message: 'SQL Executed', data: result.rows }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
            }
            // Fallback to RPC
            const { data, error } = await supabaseClient.rpc('exec_sql', { sql_query: sql })
            if (error) throw error
            return new Response(JSON.stringify({ message: 'SQL Executed', data }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        return new Response(JSON.stringify({ error: 'Invalid action' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    } catch (error) {
        console.error('Error:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
