<script lang="ts">
    import updateIcon from '$lib/img/update-stock.png'; // Replace with the actual path to your update icon
    import { tick } from 'svelte';
    import type { PageData } from './$types';

    export let data: PageData;
    export let show = false;
    
    let { supabase, session, stock } = data;
    $: ({ supabase, session, stock } = data);

    let categoryoption: string[] = [
        'All Product',
        'Pets Food',
        'Pets Grooming',
        'Healthcare',
        'Toiletries',
        'Toys & Accessories'
    ];
    let nameoption: string[] = [];
    let selectedCategory: string = categoryoption[0];
    let selectedName: string;
    let selectedStockItem;

    const closeModal = () => {
        show = false;
    };

    const handleUpdate = async () => {
        console.log('Updating stock item:', selectedStockItem);
        const { id, quantity_product, price_product } = selectedStockItem;
        const { error } = await supabase
            .from('stock')
            .update({ quantity_product, price_product })
            .eq('id', id);

        if (error) {
            console.error('Error updating stock item:', error);
        } else {
            closeModal();
        }
    };

    const fetchNames = async () => {
        let query = supabase.from('stock').select('name_product');
        if (selectedCategory !== 'All Product') {
            query = query.eq('category_product', selectedCategory);
        }

        const { data: names, error: nameError } = await query;

        if (nameError) {
            console.error('Error fetching names:', nameError);
        } else {
            nameoption = names.map(item => item.name_product);
        }
    };

    const fetchStockItem = async () => {
        const { data: items, error: itemError } = await supabase
            .from('stock')
            .select('*')
            .eq('category_product', selectedCategory)
            .eq('name_product', selectedName);

        if (itemError) {
            console.error('Error fetching stock item:', itemError);
        } else if (items && items.length > 0) {
            selectedStockItem = items[0];
        }
    };

    // Fetch names when selectedCategory changes
    $: {
        if (selectedCategory) {
            fetchNames();
        }
    }

    // Fetch stock item when selectedName changes
    $: {
        if (selectedCategory && selectedName) {
            fetchStockItem();
        }
    }

    // Refetch options if needed when the modal is shown
    $: {
        if (show) {
            fetchNames();
        }
    }
</script>

{#if show}
    <div class="modal-backdrop" on:click={closeModal} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && closeModal()}>
        <div class="modal-content" on:click|stopPropagation>
            <div class="modal-header">
                <img src={updateIcon} alt="Update Icon" class="w-10 h-10" />
                <h2>Update</h2>
                <button on:click={closeModal} class="close-btn" aria-label="Close modal">&times;</button>
            </div>

            <div class="modal-body">
                <div>
                    <label for="CategoryProduct" class="mr-2">Category:</label>
                    <select id="CategoryProduct" bind:value={selectedCategory} class="border border-gray-400 p-1 rounded h-8 w-full">
                        {#each categoryoption as value}
                            <option value={value}>{value}</option>
                        {/each}
                    </select>
                </div>

                {#if selectedCategory}
                    <div>
                        <label for="NameProduct" class="mr-2">Name:</label>
                        <select id="NameProduct" bind:value={selectedName} class="border border-gray-400 p-1 rounded h-8 w-full">
                            {#each nameoption as value}
                                <option value={value}>{value}</option>
                            {/each}
                        </select>
                    </div>
                {/if}

                {#if selectedStockItem}
                    <label>Per Unit (RM)</label>
                    <input type="number" bind:value={selectedStockItem.price_product} />

                    <label>Quantity</label>
                    <div class="quantity-input">
                        <button on:click={() => selectedStockItem.quantity_product > 0 ? selectedStockItem.quantity_product-- : 0} aria-label="Decrease quantity">-</button>
                        <input bind:value={selectedStockItem.quantity_product} min="0" />
                        <button on:click={() => selectedStockItem.quantity_product++} aria-label="Increase quantity">+</button>
                    </div>
                {/if}
            </div>
            
            <div class="modal-footer">
                <div class="bg-white rounded-lg border border-black">
                    <button on:click={closeModal}>Cancel</button>
                </div>
                <div class="bg-white rounded-lg border border-black">
                    <button on:click={handleUpdate}>Update</button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background: #f8d7da;
        padding: 20px;
        border-radius: 8px;
        position: relative;
        width: 300px;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
    }

    .modal-body {
        display: flex;
        flex-direction: column;
    }

    .quantity-input {
        display: flex;
        align-items: center;
    }

    .quantity-input button {
        background: none;
        border: 1px solid #ccc;
        width: 30px;
        height: 30px;
        cursor: pointer;
    }

    .modal-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }

    .modal-footer button {
        padding: 5px 10px;
    }
</style>
