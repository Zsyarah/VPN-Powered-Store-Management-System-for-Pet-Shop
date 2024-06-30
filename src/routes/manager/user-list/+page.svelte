<script lang='ts'>
    import { goto, invalidate } from '$app/navigation';
    import { tick } from 'svelte';
    import logo from '$lib/img/logo.png';
    import background from '$lib/img/background.png';
    import deleteIcon from '$lib/img/delete.png';
    import type { PageData } from './$types';

    export let data: PageData;
    let profiles = data.profiles;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    const src = background;

    let showModals = false;
    let userIdToDelete: any = null;
   
    const handleDeleteClick = async (id: any) => {
        userIdToDelete = id;
        showModals = false;
        await tick();
        showModals = true;
        console.log('Delete user button clicked, showModals:', showModals);
    };

    const confirmDelete = async () => {
        try {
            showModals = false;
            const { error: profileError } = await supabase.from('profiles').delete().eq('id', userIdToDelete);

            if (profileError) {
                console.error('Error deleting profile:', profileError.message);
            } else {
                console.log('Profile deleted successfully');
                
                // Use fetch with service role key
                const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z3dzbmhlYnNvZWVpdm11Y291Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzM5ODA4NiwiZXhwIjoyMDMyOTc0MDg2fQ.HkDrBSZeDqJ0VnTM9dYGMfXG51_-X4dmusVj1HiM0nY';
                const { error: authError } = await fetch(
                    `https://bvgwsnhebsoeeivmucou.supabase.co/auth/v1/admin/users/${userIdToDelete}`, 
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': serviceRoleKey,
                            'Authorization': `Bearer ${serviceRoleKey}`
                        }
                    }
                );

                if (authError) {
                    console.error('Error deleting auth user:', authError.message);
                } else {
                    console.log('Auth user deleted successfully');
                    await invalidate('manager/profiles');
                    console.log('User list invalidated');
                    profiles = profiles.filter(user => user.id !== userIdToDelete);
                    userIdToDelete = null;
                }
            }
        } catch (err) {
            console.error('Unexpected error during user deletion:', err);
        }
    };

    const handleSignOut = async () => {
        console.log('User signed out');
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
</script>

<div style="background-image: url({src});" class="justify-center items-center h-screen p-6 bg-no-repeat bg-cover">
    <div class="flex justify-between items-center">
        <img src={logo} alt="Pet Shop Logo" class="w-40 h-auto" />
        <div>
            <button class="text-white bg-red-500 hover:bg-red-700 px-5 py-1 border border-black rounded-lg" on:click={handleSignOut}>Log Out</button>
        </div>
    </div>

    <div class="bg-pink-300 p-2 rounded-lg shadow-lg text-center">
        <div class="flex items-baseline space-x-0">
            <button class="px-14 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={handledashboard}>Dashboard</button>
            <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={handlestock}>Stock</button>
            <button class="px-16 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={handleadduser}>Add User</button>
            <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={handleuserlist}>User</button>
        </div>

        <div class="w-full bg-white p-4 rounded-lg text-center">
            <div class="w-full bg-pink-100 p-4 rounded-lg text-center border border-gray-400">     
                <h2 class="text-2xl font-bold mb-4">List User</h2>
                <table class="w-full table-auto">
                    <thead>
                        <tr class="bg-white">
                            <th class="border border-gray-400 px-4 py-2">No.</th>
                            <th class="border border-gray-400 px-4 py-2">Username</th>
                            <th class="border border-gray-400 px-4 py-2">Email</th>
                            <th class="border border-gray-400 px-4 py-2">Phone</th>
                            <th class="border border-gray-400 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each profiles as user, index}
                            <tr class="bg-white">
                                <td class="border border-gray-400 px-4 py-2 text-left">{index + 1}</td>
                                <td class="border border-gray-400 px-4 py-2 text-left">{user.username}</td>
                                <td class="border border-gray-400 px-4 py-2 text-left">{user.email}</td>
                                <td class="border border-gray-400 px-4 py-2 text-left">{user.phone}</td>
                                <td class="border border-gray-400 px-4 py-2 text-center">
                                    <button on:click={() => handleDeleteClick(user.id)} title="Delete">
                                        <img src={deleteIcon} alt="Delete Icon" class="w-10 h-10 border border-black bg-red-500" />
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

{#if showModals}
  <div class="modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-md text-center">
      <p>Are you sure you want to delete this user?</p>
      <button on:click={confirmDelete} class="specialBtnDark hover:bg-red-900 p-2 m-2 px-4 py-2 mt-4">Yes</button>
      <button on:click={() => (showModals = false)} class="specialBtn p-2 m-2 px-4 py-2 mt-4">No</button>
    </div>
  </div>
{/if}

<style>
    .modal {
        @apply fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75;
    }
</style>
