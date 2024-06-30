import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
    const { supabase } = await parent();

    // Ensure that you are fetching the correct data; this assumes single row expected.
    const { data: stock, error } = await supabase
        .from('stock')
        .select('*');

    if (error) {
        console.error('Error fetching stock data:', error);
        return { stock: null }; // Return a fallback value to avoid null handling issues
    }

    return { stock };
};
