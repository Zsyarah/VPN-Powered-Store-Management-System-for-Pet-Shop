<script lang='ts'>
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import logo from '$lib/img/logo.png';
    import background from '$lib/img/background.png';

    const src = background;

    export let data: PageData;
    let receipts = data.receipts;
    let profiles = data.profiles;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        goto('/', { replaceState: true });
    };

    const handledashboard = async () => {
        goto('/manager');
    };

    const handlestock = async () => {
        goto('/manager/view-stock');
    };

    const handleadduser = async () => {
        goto('/manager/add-user');
    };

    const handleuserlist = async () => {
        goto('/manager/user-list');
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

    // Function to calculate this month's total sales
    const calculateThisMonthsTotalSales = () => {
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('en-CA'); // First day of the current month
        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1).toLocaleDateString('en-CA'); // First day of the next month

        // Filter receipts for the current month
        const monthReceipts = receipts.filter(receipt => {
            const receiptDate = new Date(receipt.receipt_date).toLocaleDateString('en-CA');
            return receiptDate >= monthStart && receiptDate < nextMonthStart;
        });

        // Sum up the totals
        const total = monthReceipts.reduce((sum, receipt) => sum + receipt.total, 0);
        return total.toFixed(2); // Format to two decimal places
    };

    // Get this month's total sales
    const thisMonthsTotalSales = calculateThisMonthsTotalSales();

</script>

<style>
    .scrollbar {
        overflow-y: scroll;
        height: 200px;
    }
</style>

<div style="background-image: url({src});" class="justify-center items-center bg-cover bg-no-repeat p-6">
    <div class="flex justify-between items-center">
        <img src={logo} alt="Pet Shop Logo" class="w-40 h-auto" />
        <div>
            <button class="text-white bg-red-500 hover:bg-red-700 px-5 py-1 border border-black rounded-lg" on:click={handleSignOut}>Log Out</button>
        </div>
    </div>

    <div class=" bg-pink-300 p-2 rounded-lg shadow-lg text-center">
        <div class="flex items-baseline space-x-0">
            <button class="px-14 py-2 rounded-lg bg-gray-200 border-2 border-gray-400" on:click={handledashboard}>Dashboard</button>
            <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={handlestock}>Stock</button>
            <button class="px-16 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={handleadduser}>Add User</button>
            <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={handleuserlist}>User</button>
        </div>

        <div class=" bg-white p-4 rounded-lg shadow-lg text-center">
            <div class="grid grid-cols-3 gap-4">
                <div class="col-span-1 bg-gray-100 p-4 rounded-lg text-center border-dotted border-4 border-gray-400">
                    <h2 class="text-2xl font-semibold mb-2">Total Sales</h2>
                    <!-- Display total sales in this month -->
                    <div class="text-6xl font-bold text-green-500 mb-2 px-6 py-10 border border-gray-400">RM {thisMonthsTotalSales}</div>
                </div>

                <div class="col-span-2 bg-gray-100 p-4 rounded-lg border-dotted border-4 border-gray-400">
                    <h2 class="text-2xl font-semibold mb-2 text-center">Staff List</h2>
                    <div class="scrollbar border border-gray-400 rounded-lg p-2">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th class="border border-gray-400 py-2 px-2 gap-0.25 text-center">No.</th>
                                    <th class="border border-gray-400 py-2 px-4 text-center">Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each profiles as staff, index}
                                    <tr>
                                        <td class="border border-gray-300 py-2 px-2 gap-0.25 text-center">{index + 1}</td>
                                        <td class="border border-gray-300 py-2 px-4 text-center">{staff.username}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="mt-4 bg-gray-100 p-4 rounded-lg border-dotted border-4 border-gray-400">
                <h2 class="text-2xl font-semibold mb-2 text-center">List Sales</h2>
                <div class="scrollbar border border-gray-400 rounded-lg p-2">
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
        </div>
    </div>
</div>
