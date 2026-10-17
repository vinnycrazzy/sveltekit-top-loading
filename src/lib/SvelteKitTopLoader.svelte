<script lang="ts">
	import { navigating } from '$app/state';
	import { onMount } from 'svelte';
	import nProgress from 'nprogress';
	import type { TopLoaderProps } from './types.js';

	let {
		color = '#29d',
		minimum = 0.08,
		trickleSpeed = 200,
		height = 3,
		trickle = true,
		showSpinner = true,
		easing = 'ease',
		speed = 200,
		shadow,
		template = '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
		zIndex = 1600,
		fullscreen = false,
		logo,
		logoAlt = '',
		logoWidth = 120,
		background = '#fff',
		foreground = '#172b3a',
		label = 'Loading…',
		delay = 0,
		children
	}: TopLoaderProps = $props();

	let mounted = $state(false);
	let visible = $state(false);
	let styleElement = $state<HTMLStyleElement | null>(null);
	const active = $derived(navigating.to !== null);
	const glow = $derived(
		shadow === false ? 'none' : (shadow ?? `0 0 10px ${color}, 0 0 5px ${color}`)
	);
	const styles = $derived(`
		#nprogress{pointer-events:none}
		#nprogress .bar{background:${color};position:fixed;z-index:${zIndex + 1};top:0;left:0;width:100%;height:${height}px}
		#nprogress .peg{display:block;position:absolute;right:0;width:100px;height:100%;box-shadow:${glow};opacity:1;transform:rotate(3deg) translate(0,-4px)}
		#nprogress .spinner{display:${fullscreen ? 'none' : 'block'};position:fixed;z-index:${zIndex + 1};top:15px;right:15px}
		#nprogress .spinner-icon{width:18px;height:18px;box-sizing:border-box;border:2px solid transparent;border-top-color:${color};border-left-color:${color};border-radius:50%;animation:top-loader-spin 400ms linear infinite}
		@keyframes top-loader-spin{to{transform:rotate(360deg)}}
		@media(prefers-reduced-motion:reduce){#nprogress .bar{transition:none!important}#nprogress .spinner-icon{animation:none}}
	`);

	onMount(() => {
		styleElement = document.createElement('style');
		styleElement.dataset.sveltekitTopLoader = '';
		document.head.appendChild(styleElement);
		mounted = true;
		return () => {
			nProgress.done();
			nProgress.remove();
			styleElement?.remove();
		};
	});

	$effect(() => {
		if (styleElement) styleElement.textContent = styles;
	});

	$effect(() => {
		if (!mounted) return;
		nProgress.configure({ minimum, trickleSpeed, trickle, showSpinner, easing, speed, template });
	});

	$effect(() => {
		if (!mounted || !active) return;
		const timer = setTimeout(
			() => {
				visible = true;
				nProgress.start();
			},
			Math.max(0, delay)
		);
		return () => {
			clearTimeout(timer);
			visible = false;
			nProgress.done();
		};
	});
</script>

{#if visible}
	<div
		class:fullscreen
		class="loading-status"
		role="status"
		aria-live="polite"
		style:--loader-background={background}
		style:--loader-color={color}
		style:--loader-foreground={foreground}
		style:--loader-z-index={zIndex}
		style:--loader-logo-width={`${logoWidth}px`}
	>
		{#if fullscreen}
			{#if children}
				{@render children()}
			{:else}
				{#if logo}<img src={logo} alt={logoAlt} />{/if}
				{#if showSpinner}<span class="center-spinner" aria-hidden="true"></span>{/if}
			{/if}
		{/if}
		<span class:visually-hidden={!fullscreen}>{label}</span>
	</div>
{/if}

<style>
	.loading-status.fullscreen {
		position: fixed;
		inset: 0;
		z-index: var(--loader-z-index);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		padding: 1.5rem;
		box-sizing: border-box;
		background: var(--loader-background);
		color: var(--loader-foreground);
		font: inherit;
		text-align: center;
		/* Keep the current page usable while navigation is pending. */
		pointer-events: none;
	}
	img {
		width: var(--loader-logo-width);
		max-width: 80vw;
		max-height: 40vh;
		object-fit: contain;
	}
	.center-spinner {
		width: 2rem;
		height: 2rem;
		border: 2px solid transparent;
		border-top-color: var(--loader-color);
		border-left-color: var(--loader-color);
		border-radius: 50%;
		animation: spin 700ms linear infinite;
	}
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.center-spinner {
			animation: none;
		}
	}
</style>
