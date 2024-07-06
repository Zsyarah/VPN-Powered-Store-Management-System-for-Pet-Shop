import type { PageLoad } from './$types';

export const load = (async ({ parent, url }) => {
	const { supabase, session } = await parent();
	const { data: user_profile } = await supabase
		.from('profiles')
		.select(`*`)
		.eq('id', session?.user.id)
		.single();

	const { data: stock, error } = await supabase
        .from('stock')
        .select('*');

    if (error) {
        console.error('Error fetching stock data:', error);
        return { stock: null }; // Return a fallback value to avoid null handling issues
    }

	return { user_profile, stock };
}) satisfies PageLoad;
