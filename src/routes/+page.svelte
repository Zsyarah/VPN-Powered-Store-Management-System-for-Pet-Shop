<script>
  import { goto, invalidateAll } from '$app/navigation';
  import logo from '$lib/img/logo.png';
  import background from '$lib/img/background.png';

  const src = background;

  export let data;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  let email = '';
  let password = '';
  let errorMessage = '';
  let loading = false;

  const handleSignIn = async () => {
    if (email !== '' && password !== '') {
      loading = true;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (!error) {
        errorMessage = '';
        const { data: user_info } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
        invalidateAll().then(() => {
          goto(`/${user_info?.role || 'staff'}`);
        });
      } else {
        errorMessage = error?.message;
      }
    } else {
      errorMessage = 'Please fill Email or Password';
    }
    loading = false;
  };
</script>

<div style="background-image: url({src});" class="flex justify-center items-center h-screen bg-cover bg-no-repeat">
  <div class=" bg-pink-300 p-2 rounded-lg shadow-lg text-center">
    <div class="bg-white p-4 rounded-lg shadow-lg text-center">
    <img src={logo} alt="Pet Shop Logo" class="mx-auto w-45 mb-1" />
    <div class=" bg-pink-300 p-2 rounded-lg shadow-lg text-center">
    <h2 class="text-2xl font-semibold mb-4">LOGIN</h2>
    <form on:submit|preventDefault={handleSignIn} class="space-y-2">
      <div>
        <label for="email" class="block text-left font-semibold text-gray-700">Username:</label>
        <input
          type="text"
          id="email"
          bind:value={email}
          placeholder="Type your email here"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div>
        <label for="password" class="block text-left font-semibold text-gray-700">Password:</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Type your password here"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
        <p class="mt-2 text-lg text-red-600">{errorMessage}</p>
      </div>
      <button
        type="submit"
        disabled={loading}
        class="w-full bg-white hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition duration-200"
      >
        Login
      </button>
    </form>
  </div>
  </div>
  </div>
</div>
