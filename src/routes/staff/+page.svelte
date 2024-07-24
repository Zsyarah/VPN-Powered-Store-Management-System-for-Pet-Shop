<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import logo from '$lib/img/logo.png';
    import background from '$lib/img/background.png';

    const src = background;

    export let data: PageData;
    let receipts = data.receipts;
    let stock = data.stock;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        goto('/', { replaceState: true });
    };

    const handledashboard = async () => {
        goto('/staff');
    };

    const handlesales = async () => {
        goto('/staff/sales');
    };

    const handleviewstock = async () => {
        goto('/staff/view-stock');
    };

    // Function to format date and time
    const formatDate = (dateString: string, timeZone: string = 'Asia/Kuala_Lumpur') => {
        const dateOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',

        };
        return new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(dateString));
    };

    // Sample data for demonstration
    let sales = [
        { no: 1, quantity: 10, receipt: "001", total: 100.00 },
        { no: 2, quantity: 5, receipt: "002", total: 50.00 }
        // Add more sales data here
    ];
</script>

<div style="background-image: url({src});" class="justify-center items-center h-screen p-6 bg-no-repeat bg-cover">
    <div>
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
                <button class="px-16 py-2 rounded-lg bg-gray-200 border-solid border-2 border-gray-400" on:click={handledashboard}>Dashboard</button>
                <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-solid border-2 border-gray-400" on:click={handleviewstock}>Stock</button>
                <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-solid border-2 border-gray-400" on:click={handlesales}>Sales</button>
            </div>    

            <div class="bg-white p-4 rounded-lg shadow-lg text-center"> 
                <div class="flex items-start justify-between p-0">                          
                </div>

                <!-- List Sales Section -->
                <div class="bg-gray-100 p-4 rounded-lg mb-2 border-dotted border-4 border-gray-400">
                    <h2 class="text-2xl font-semibold mb-2 text-center">List Sales</h2>
                    <div class="scrollbar border border-gray-400 rounded-lg p-2 overflow-y-auto max-h-40">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th class="border border-gray-400 p-2">No.</th>
                                    <th class="border border-gray-400 p-2">No. of Receipt</th>
                                    <th class="border border-gray-400 p-2">Date/time</th>
                                    <th class="border border-gray-400 p-2">Total (RM)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each receipts as receipt, index}
                                    <tr>
                                        <td class="border border-gray-300 p-2">{index + 1}</td>
                                        <td class="border border-gray-300 p-2">{receipt.receipt_number}</td>
                                        <td class="border border-gray-300 p-2">{formatDate(receipt.receipt_date)}</td>
                                        <td class="border border-gray-300 p-2">{receipt.total.toFixed(2)}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- List Stock Section -->
                <div class="bg-gray-100 p-4 rounded-lg border-dotted border-4 border-gray-400">
                    <h2 class="text-2xl font-semibold mb-2 text-center">List Stock</h2>
                    <div class="scrollbar border border-gray-400 rounded-lg p-2 overflow-y-auto max-h-40">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th class="border border-gray-400 p-2">No.</th>
                                    <th class="border border-gray-400 p-2">Name of Product</th>
                                    <th class="border border-gray-400 p-2">Per Unit (RM)</th>
                                    <th class="border border-gray-400 p-2">Quantity</th>
                                    <th class="border border-gray-400 p-2">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each stock as item, index}
                                    <tr>
                                        <td class="border border-gray-300 p-2">{index + 1}</td>
                                        <td class="border border-gray-300 p-2">{item.name_product}</td>
                                        <td class="border border-gray-300 p-2">{item.price_product.toFixed(2)}</td>
                                        <td class="border border-gray-300 p-2">{item.quantity_product}</td>
                                        <td class="border border-gray-300 p-2">{item.category_product}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #d1d5db #f3f4f6; /* Adjust colors for the scrollbar */
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
