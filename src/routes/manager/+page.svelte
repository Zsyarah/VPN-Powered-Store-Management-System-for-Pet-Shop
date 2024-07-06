<script lang='ts'>
    //import logo from '/mnt/data/image.png'; // Adjust the path if necessary
    import { goto } from '$app/navigation';
	import type { PageData } from './$types';
    import logo from '$lib/img/logo.png';
    import background from '$lib/img/background.png';

    const src = background;

	export let data: PageData;
	let user_profile = data.user_profile;
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

    let totalSales = 100.00;
</script>

<style>
    /* Adding custom styles to match the exact design */
    .scrollbar {
        overflow-y: scroll;
        height: 200px; /* Adjust as needed */
    }
</style>

<div style="background-image: url({src});" class="justify-center items-center bg-cover bg-no-repeat p-6">
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
        <button class="px-14 py-2 rounded-lg bg-gray-200 border-2 border-gray-400" on:click={ handledashboard }>Dashboard</button>
        <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={ handlestock }>Stock</button>
        <button class="px-16 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={ handleadduser }>Add User</button>
        <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={ handleuserlist }>User</button>
        </div>

    <div class=" bg-white p-4 rounded-lg shadow-lg text-center">
        <!-- Main Dashboard Content -->
        <div class="grid grid-cols-3 gap-4">
        <!-- Total Sales -->
        <div class="col-span-1 bg-gray-100 p-4 rounded-lg text-center border-dotted border-4 border-gray-400">
            <h2 class="text-2xl font-semibold mb-2">Total Sales</h2>
            <div class="text-6xl font-bold text-green-500 mb-2 px-6 py-10 border border-gray-400">RM {totalSales.toFixed(2)}</div>
        </div>

        <!-- Staff List -->
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

        <!-- List Sales -->
        <div class="mt-4 bg-gray-100 p-4 rounded-lg border-dotted border-4 border-gray-400">
        <h2 class="text-2xl font-semibold mb-2 text-center">List Sales</h2>
        <div class="scrollbar border border-gray-400 rounded-lg p-2">
            <table class="w-full text-left border-collapse">
            <thead>
                <tr>
                <th class="border border-gray-400 p-2">No.</th>
                <th class="border border-gray-400 p-2">Quantity</th>
                <th class="border border-gray-400 p-2">No. of Receipt</th>
                <th class="border border-gray-400 p-2">Total (RM)</th>
                </tr>
            </thead>
            <tbody>
                <!-- Sample sales data -->
                <tr>
                <td class="border border-gray-300 p-2">1</td>
                <td class="border border-gray-300 p-2">2</td>
                <td class="border border-gray-300 p-2">12345</td>
                <td class="border border-gray-300 p-2">50.00</td>
                </tr>
                <tr>
                <td class="border border-gray-300 p-2">2</td>
                <td class="border border-gray-300 p-2">1</td>
                <td class="border border-gray-300 p-2">12346</td>
                <td class="border border-gray-300 p-2">50.00</td>
                </tr>
                <!-- Add more rows as needed -->
            </tbody>
            </table>
        </div>
        </div>
    </div></div>
</div>
