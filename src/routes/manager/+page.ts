import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params, url }) => {
    const { supabase, session } = await parent();

    // Fetch staff profiles
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff');

    if (profilesError) {
        console.error('Error fetching profiles data:', profilesError);
        return { profiles: null, user_profile: null }; // Return a fallback value to avoid null handling issues
    }

    // Fetch user profile
    const { data: user_profile, error: userProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user.id)
        .single();

    if (userProfileError) {
        console.error('Error fetching user profile data:', userProfileError);
        return { profiles, user_profile: null }; // Return profiles data but null for user profile
    }

    const { data: receipts } = await supabase
        .from('receipts')
        .select('*');

    return { profiles, user_profile, receipts };
};
