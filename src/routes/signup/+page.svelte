<!-- routes/signup/+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { state } from '../../store';

	let email = '';
	let name = '';
	let password = '';
	let confirmPassword = '';
	let error = null;

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (password !== confirmPassword) {
			state.alert({
				color: 'red',
				message: 'Passwords do not match'
			});
			return;
		}
		try {
			await state.signup(email, password, name);
			goto('/app');
		} catch (error) {
			alert(error.message);
		}
	};
</script>

<form on:submit|preventDefault={handleSubmit}>
	<h1>Sign Up</h1>
	<label for="name">Name</label>
	<input type="text" id="name" name="name" bind:value={name} required />
	<label for="email">Email</label>
	<input type="email" id="email" name="email" bind:value={email} required />
	<label for="password">Password</label>
	<input type="password" id="password" name="password" bind:value={password} required />
	<label for="confirm-password">Confirm Password</label>
	<input
		type="password"
		id="confirm-password"
		name="confirm-password"
		bind:value={confirmPassword}
		required
	/>
	<input type="submit" value="Sign Up" />
</form>

<style>
	form {
		display: inline-block;
		background-color: #fff;
		border-radius: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		padding: 20px;
		margin-top: 50px;
	}

	label {
		display: block;
		font-size: 18px;
		margin-bottom: 10px;
		text-align: left;
	}

	input[type='text'],
	input[type='email'],
	input[type='password'] {
		display: block;
		width: 100%;
		padding: 10px;
		font-size: 16px;
		border-radius: 5px;
		border: none;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
		margin-bottom: 20px;
	}

	input[type='submit'] {
		background-color: #3498db;
		color: #fff;
		border: none;
		border-radius: 5px;
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	input[type='submit']:hover {
		background-color: #2980b9;
	}
</style>
