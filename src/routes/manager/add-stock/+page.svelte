<script lang="ts">
    import AddIcon from '$lib/img/add-stock.png'; // Adjust the path accordingly
    import { tick } from 'svelte';
    export let show = false;
    export let stockItem = { name: '', category: '', perUnit: 0, quantity: 0 };

    export let data: PageData;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    // Function to close the modal
    const closeModal = async () => {
        show = false;
        await tick(); // Wait for the DOM to update before taking further actions
        console.log('Modal closed, show:', show);
    };

    // Function to add a stock item
    const handleAdd = async () => {
        try {
            const { data: insertedStock, error } = await supabase.from('stock').insert([
                {
                    name_product: stockItem.name,
                    price_product: parseFloat(stockItem.perUnit.toString()),
                    quantity_product: stockItem.quantity,
                    category_product: stockItem.category
                }
            ]);

            if (error) {
                console.error('Error adding stock item:', error);
            } else {
                console.log('Stock item added:', insertedStock);
                closeModal();
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    // Debug to monitor the change of 'show' state
    $: console.log('Modal show state changed:', show);

    let categoryOption = [
        'All Product',
        'Pets Food',
        'Pets Grooming',
        'Healthcare',
        'Toiletries',
        'Toys & Accessories'
    ];
</script>

{#if show}
    <div class="modal-backdrop" on:click={closeModal} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && closeModal()}>
        <div class="modal-content" on:click|stopPropagation>
            <div class="modal-header">
                <img src={AddIcon} alt="Add Icon" class="w-10 h-10" />
                <h2>Add New Product</h2>
                <button on:click={closeModal} class="close-btn" aria-label="Close modal">&times;</button>
            </div>
            
            <div class="modal-body">
                <label>Name:</label>
                <input type="text" bind:value={stockItem.name} />

                <div>
                    <label for="CategoryProduct" class="mr-2">Category:</label>
                    <select id="CategoryProduct" bind:value={stockItem.category} class="border border-gray-400 p-1 rounded h-8 w-full">
                        {#each categoryOption as value}
                            <option value={value}>{value}</option>
                        {/each}
                    </select>
                </div>
                
                <div>
                    <label>Per Unit (RM)</label>
                    <input type="number" bind:value={stockItem.perUnit} class="w-full" />
                </div>
                
                <div>
                    <label>Quantity</label>
                    <div class="quantity-input">
                        <button on:click={() => stockItem.quantity > 0 ? stockItem.quantity-- : 0} aria-label="Decrease quantity">-</button>
                        <input type="number" bind:value={stockItem.quantity} min="0" />
                        <button on:click={() => stockItem.quantity++} aria-label="Increase quantity">+</button>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <div class="bg-white rounded-lg border border-black">
                    <button on:click={closeModal}>Cancel</button>
                </div>
                <div class="bg-white rounded-lg border border-black">
                    <button on:click={handleAdd}>Confirm</button>
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
