# Build A Simple Web App With Sveltekit and Appwrite

## What is Sveltekit?
SvelteKit is a web development framework that is built on top of Svelte, a popular front-end JavaScript framework. It aims to simplify the process of building high-performance, scalable web applications by providing a range of tools and features that make it easy to create server-rendered web pages and applications.

SvelteKit includes features such as server-side rendering, file-based routing, API endpoints, automatic code-splitting, and more. It also supports a wide range of integrations and plugins, including popular databases, authentication providers, and hosting platforms.

## What is Appwrite?
Appwrite is an open-source backend server software that provides developers with a set of powerful tools and APIs to build serverless and scalable applications. It provides various backend services, such as authentication, database management, storage, and cloud functions, that can be easily integrated into any frontend technology stack.

Appwrite's features include:

1.  Authentication and user management: Appwrite supports user authentication through various providers like Email/Password, Google, Apple, Facebook, and GitHub. It also provides user management APIs to create, update, and delete users.

2.  Database management: Appwrite supports NoSQL databases like MongoDB, Couchbase, and Elasticsearch, as well as SQL databases like MySQL and PostgreSQL.

3.  Storage: Appwrite provides a simple and scalable storage API that supports local file storage, Amazon S3, and Google Cloud Storage.

4.  Cloud Functions: Appwrite allows developers to create serverless functions that can be triggered by events or scheduled to run periodically.

5.  API documentation: Appwrite provides extensive documentation for all its APIs and SDKs, making it easy for developers to integrate with the backend services.

## Installation
First, let's start by installing sveltekit, you can use any of the package managers ( NPM, Yarn or PNPM ). For this tutorial, I'll be using PNPM and  [Vite](https://vitejs.dev/). If you don't have Vite installed, [follow this tutorial](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

Create a Sveltekit application by running
```bash
    pnpm create vite //PNPM
    npm create vite@latest // NPM
    yarn create vite //Yarn
```
We'll name it "appkit" and choose Svelte as our framework, but the variant should be Sveltekit
![Sveltekit Variant](https://www.udrop.com/file/7Ypi/Screenshot_from_2023-03-26_14-25-17.png)
We'll then select the Skeleton project option
![Skeleton Project](https://www.udrop.com/file/7Ypj/Screenshot_from_2023-03-26_14-33-00.png)
We won't be using Typescript for this so select no for Typescript and only ESlint and Prettier in the Additional options.

Our project would be created and we'll navigate into the directory and install all dependencies

    cd appkit
    pnpm install
we'll now run the app using the `pnpm dev` command and open the url ( default is http://localhost:5173/ )
We should see this basic page
![sveltekit basic page](https://www.udrop.com/file/7Ypu/Screenshot_from_2023-03-26_14-58-22.png)

Next we'll configure docker, make sure it is installed or install it [here](https://docs.docker.com/engine/install/).

## Configuring the Node Adapter

To be able to run this app successfully in Docker, we will have to Install the Svelte node adapter

    pnpm add -D @sveltejs/adapter-node

Then modify our `svelte.config.js` file to use it.

```js
import  adapter  from  '@sveltejs/adapter-node';
export  default  {
kit:  {
adapter:  adapter()
}
};
```

## Writing the dockerfile

Create a `.dockerignore` at the root of the project, this file specifies files and directories that should be excluded from the build context when creating a Docker image. This can help reduce the size of the final image and improve build performance.

```
# .dockerignore

.vscode

node_modules

.git
.gitattributes

.eslintignore
.eslintrc.cjs

.prettierrc
.pretieriignore

README.md

Dockerfile
```
Now we'll start writing our Dockerfile

To create a Dockerfile for our Node.js application, we need to start by selecting a suitable runtime environment. While Node.js is commonly installed on local machines, we need to ensure it is available in our Docker image. Therefore, we'll use the official Node.js image as our base, which comes pre-installed with Node.js and npm.

```
# Start with a lightweight Node.js image
FROM node:16-alpine

# Install pnpm package manager
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies using pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the app's source code and build using pnpm
COPY . .
RUN pnpm build

# Expose port 3000 and start the app
EXPOSE 3000
CMD ["node", "build"]

```
Once you've created the Dockerfile, navigate to the root of your project and execute the `docker build . -t appkit` command. This will build a Docker image named `appkit`. Once the build process is complete, you should see the terminal confirming the creation of the image in your terminal.
![Docker Image Built Terminal](https://www.udrop.com/file/7YpB/Screenshot_from_2023-03-26_15-22-50.png)

## Running The Application
Once you've created the Dockerfile, you can run your application inside a container by executing the command `docker run -d -p 3000:3000 --name app-container appkit`. This command does the following:

-   `-d`: runs the container in detached mode, meaning it runs in the background.
-   `-p 3000:3000`: maps port 3000 of the container to the port 3000 of the host machine.
-   `--name app-container`: gives a name to the container, which is optional but can be useful for easily identifying the container.
-   `appkit`: the name of the image we want to run (the image we built previously).

After running the command, you should be able to access the application at `http://localhost:3000`.

We have successfully built a Sveltekit app with Docker, now time to add Appwrite.

## Installing Appwrite
We can Install appwrite on our machine through a `docker run` command.
Unix Systems( Linux e.t.c)
```bash
docker run -it --rm \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
    --entrypoint="install" \
    appwrite/appwrite:1.2.1
```

CMD ( Windows )
```bash
docker run -it --rm ^
    --volume //var/run/docker.sock:/var/run/docker.sock ^
    --volume "%cd%"/appwrite:/usr/src/code/appwrite:rw ^
    --entrypoint="install" ^
    appwrite/appwrite:1.2.1
```
Powershell
```bash
docker run -it --rm `
    --volume /var/run/docker.sock:/var/run/docker.sock `
    --volume ${pwd}/appwrite:/usr/src/code/appwrite:rw `
    --entrypoint="install" `
    appwrite/appwrite:1.2.1
```
## Setting up our Appwrite project
To create your first project on Appwrite, navigate to the Appwrite console at `http://localhost/` and click on the icon located on the top navigation header or the 'Create Project' button available on the console homepage. Provide a name for your project and click on 'create' to begin.

You can use PNPM to install Appwrite SDK to your project from the command line. Run the following command:

    pnpm add appwrite

then create an `appwrite.js` file in the `src` folder
```js
import  {  Client  as  Appwrite,  Databases,  Account  }  from  'appwrite';
const  server  =  {
endpoint:  'http://localhost/v1',
project:  'YOUR_PROJECT_ID'
};
const  client  =  new  Appwrite();
const  account  =  new  Account(client);
client.setEndpoint(server.endpoint).setProject(server.project);
const  sdk  =  {  account  };
export  {  sdk,  server  };
```
This creates a new Appwrite client instance by importing the necessary classes (Client, Databases, Account) from the 'appwrite' package. It sets the server endpoint and project ID, and creates an account instance using the client. Finally, it exports the account instance as part of an SDK object along with the server information.

This SDK object can then be imported and used in other files to interact with the Appwrite API.

## User Authentication

To get started navigate to the `src` folder and create a file called `store.js`
This will create a svelte store and we will add the following code

```js
import  {  sdk  }  from  './appwrite';
import  {  writable  }  from  'svelte/store';
const  createState  =  ()  =>  {
const  {  subscribe,  set,  update  }  =  writable({
account:  null,
alert:  null
});

return  {
subscribe,
signup:  async  (email,  password,  name)  =>  {
return  await  sdk.account.create('unique()',  email,  password,  name);
},
user:  async  ()  =>  {
return  await  sdk.account.get();
},
login:  async  (email,  password)  =>  {
await  sdk.account.createEmailSession(email,  password);
const  user  =  await  sdk.account.get();
state.init(user);
},
logout:  async  ()  =>  {
await  sdk.account.deleteSession('current');
},
alert:  async  (alert)  =>
update((n)  =>  {
n.alert  =  alert;
return  n;
}),
init:  async  (account  =  null)  =>  {
return  set({  account, alert:  null  });
},
checkSession:  async  ()  =>  {
const  user  =  await  sdk.account.get();
state.init(user);
}
};
};
export  const  state  =  createState();
```

The `createState()` function returns an object that has various methods for handling authentication, such as `signup()`, `login()`, and `logout()`. These methods all make use of the `sdk` object imported from the `appwrite.js` file to interact with the Appwrite backend.

The `writable()` function from the `svelte/store` library is used to define the initial state of the store and provide methods for updating it. The initial state of the store contains an `account` property set to `null` and an `alert` property also set to `null`.

The `subscribe()` method is used to listen for changes to the store's state, while the `set()` and `update()` methods are used to update the state. The `init()` method is used to initialize the store's state, and the `checkSession()` method is used to check the user's authentication status on Appwrite's backend.

## Login and Signup

Create three new [svelte kit routes](https://kit.svelte.dev/docs/routing) named login, signup and app

### Signup Page
```html

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
			state.alert({
				color: 'red',
				message: error.message
			});
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

```
This creates a simple signup page. The script imports the `goto` function from the `$app/navigation` module and the `state` object from the `../../store` module. The script defines four variables for the user's email, name, password, and confirmPassword. The variable `error` is also defined to handle any errors that may occur during the signup process.

The `handleSubmit` function is defined to handle form submissions. It prevents the default form submission behavior and checks if the password and confirmPassword fields match. If they do not match, an error message is displayed using the `state.alert` function. Otherwise, the `state.signup` function is called with the user's email, password, and name. If there are any errors, they are caught and displayed using the `state.alert` function. If the signup is successful, the `goto` function is used to redirect the user to the `/app` page.

The HTML form contains fields for the user's name, email, password, and confirmPassword. It also contains a submit button that calls the `handleSubmit` function when clicked.

### Login page

```html
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
```

### App Page

```html
<!-- routes/login/+page.svelte -->
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
```
This component has a logout button. The script section contains two functions: `onMount` and `logout`.

`onMount` is a Svelte lifecycle function that is called when the component is mounted on the page. The `onMount` function contains an asynchronous call to `state.checkSession()`, which is a function that checks if the user's session is still valid. If the session is not valid, the function redirects the user to the login page using `goto('/login')`.

The `logout` function is called when the user clicks on the "Logout" button. It calls the `state.logout()` function, which logs the user out and destroys the session. Then, it redirects the user to the login page using `goto('/login')`.

Viola!, we have built a simple app with Sveltekit and Appwrite.
![Wolf gif](https://media.tenor.com/w_I1Q36W4J8AAAAC/uconn-huskies-jonathan.gif)

If you have any problems, feel free to contact me on [Twitter](https://twitter.com/web_n3rd)

The Source code can be found [here](https://github.com/n3-rd/appkit)
