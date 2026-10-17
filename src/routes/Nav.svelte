<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<nav>
	<ul>
		<li><a href={resolve('/')}>Home</a></li>
		<li><a href={resolve('/page1')}>Page 1</a></li>
		<li><a href={resolve('/page2')}>Page 2</a></li>
	</ul>
</nav>

<style>
	nav {
		display: flex;
	}

	nav ul {
		display: flex;
		gap: 1rem;
		list-style: none;
		margin: 1rem 0;
		padding: 0;
	}

	nav ul a {
		font-size: 1rem;
	}
</style>
