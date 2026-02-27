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
                return new Response(JSON.stringify({ error: 'No invitations found' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 404
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
                return new Response(JSON.stringify({ error: 'No pending invitation for this email' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 404
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

        if (action === 'execute_sql') {
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
