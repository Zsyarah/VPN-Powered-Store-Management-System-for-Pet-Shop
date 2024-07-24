import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
    const { supabase } = await parent();

    // Fetch stock data
    const { data: stock, error: stockError } = await supabase
        .from('stock')
        .select('*');

    if (stockError) {
        console.error('Error fetching stock data:', stockError);
        return { stock: [], cart: [] }; // Return fallback value to avoid null handling issues
    }

    // Fetch cart data
    const { data: cart, error: cartError } = await supabase
        .from('cart')
        .select('*');

    if (cartError) {
        console.error('Error fetching cart data:', cartError);
        return { stock, cart: [] }; // Return fallback value to avoid null handling issues
    }

    return { stock, cart };
};
