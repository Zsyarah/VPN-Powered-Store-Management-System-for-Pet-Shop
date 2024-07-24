// src/routes/admin/+layout.ts
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent }) => {
    const { supabase, session } = await parent();

    if (!session) {
        // Redirect to login if no session
        throw redirect(303, '/');
    }

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        throw redirect(303, '/');
    }

    if (profiles.role === 'staff') {
        throw redirect(303, '/staff');
    }

    return { profiles };
}) satisfies LayoutLoad;
