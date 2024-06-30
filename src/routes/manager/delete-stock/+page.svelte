<script lang="ts">
    import deleteIcon from '$lib/img/delete-stock.png'; // Replace with the actual path to your delete icon
    import { tick } from 'svelte';
    import type { PageData } from './$types';

    export let data: PageData;
    export let show = false;
    
    let { supabase, stock } = data;
    $: ({ supabase, stock } = data);

    let selectedItems = new Set();

    // Function to close the modal
    const closeModal = async () => {
        show = false;
        await tick(); // Wait until DOM is updated before taking further actions
        console.log('Modal closed, show:', show);
    };

    // Function to delete selected stock items
    const handleDelete = async () => {
        console.log('Deleting stock items:', Array.from(selectedItems));
        const { error } = await supabase
            .from('stock')
            .delete()
            .in('id', Array.from(selectedItems));

        if (error) {
            console.error('Error deleting stock items:', error);
        } else {
            closeModal();
        }
    };

    // Toggle selection of stock item
    const toggleSelection = (id) => {
        if (selectedItems.has(id)) {
            selectedItems.delete(id);
        } else {
            selectedItems.add(id);
        }
    };

    // Watch for changes in `show` prop to clear selection if needed
    $: {
        if (!show) {
            selectedItems.clear();
        }
    }
</script>

{#if show}
    <div class="modal-backdrop" on:click={closeModal} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && closeModal()}>
        <div class="modal-content" on:click|stopPropagation>
            <div class="modal-header">
                <img src={deleteIcon} alt="Delete Icon" class="w-10 h-10" />
                <h2>Delete Product</h2>
                <button on:click={closeModal} class="close-btn" aria-label="Close modal">&times;</button>
            </div>
            
            <div class="border bg-white">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th class="border border-black p-2">Delete</th>
                            <th class="border border-black p-2">No.</th>
                            <th class="border border-black p-2">Name</th>
                            <th class="border border-black p-2">Per Unit (RM)</th>
                            <th class="border border-black p-2">Quantity</th>
                            <th class="border border-black p-2">Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each stock as item, index}
                            <tr>
                                <td class="border border-black p-2">
                                    <input type="checkbox" on:change={() => toggleSelection(item.id)} />
                                </td>
                                <td class="border border-black p-2">{index + 1}</td>
                                <td class="border border-black p-2">{item.name_product}</td>
                                <td class="border border-black p-2">{item.price_product.toFixed(2)}</td>
                                <td class="border border-black p-2">{item.quantity_product}</td>
                                <td class="border border-black p-2">{item.category_product}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <div class="modal-footer">
                <div class="bg-white rounded-lg border border-black">
                    <button on:click={closeModal}>Cancel</button>
                </div>
                <div class="bg-white rounded-lg border border-black">
                    <button on:click={handleDelete}>Confirm</button>
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
        width: 700px;
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
