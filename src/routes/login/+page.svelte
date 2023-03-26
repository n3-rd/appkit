<!-- routes/login/+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { state } from '../../store';

	let email = '';
	let password = '';
	let error = null;

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			await state.login(email, password);
			goto('/app');
		} catch (error) {
			alert(error.message);
		}
	};
</script>

<div>
	<h2>Login</h2>
	<form on:submit|preventDefault={handleSubmit}>
		<div>
			<label for="email">Email:</label>
			<input type="email" id="email" name="email" bind:value={email} required />
		</div>
		<div>
			<label for="password">Password:</label>
			<input type="password" id="password" name="password" bind:value={password} required />
		</div>
		<button type="submit">Login</button>
	</form>
</div>

<!-- Style -->
<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 50px;
	}

	div {
		margin-bottom: 20px;
	}

	label {
		display: block;
		margin-bottom: 5px;
	}

	input {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		width: 250px;
	}

	button {
		background-color: #007aff;
		color: #fff;
		border: none;
		border-radius: 5px;
		padding: 10px 20px;
		cursor: pointer;
	}

	button:hover {
		background-color: #0051a8;
	}

	h2 {
		text-align: center;
		font-size: 24px;
		margin-bottom: 20px;
	}
</style>
