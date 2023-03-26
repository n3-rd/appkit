<script>
	import { goto } from '$app/navigation';
	import { state } from '../../store';
	import { onMount } from 'svelte';

	onMount(async () => {
		await state.checkSession().catch(() => {
			goto('/login');
		});
	});
	const logout = async () => {
		await state.logout();
		goto('/login');
	};
</script>

<h1>App</h1>
<button on:click={logout}>Logout</button>
