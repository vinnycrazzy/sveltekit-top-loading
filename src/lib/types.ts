import type { Snippet } from 'svelte';

export interface TopLoaderProps {
	color?: string;
	minimum?: number;
	trickleSpeed?: number;
	height?: number;
	trickle?: boolean;
	showSpinner?: boolean;
	easing?: string;
	speed?: number;
	/** Set to false to disable the glow. */
	shadow?: string | false;
	/** Trusted NProgress HTML. Must contain role="bar" and role="spinner" elements. */
	template?: string;
	zIndex?: number;
	/** Render a loading screen during client-side navigation. */
	fullscreen?: boolean;
	/** Logo URL for the loading screen. */
	logo?: string;
	logoAlt?: string;
	logoWidth?: number;
	background?: string;
	foreground?: string;
	/** Accessible loading message, also displayed in fullscreen mode. */
	label?: string;
	/** Delay in milliseconds before showing the loader. */
	delay?: number;
	/** Custom fullscreen content replacing the logo and centered spinner. */
	children?: Snippet;
}
