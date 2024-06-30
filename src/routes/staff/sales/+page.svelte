<script lang='ts'>
    //import logo from '/mnt/data/image.png'; // Adjust the path if necessary
    import { goto } from '$app/navigation';
	import type { PageData } from './$types';
    import logo from '$lib/img/logo.png';
    import background from '$lib/img/background.png';

    const src = background;

    // Data provided from the parent component or API
    export let data: PageData;
    let { supabase, session } = data;
    let user_profile = data.user_profile;
    export let stockItem = { name: '', category: '', perUnit: 0, quantity: 0 };

    // Sample sales and stock data
    let sales = [
        { no: 1, quantity: 10, receipt: "001", total: 100.00 },
        { no: 2, quantity: 5, receipt: "002", total: 50.00 }
        // Add more sales data as needed
    ];

    let stock = [
        { no: 1, productName: "Dog Food", unitPrice: 10.00, quantity: 50, category: "Food" },
        { no: 2, productName: "Cat Toy", unitPrice: 5.00, quantity: 100, category: "Toys" }
        // Add more stock data as needed
    ];

    // Shopping cart state
    let cart = [];
    let filter = "All Product";

    // Function to handle user logout
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        goto('/', { replaceState: true });
    };

    // Functions to manage cart operations
    function addToCart(product, quantity) {
        const item = cart.find(item => item.product.no === product.no);
        if (item) {
            item.quantity += quantity;
        } else {
            cart.push({ product, quantity });
        }
    }

    function clearCart() {
        cart = [];
    }

    function confirmCart() {
        alert('Order confirmed!');
    }

    function calculateTotal() {
        return cart.reduce((total, item) => total + item.product.unitPrice * item.quantity, 0).toFixed(2);
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

    let categoryOption = [
        'All Product',
        'Pets Food',
        'Pets Grooming',
        'Healthcare',
        'Toiletries',
        'Toys & Accessories'
    ];

</script>

<div style="background-image: url({src});" class="justify-center items-center h-screen p-6 bg-no-repeat bg-cover">
    <div class="flex justify-between items-center">
        <!-- Header with Logo -->
        <img src={logo} alt="Pet Shop Logo" class="w-40 h-auto" />

        <!-- Log Out Button -->
        <div>
            <button class="text-white bg-red-500 hover:bg-red-700 px-5 py-1 border border-black rounded-lg" on:click={handleSignOut}>Log Out</button>
        </div>
    </div>
    
    <div class=" bg-pink-300 p-2 rounded-lg shadow-lg text-center">
        <!-- Navigation Tabs -->
        <div class="flex items-baseline space-x-0">
            <button class="px-16 py-2 bg-white rounded-lg hover:bg-gray-200 border-solid border-2 border-gray-400" on:click={handledashboard}>Dashboard</button>
            <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-solid border-2 border-gray-400" on:click={handleviewstock}>Stock</button>
            <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-solid border-2 border-gray-400" on:click={handlesales}>Sales</button>
        </div>
    <div class="bg-white p-4 rounded-lg shadow-lg text-center">
        <!-- Filter Dropdown -->
        <div class="flex justify-end mb-2">
            <div class="flex">
                <label for="CategoryProduct" class="mr-2">Category:</label>
                    <select id="CategoryProduct" bind:value={stockItem.category} class="border border-gray-400 p-1 rounded h-8 w-full">
                    {#each categoryOption as value}
                    <option value={value}>{value}</option>
                    {/each}
                    </select>
            </div>
        </div>

        <!-- Product List and Cart -->
        <div class="grid grid-cols-3 gap-4">
            <!-- Product List Table -->
            <div class="col-span-2 bg-gray-100 p-4 rounded-lg text-center border-dotted border-4 border-gray-400">
                <h2 class="text-2xl font-semibold mb-2 text-center">List Stock</h2>
                    <table class="w-full text-left border-collapse">
                    <thead>
                    <tr>
                        <th class="border border-gray-300 p-2">No.</th>
                        <th class="border border-gray-300 p-2">Name</th>
                        <th class="border border-gray-300 p-2">Category</th>
                        <th class="border border-gray-300 p-2">Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                        {#each stock as product}
                        {#if filter === "All Product" || product.category === filter}
                    <tr>
                        <td class="border p-2 border-gray-300">{product.no}</td>
                        <td class="border p-2 border-gray-300">{product.productName}</td>
                        <td class="border p-2 border-gray-300">{product.category}</td>
                        <td class="border p-2 border-gray-300">
                    
                        <div class="flex items-center ">
                        <button class="px-2 py-1 bg-gray-300 rounded-lg" on:click={() => addToCart(product, -1)} disabled={cart.find(item => item.product.no === product.no)?.quantity <= 0}>-</button>
                        <span class="mx-2">{cart.find(item => item.product.no === product.no)?.quantity || 0}</span>
                        <button class="px-2 py-1 bg-gray-300 rounded-lg" on:click={() => addToCart(product, 1)}>+</button>
                    </div>
                    </td>
                    </tr>
                        {/if}
                        {/each}
                    </tbody>
                    </table>
            </div>

            <!-- Shopping Cart -->
            <div class="col-span-1 bg-gray-100 p-4 rounded-lg border-dotted border-4 border-gray-400">
                <h2 class="text-xl font-bold mb-4">🛒 Cart</h2>
                <div>
                    <table class="w-full text-left border-collapse ">
                        <thead>
                            <tr>
                                <th class="border border-gray-300 p-2">Name</th>
                                <th class="border border-gray-300 p-2">Quantity</th>
                                <th class="border border-gray-300 p-2">Per Unit (RM)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each cart as item}
                                <tr>
                                    <td class="border border-gray-300 p-2">{item.product.productName}</td>
                                    <td class="border border-gray-300 p-2">{item.quantity}</td>
                                    <td class="border border-gray-300 p-2">{item.product.unitPrice.toFixed(2)}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                <div class="text-right mb-4">
                    <strong>Total:</strong> RM {calculateTotal()}
                </div>
                <div class="flex justify-between">
                    <button class="px-4 py-2 bg-white rounded-lg border border-gray-400" on:click={clearCart}>Clear</button>
                    <button class="px-4 py-2 bg-white rounded-lg border border-gray-400" on:click={confirmCart}>Confirm</button>
                </div>
                </div>
        </div></div>
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
