<script lang="ts">
    import { goto } from '$app/navigation';
    import { tick } from 'svelte';
    import logo from '$lib/img/logo.png'; // Adjust the path accordingly
    import background from '$lib/img/background.png'; // Adjust the path accordingly
    import updateIcon from '$lib/img/update-stock.png'; // Adjust the path accordingly
    import addIcon from '$lib/img/add-stock.png'; // Adjust the path accordingly
    import deleteIcon from '$lib/img/delete-stock.png'; // Adjust the path accordingly
    import Update from '../update-stock/+page.svelte';
    import Add from '../add-stock/+page.svelte';
    import Delete from '../delete-stock/+page.svelte';
    import type { PageData } from './$types';

    export let data: PageData; // Data fetched by `view.ts`
    let stock = data.stock;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

    let showModal = false;
    let showModals = false;
    let showModalss = false;
    let selectedStockItem = { name: '', category: '', perUnit: 0, quantity: 0 };

    // Event handlers
    const handleSignOut = async () => {
        console.log('User signed out');
        goto('/', { replaceState: true });
    };

    const handleUpdateClick = async () => {
        showModal = false; // Reset state before opening
        await tick(); // Wait for DOM update
        showModal = true;
        console.log('Update button clicked, showModal:', showModal);
    };

    const handleAddClick = async () => {
        showModals = false; // Reset state before opening
        await tick(); // Wait for DOM update
        showModals = true;
        console.log('Add button clicked, showModals:', showModals);
    };

    const handleDeleteClick = async () => {
        showModalss = false; // Reset state before opening
        await tick(); // Wait for DOM update
        showModalss = true;
        console.log('Delete button clicked, showModalss:', showModalss);
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

    $: console.log('showModal state:', showModal); // Debugging log
    $: console.log('showModals state:', showModals); // Debugging log
    $: console.log('showModalss state:', showModalss); // Debugging log
    
</script>

<!-- Modals for Update, Add, and Delete -->
<Update show={showModal} data={data} />
<Add show={showModals} data={data} />
<Delete show={showModalss} data={data} />

<div style="background-image: url({background});" class="justify-center items-center h-screen p-6 bg-no-repeat bg-cover">
    <div class="flex justify-between items-center">
        <img src={logo} alt="Pet Shop Logo" class="w-40 h-auto" />

        <div>
            <button class="text-white bg-red-500 hover:bg-red-700 px-5 py-1 border border-black rounded-lg" on:click={handleSignOut}>Log Out</button>
        </div>
    </div>

    <div class=" bg-pink-300 p-2 rounded-lg shadow-lg text-center">
        <div class=" bg-pink-300 rounded-lg text-center px-10">
            <div class="flex items-baseline space-x-0">
                <button class="px-14 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={handledashboard}>Dashboard</button>
                <button class="px-20 py-2 rounded-lg bg-gray-200 border-2 border-gray-400" on:click={handlestock}>Stock</button>
                <button class="px-16 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={handleadduser}>Add User</button>
                <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={handleuserlist}>User</button>
            </div>
        </div>

        <div class="flex items-baseline space-x-1">
            <div class="w-10 space-y-4">
                <button></button>
                <button on:click={() => handleUpdateClick(selectedStockItem)} title="Update">
                    <img src={updateIcon} alt="Update Icon" class="w-10 h-10" />
                </button>
                <button on:click={handleAddClick} title="Add">
                    <img src={addIcon} alt="Add Icon" class="w-10 h-10" />
                </button>
                <button on:click={() => handleDeleteClick(selectedStockItem)} title="Delete">
                    <img src={deleteIcon} alt="Delete Icon" class="w-10 h-10" />
                </button>
            </div>

            <div class="w-full bg-white p-4 rounded-lg shadow-lg text-center">
                <div class="flex justify-end mb-2">
                    <label for="CategoryProduck" class="mr-2">Filter by Category:</label>
                    <select id="CategoryProduck" class="border border-gray-400 p-1 rounded h-8">
                        <option value="All">All Product</option>
                        <option value="Pets Food">Pets Food</option>
                        <option value="Pets Grooming">Pets Grooming</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Toiletries">Toiletries</option>
                        <option value="Toys & Accessories">Toys & Accessories</option>
                    </select>
                </div>

                <div class="bg-gray-100 p-4 rounded-lg mb-2 border-dotted border-4 border-gray-400">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th class="border border-gray-400 p-2">No.</th>
                                <th class="border border-gray-400 p-2">Name</th>
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
