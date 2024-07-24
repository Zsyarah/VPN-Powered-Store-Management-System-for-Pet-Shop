<script lang="ts">
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import type { LayoutData } from './$types';
	import { onMount } from 'svelte';

    export let data: LayoutData;

    let isstaff = false;
    let isLoading = true;
    let pathStartsWithstaff = false;
    let showMessage = false;

    // Update the component state based on the data
    $: {
        if (data.profiles) {
            isstaff = data.profiles.role === 'staff';
            isLoading = false;
        }
    }

    // Check if the path starts with "/admin"
    $: pathStartsWithstaff = get(page).url.pathname.startsWith('/staff');
</script>

{#if isLoading}
    <p>Loading...</p>
{:else}
    {#if pathStartsWithstaff}
        {#if isstaff}
            {#if showMessage}
                <!--<p>Welcome, staff!</p>-->
            {/if}
            <slot />
        {:else}
            <p>You are not an staff.</p>
        {/if}
    {:else}
        <p>This path is not restricted to staff.</p>
    {/if}
{/if}
