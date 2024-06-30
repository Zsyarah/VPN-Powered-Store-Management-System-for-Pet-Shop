import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
    const { supabase } = await parent();

    // Ensure that you are fetching the correct data; this assumes single row expected.
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff');

    if (error) {
        console.error('Error fetching profiles data:', error);
        return { profiles: null }; // Return a fallback value to avoid null handling issues
    }

    return { profiles };
};
