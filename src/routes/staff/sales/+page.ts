import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
    const { supabase } = await parent();

    // Ensure that you are fetching the correct data; this assumes single row expected.
    const { data: stock} = await supabase
        .from('stock')
        .select('*');

    const { data: cart, error } = await supabase
        .from('cart')
        .select('*');
    
    if (error) {
        console.error('Error fetching stock data:', error);
        return { stock, cart: [] }; // Return a fallback value to avoid null handling issues
    }

    return { stock, cart };
};
