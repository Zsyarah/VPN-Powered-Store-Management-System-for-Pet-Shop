<script lang='ts'>
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import logo from '$lib/img/logo.png';
    import background from '$lib/img/background.png';

    const src = background;

    // Data provided from the parent component or API
    export let data: PageData;
    let stock = data.stock;
    let cart = data.cart;

    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    // Shopping cart state
    let filter = "All Product";

    // Function to handle user logout
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        goto('/', { replaceState: true });
    };

    // Functions to manage cart operations
    async function addToCart(product, quantity) {
        console.log("addToCart called with product:", product, "and quantity:", quantity);
        let item = cart.find(item => item.stock_id === product.id);

        if (item) {
            item.quantity += quantity;
            if (item.quantity <= 0) {
                await supabase.from('cart').delete().eq('stock_id', product.id);
                cart = cart.filter(item => item.stock_id !== product.id);
            } else {
                await supabase.from('cart').update({ quantity: item.quantity }).eq('stock_id', product.id);
                cart = [...cart]; // Trigger reactivity
            }
        } else {
            if (quantity > 0) {
                await supabase.from('cart').insert([{ stock_id: product.id, quantity, added_date: new Date() }]);
                cart = [...cart, { stock_id: product.id, quantity }];
            }
        }
        cart = [...cart]; // Ensure reactivity is triggered
        console.log("Updated cart:", cart);
    }

    async function clearCart() {
        const { error } = await supabase.from('cart').delete().neq('stock_id', 0);
        if (error) {
            console.error('Error clearing cart:', error);
        } else {
            cart = [];
            cart = [...cart]; // Trigger reactivity
            console.log('Cart cleared');
        }
    }

    async function confirmCart() {
        for (let item of cart) {
            const product = stock.find(product => product.id === item.stock_id);
            if (product) {
                const sale_date = new Date().toISOString().split('T')[0];
                const sale_price = product.price_product;

                const { data, error } = await supabase.from('sales').insert([{
                    stock_id: item.stock_id,
                    sale_date: sale_date,
                    sale_quantity: item.quantity,
                    sale_price: sale_price
                }]);

                if (error) {
                    console.error('Error inserting sale:', error);
                } else {
                    console.log('Sale inserted:', data);

                    const new_quantity = product.quantity_product - item.quantity;
                    const { error: stockError } = await supabase.from('stock')
                        .update({ quantity_product: new_quantity })
                        .eq('id', item.stock_id);

                    if (stockError) {
                        console.error('Error updating stock:', stockError);
                    } else {
                        console.log('Stock updated for product ID:', item.stock_id);
                    }
                }
            }
        }

        const { error } = await supabase.from('cart').delete().neq('stock_id', 0);
        if (error) {
            console.error('Error clearing cart:', error);
        } else {
            console.log('Cart cleared');
        }

        cart = [];
        cart = [...cart]; // Trigger reactivity
        alert('Order confirmed!');
    }

    // Calculate the total price of items in the cart
    $: total = calculateTotal();

    function calculateTotal() {
        const newTotal = cart.reduce((total, item) => {
            const product = stock.find(product => product.id === item.stock_id);
            return total + (product.price_product * item.quantity);
        }, 0).toFixed(2);

        console.log("Total calculated:", newTotal);
        return newTotal;
    }

    const handledashboard = async () => {
        goto('/staff');
    };

    const handlesales = async () => {
        goto('/staff/sales');
    };

    const handleviewstock = async () => {
        goto('/staff/view-stock');
    };

    const handleDropdownChange = (event: Event) => {
        filter = (event.target as HTMLSelectElement).value;
    };

    let categoryoption: string[] = [
        'All Product',
        'Pets Food',
        'Pets Grooming',
        'Healthcare',
        'Toiletries',
        'Toys & Accessories'
    ];

    let selectedCategory: string = categoryoption[0];
</script>

<!-- Main UI -->
<div style="background-image: url({src});" class="justify-center items-center h-screen p-6 bg-no-repeat bg-cover">
    <div class="flex justify-between items-center">
        <img src={logo} alt="Pet Shop Logo" class="w-40 h-auto" />

        <div>
            <button class="text-white bg-red-500 hover:bg-red-700 px-5 py-1 border border-black rounded-lg" on:click={handleSignOut}>Log Out</button>
        </div>
    </div>

    <div class="bg-pink-300 p-2 rounded-lg shadow-lg text-center">
        <div class="flex items-baseline space-x-0">
            <button class="px-16 py-2 bg-white rounded-lg hover:bg-gray-200 border-solid border-2 border-gray-400" on:click={handledashboard}>Dashboard</button>
            <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-solid border-2 border-gray-400" on:click={handleviewstock}>Stock</button>
            <button class="px-20 py-2 rounded-lg bg-gray-200 border-solid border-2 border-gray-400" on:click={handlesales}>Sales</button>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-lg text-center">
            <div class="flex justify-end mb-2">
                <div class="flex">
                    <label for="CategoryProduct" class="mr-2">Category:</label>
                    <select id="CategoryProduct" bind:value={selectedCategory} on:change={handleDropdownChange} class="border border-gray-400 p-1 rounded h-8 w-full">
                        {#each categoryoption as value}
                            <option value={value}>{value}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
                <div class="col-span-2 bg-gray-100 p-4 rounded-lg text-center border-dotted border-4 border-gray-400">
                    <h2 class="text-2xl font-semibold mb-2 text-center">List Stock</h2>
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th class="border border-gray-400 p-2">No.</th>
                                <th class="border border-gray-400 p-2">Name</th>
                                <th class="border border-gray-400 p-2">Category</th>
                                <th class="border border-gray-400 p-2">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each stock.filter(stock => filter === 'All Product' || stock.category_product === filter) as product, index}
                                <tr>
                                    <td class="border p-2 border-gray-300">{index + 1}</td>
                                    <td class="border p-2 border-gray-300">{product.name_product}</td>
                                    <td class="border p-2 border-gray-300">{product.category_product}</td>
                                    <td class="border p-2 border-gray-300">
                                        <div class="flex items-center">
                                            <button class="px-2 py-1 bg-gray-300 rounded-lg" on:click={() => addToCart(product, -1)} disabled={cart.find(item => item.stock_id === product.id)?.quantity <= 0}>-</button>
                                            <span class="mx-2">{cart.find(item => item.stock_id === product.id)?.quantity || 0}</span>
                                            <button class="px-2 py-1 bg-gray-300 rounded-lg" on:click={() => addToCart(product, 1)}>+</button>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>

                <div class="col-span-1 bg-gray-100 p-4 rounded-lg border-dotted border-4 border-gray-400">
                    <h2 class="text-xl font-bold mb-4">🛒 Cart</h2>
                    <div>
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th class="border border-gray-400 p-2">Name</th>
                                    <th class="border border-gray-400 p-2">Quantity</th>
                                    <th class="border border-gray-400 p-2">Per Unit (RM)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each cart as item}
                                    <tr>
                                        <td class="border border-gray-300 p-2">{stock.find(product => product.id === item.stock_id).name_product}</td>
                                        <td class="border border-gray-300 p-2">{item.quantity}</td>
                                        <td class="border border-gray-300 p-2">{stock.find(product => product.id === item.stock_id).price_product.toFixed(2)}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                    <div class="text-right mb-4">
                        <strong>Total:</strong> RM {total}
                    </div>
                    <div class="flex justify-between">
                        <button class="px-4 py-2 bg-white rounded-lg border border-gray-400" on:click={clearCart}>Clear</button>
                        <button class="px-4 py-2 bg-white rounded-lg border border-gray-400" on:click={confirmCart}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #d1d5db #f3f4f6;
    }
    .scrollbar::-webkit-scrollbar {
        width: 8px;
    }
    .scrollbar::-webkit-scrollbar-track {
        background: #f3f4f6;
    }
    .scrollbar::-webkit-scrollbar-thumb {
        background-color: #d1d5db;
        border-radius: 10px;
        border: 3px solid #f3f4f6;
    }
</style>
