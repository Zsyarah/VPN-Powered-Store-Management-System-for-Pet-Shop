import type { PageLoad } from './$types';

export const load = (async ({ parent, url }) => {
	const { supabase, session } = await parent();
	const { data: user_profile } = await supabase
		.from('profiles')
		.select(`*`)
		.eq('id', session?.user.id)
		.single();

	return { user_profile };
}) satisfies PageLoad;
