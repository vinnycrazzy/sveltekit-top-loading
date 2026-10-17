<script lang="ts">
	import { SvelteKitTopLoader } from '#lib/index.js';
	import { beforeNavigate } from '$app/navigation';
	let { children }: { children: import('svelte').Snippet } = $props();
	let fullscreen = $state(false);
	let showSpinner = $state(true);
	let delay = $state(100);
	let custom = $state(false);
	let ready = $state(false);
	import { onMount } from 'svelte';
	onMount(() => {
		ready = true;
	});
	beforeNavigate(({ to, cancel }) => {
		if (to?.url.searchParams.has('cancel')) cancel();
	});
</script>

{#snippet customContent()}<strong>Meu aplicativo</strong>{/snippet}

<SvelteKitTopLoader
	{fullscreen}
	{showSpinner}
	{delay}
	logo="/logo.svg"
	logoAlt="Top Loader"
	color="#1264a3"
	label="Carregando página…"
	children={custom ? customContent : undefined}
/>
<fieldset class="settings" disabled={!ready}>
	<label><input type="checkbox" bind:checked={fullscreen} /> Tela inteira</label>
	<label><input type="checkbox" bind:checked={showSpinner} /> Spinner</label>
	<label>Atraso (ms) <input type="number" min="0" step="50" bind:value={delay} /></label>
	<label><input type="checkbox" bind:checked={custom} /> Conteúdo personalizado</label>
</fieldset>
<main>{@render children()}</main>

<style>
	:global(body) {
		margin: 0;
		font-family: system-ui, sans-serif;
		color: #172b3a;
		background: #fff;
	}
	.settings,
	main {
		max-width: 65ch;
		margin-inline: auto;
		padding: 1.5rem;
	}
	.settings {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		border: 0;
		border-bottom: 1px solid #d5dce1;
		box-sizing: border-box;
		width: 100%;
	}
	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	input[type='number'] {
		width: 5rem;
		padding: 0.4rem;
	}
	:global(a) {
		color: #1264a3;
		text-underline-offset: 0.2em;
	}
	:global(:focus-visible) {
		outline: 2px solid #1264a3;
		outline-offset: 3px;
	}
</style>
