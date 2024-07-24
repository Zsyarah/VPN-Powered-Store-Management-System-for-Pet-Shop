<script lang='ts'>
    //import logo from '/mnt/data/image.png'; // Adjust the path if necessary
    import { goto } from '$app/navigation';
	import type { PageData } from './$types';
    import logo from '$lib/img/logo.png';
    import background from '$lib/img/background.png';

    export let data: PageData;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    const src = background;

    let username = '';
    let email = '';
    let phone = '';
    let password = '';
    let confirmPassword = '';
    let loading = false;
    let errormessage = '';
    let role = 'staff';
  
    const clearForm = () => {
      username = '';
      email = '';
      phone = '';
      password = '';
      confirmPassword = '';
    };

    let error = {
        username:'',
        email:'',
        phone:'',
        password:'',
        confirmPassword:''
    };

    let validate = () => {
        let valid= true;
        error = {
        username:'',
        email:'',
        phone:'',
        password:'',
        confirmPassword:''
        };
        if(!username){
            error.username = 'username is required';
            valid = false;
        };
        if(!email){
            error.email = 'email is required';
            valid = false;
        };
        if(!phone){
            error.phone = 'phone is required';
            valid = false;
        };
        if(!password){
            error.password = 'paasword is required';
            valid = false;
        };
        if(!confirmPassword){
            error.confirmPassword = 'confirm password is required';
            valid = false;
        };
        return valid;
    };

    const handleSignOut = async () => {
		await supabase.auth.signOut();
		goto('/', { replaceState: true });
	};

    const addUser = async () => {
    // Validate form fields
    if (!validate()) {
        console.error('Registration validation failed');
        return;
    }

    // Check if all required fields are filled
    if (!email || !password || !confirmPassword || !username || !phone) {
        errormessage = 'Please fill all fields';
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        errormessage = 'Passwords do not match';
        return;
    }

    // Set loading state to true
    loading = true;

    try {
        // Attempt to sign up the user
        console.log('Attempting to sign up user with email:', email);
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password
        });

        // Handle sign-up error
        if (signUpError) {
            console.error('Sign-up error:', signUpError);
            if (signUpError.status === 429) {
                errormessage = 'Rate limit exceeded. Please try again later.';
            } else {
                errormessage = `Sign-up failed: ${signUpError.message}`;
            }
            return;
        }

        // Log successful sign-up
        console.log('User signed up successfully:', data.user);

        // Update the user's profile in the database
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ username, phone, email, role })
            .eq('id', data.user.id);

        // Handle profile update error
        if (updateError) {
            console.error('Profile update error:', updateError.message);
            errormessage = 'Failed to update user profile. Please try again.';
            return;
        }

        // Log successful profile update
        console.log('User profile updated successfully');

        // Redirect to the user list page with a success message
        goto('/manager/user-list?message=successfully added user.');
    } catch (error) {
        // Catch any unexpected errors
        console.error('Unexpected error:', error);
        errormessage = 'An unexpected error occurred. Please try again later.';
    } finally {
        // Reset loading state
        loading = false;
    }
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
  
<div style="background-image: url({src});" class="justify-center items-center h-screen bg-cover bg-no-repeat p-6">
    <div class="flex justify-between items-center">
        <!-- Header with Logo -->
        <img src={logo} alt="Pet Shop Logo" class="w-40 h-auto" />

        <!-- Log Out Button -->
        <div>
            <button class="text-white bg-red-500 hover:bg-red-700 px-5 py-1 border border-black rounded-lg" on:click={handleSignOut}>Log Out</button>
        </div>
    </div>

    <div class=" bg-pink-300 p-2 rounded-lg shadow-lg">
        <div class="flex items-baseline space-x-0">
            <button class="px-14 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={ handledashboard }>Dashboard</button>
            <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={ handlestock }>Stock</button>
            <button class="px-16 py-2 rounded-lg bg-gray-200 border-2 border-gray-400" on:click={ handleadduser }>Add User</button>
            <button class="px-20 py-2 bg-white rounded-lg hover:bg-gray-200 border-2 border-gray-400" on:click={ handleuserlist }>User</button>
        </div>

      <div class=" bg-white p-4 rounded-lg shadow-lg text-center">
        <div class="col-span-2 w-1/4 mx-auto bg-pink-100 p-4 rounded-lg border-2 border-gray-400">
        <h2 class="text-2xl font-bold mb-4 ">Add User</h2>
            <div class="mb-4">
                <label class="block text-black" for="username">Username</label>
                <input 
                type="text" 
                bind:value={username} 
                class="mt-1 p-2 border border-gray-400 rounded-lg"/>
                {#if error.username}<p class="text-red-900">{error.username}</p>{/if}
            </div>

            <div class="mb-4">
                <label class="block text-black" for="email">Email</label>
                <input 
                type="email" 
                bind:value={email} 
                class="mt-1 p-2 border border-gray-400 rounded-lg"/>
                {#if error.email}<p class="text-red-900">{error.email}</p>{/if}
            </div>

            <div class="mb-4">
                <label class="block text-black" for="phone">Phone no.</label>
                <input  
                bind:value={phone} 
                class="mt-1 p-2 border border-gray-400 rounded-lg"/>
                {#if error.phone}<p class="text-red-900">{error.phone}</p>{/if}
            </div>

            <div class="mb-4">
                <label class="block text-black" for="password">Password</label>
                <input 
                type="password" 
                bind:value={password} 
                class="mt-1 p-2 border border-gray-400 rounded-lg"/>
                {#if error.password}<p class="text-red-900">{error.password}</p>{/if}
            </div>

            <div class="mb-4">
                <label class="block text-black" for="confirmPassword">Confirm Password</label>
                <input 
                type="password" 
                bind:value={confirmPassword} 
                class="mt-1 p-2 border border-gray-400 rounded-lg"/>
                {#if error.confirmPassword}<p class="text-red-900">{error.confirmPassword}</p>{/if}
            </div>

            <p class="text-red-500 text-center text-xs italic">{errormessage}</p>

            <div class="flex justify-between">
                <button 
                class="bg-white text-black py-2 px-4 border border-gray-400 rounded-lg" 
                on:click={clearForm}
                >Clear</button>
                <button 
                class="bg-white text-black py-2 px-4 border border-gray-400 rounded-lg" 
                disabled={loading}
                on:click={addUser}
                >Add</button>
            </div>
        </div>
        </div>
    </div>
</div>



  