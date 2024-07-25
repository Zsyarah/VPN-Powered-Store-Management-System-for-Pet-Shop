<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
    import logo from '$lib/img/logo.png';
    import background from '$lib/img/background.png';

	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

    const src = background;

	let loading = false;
	let newPassword = '';
	let confirmPassword = '';
	let successMessage = '';
	let errorMessage = '';

	const handleUpdatePassword = async () => {
		if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
			errorMessage = 'Passwords do not match or are empty';
			return;
		}
		errorMessage = '';
		loading = true;

		const { error } = await supabase.auth.updateUser({ password: newPassword });
		if (error) {
			errorMessage = error.message;
		} else {
			successMessage = 'Password has been successfully updated!';
			setTimeout(() => {
				goto('/');
			}, 3000); // Redirect to login page after 3 seconds
		}

		loading = false;
	};
</script>

<div style="background-image: url({src});" class="flex justify-center items-center h-screen bg-cover bg-no-repeat">
    <div class=" bg-pink-300 p-2 rounded-lg shadow-lg text-center">
        <div class="bg-white p-4 rounded-lg shadow-lg text-center">
        <img src={logo} alt="Pet Shop Logo" class="mx-auto w-45 mb-1" />
        <div class=" bg-pink-300 p-2 rounded-lg shadow-lg text-center">

        <h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Update Password</h2>
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-6">
                <div class="label">
                    <span class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]">New Password</span>
                </div>
                <input
                    type="password"
                    bind:value={newPassword}
                    placeholder="Enter your new password"
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
                />
            </div>

            <div class="mb-6">
                <div class="label">
                    <span class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]">Confirm Password</span>
                </div>
                <input
                    type="password"
                    bind:value={confirmPassword}
                    placeholder="Confirm your new password"
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
                />
            </div>

            {#if errorMessage !== ''}
                <p class="mt-2 text-sm font-bold text-error border border-solid border-error-content p-3 rounded-xl">
                    {errorMessage}
                </p>
            {/if}

            {#if successMessage !== ''}
                <p class="mt-2 text-sm font-bold text-success border border-solid border-success-content p-3 rounded-xl">
                    {successMessage}
                </p>
            {/if}

            <div class="flex items-center justify-center">
                <button disabled={loading} on:click={handleUpdatePassword} class="border border-gray-400 bg-gray-200 hover:bg-red-800 py-1 px-1 rounded focus:outline-none ">
                    Update Password
                </button>
            </div>
        </form>
    </div>
    </div>
    </div>
</div>