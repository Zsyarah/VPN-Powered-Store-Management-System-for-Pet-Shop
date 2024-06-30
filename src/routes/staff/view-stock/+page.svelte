<script lang='ts'>
    //import logo from '/mnt/data/image.png'; // Adjust the path if necessary
    import { goto } from '$app/navigation';
	  import type { PageData } from './$types';
    import logo from '$lib/img/logo.png';
    import background from '$lib/img/background.png';
    export let stockItem = { name: '', category: '', perUnit: 0, quantity: 0 };

    const src = background;
  
    export let data: PageData; // Data fetched by `view.ts`
    let stock = data.stock;
	  let { supabase, session } = data;
	  $: ({ supabase, session } = data);
  
    let filter = "All Product";
  
    const handleSignOut = async () => {
        console.log('User signed out');
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

  let categoryOption = [
        'All Product',
        'Pets Food',
        'Pets Grooming',
        'Healthcare',
        'Toiletries',
        'Toys & Accessories'
    ];
  
  const handleDropdownChange = (event: Event) => {
		filter = (event.target as HTMLSelectElement).value;
	};

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
            <button class="px-16 py-2 bg-white rounded-lg hover:bg-gray-200 border-solid border-2 border-gray-400" on:click={handledashboard}>Dashboard</button>
            <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-solid border-2 border-gray-400" on:click={handleviewstock}>Stock</button>
            <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-solid border-2 border-gray-400" on:click={handlesales}>Sales</button>
      </div>
  
      <!-- Product List Table -->
      <div class="bg-white p-4 rounded-lg">

        <!-- Filter Dropdown -->
      <div class="flex justify-end mb-2">
        <div class="relative inline-block text-left">
          <div>
            <div class="flex">
                <label for="CategoryProduct" class="mr-2">Category:</label>
                    <select id="CategoryProduct" bind:value={filter} class="border border-gray-400 p-1 rounded h-8 w-full" on:change={handleDropdownChange}>
                    {#each categoryOption as value}
                    <option value={value}>{value}</option>
                    {/each}
                    </select>
            </div>
          </div>
        </div>
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
              {#each stock.filter(stock => filter === 'All Product' || stock.category_product === filter) as product, index}
                  <tr>
                    <td class="border border-gray-300 p-2">{index + 1}</td>
                    <td class="border border-gray-300 p-2">{product.name_product}</td>
                    <td class="border border-gray-300 p-2">{product.price_product.toFixed(2)}</td>
                    <td class="border border-gray-300 p-2">{product.quantity_product}</td>
                    <td class="border border-gray-300 p-2">{product.category_product}</td>
                  </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div></div>
  
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
  