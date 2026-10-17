# sveltekit-top-loading

A navigation progress bar and optional fullscreen loading screen for Svelte 5 and SvelteKit 2.12+ / 3. Uses NProgress and the reactive `$app/state` navigation state.

## About this project

Maintained by [Vinicius R. Vieira (@vinnycrazzy)](https://github.com/vinnycrazzy) in [sveltekit-top-loading](https://github.com/vinnycrazzy/sveltekit-top-loading).

This project is based on and inspired by [sveltekit-top-loader](https://github.com/tsriram/sveltekit-top-loader), created by **Sriram Thiagarajan (@tsriram)**. It continues that work with a SvelteKit 3 development setup, Svelte 5 runes, navigation fixes, and a fullscreen loading screen.

## What's new

- SvelteKit 3.1 and Svelte 5.57 development setup, with TypeScript 6 and Vite 8.
- Navigation tracking through `$app/state`, including cancelled navigation and error pages.
- Fullscreen loading screen with a logo, centered spinner, and configurable colors and message.
- Custom fullscreen content through Svelte snippets.
- Configurable display delay to avoid flashes during fast navigation.
- Reactive styling, accessible loading messages, and reduced-motion support.
- Browser tests covering navigation and fullscreen behavior on desktop and mobile.

## Install

Using pnpm:

```sh
pnpm add sveltekit-top-loading
```

Or npm:

```sh
npm install sveltekit-top-loading
```

Requires **Svelte 5** and **SvelteKit 2.12+ or 3**. These registry installation commands become available after the first npm release.

Svelte 4 is no longer supported. Developing this repository requires Node 22.17+ (Node 24 recommended), pnpm 12, and TypeScript 6. The demo uses SvelteKit 3.1 and Svelte 5.57.

## Usage

Mount **one instance** in your root `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SvelteKitTopLoader } from 'sveltekit-top-loading';

	let { children }: { children: Snippet } = $props();
</script>

<SvelteKitTopLoader />
{@render children()}
```

No separate CSS import is required. Keep the loader in the root layout so it stays mounted between pages.

### Fullscreen with a logo

Place your logo in `static/logo.svg`. Supply a URL that includes your application's base path when applicable.

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SvelteKitTopLoader } from 'sveltekit-top-loading';

	let { children }: { children: Snippet } = $props();
</script>

<SvelteKitTopLoader
	fullscreen
	logo="/logo.svg"
	logoAlt="My application"
	logoWidth={140}
	background="#ffffff"
	foreground="#172b3a"
	color="#1264a3"
	label="Carregando página…"
	delay={150}
/>
{@render children()}
```

The screen fills the viewport, with a centered logo, spinner and message. The top progress bar remains visible. `showSpinner={false}` hides the spinner in either mode. The screen is a visual indicator and does not trap focus, lock scrolling, or block interaction with the current page.

### Custom fullscreen content

A Svelte snippet replaces the logo and centered spinner. The message and top bar remain:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SvelteKitTopLoader } from 'sveltekit-top-loading';

	let { children }: { children: Snippet } = $props();
</script>

<SvelteKitTopLoader fullscreen label="Preparing your workspace…">
	<div class="brand">My application</div>
</SvelteKitTopLoader>
{@render children()}
```

Exported `TopLoaderProps` provides the component's TypeScript API.

## Options

| Prop           | Type              | Default                          | Purpose                                                           |
| -------------- | ----------------- | -------------------------------- | ----------------------------------------------------------------- |
| `color`        | `string`          | `'#29d'`                         | Bar and spinner color                                             |
| `minimum`      | `number`          | `0.08`                           | Initial progress, from 0 to 1                                     |
| `trickleSpeed` | `number`          | `200`                            | Automatic increment interval in milliseconds                      |
| `height`       | `number`          | `3`                              | Bar height in pixels                                              |
| `trickle`      | `boolean`         | `true`                           | Automatically advance progress                                    |
| `showSpinner`  | `boolean`         | `true`                           | Show the corner or centered spinner                               |
| `easing`       | `string`          | `'ease'`                         | CSS progress easing                                               |
| `speed`        | `number`          | `200`                            | Progress animation duration in milliseconds                       |
| `shadow`       | `string \| false` | Glow using `color`               | Custom bar glow, or `false` to disable                            |
| `template`     | `string`          | NProgress bar and spinner markup | Trusted custom NProgress HTML                                     |
| `zIndex`       | `number`          | `1600`                           | Screen stacking order; bar and corner spinner use one level above |
| `fullscreen`   | `boolean`         | `false`                          | Enable the loading screen                                         |
| `logo`         | `string`          | —                                | Loading screen logo URL                                           |
| `logoAlt`      | `string`          | `''`                             | Alternative text for the logo                                     |
| `logoWidth`    | `number`          | `120`                            | Logo width in pixels, constrained on small screens                |
| `background`   | `string`          | `'#fff'`                         | Loading screen background                                         |
| `foreground`   | `string`          | `'#172b3a'`                      | Loading screen message color                                      |
| `label`        | `string`          | `'Loading…'`                     | Live status announcement and fullscreen message                   |
| `delay`        | `number`          | `0`                              | Wait before displaying; short navigations show nothing            |
| `children`     | `Snippet`         | —                                | Custom fullscreen content                                         |

A custom `template` must contain an element with `role="bar"`; include `role="spinner"` for a spinner. These are NProgress selectors, not accessibility roles. The separate status message announces loading. Use trusted application markup only.

Styles update reactively. NProgress settings apply to subsequent starts; changing `template` or enabling a previously hidden corner spinner takes effect on the next navigation.

## Navigation behavior

The indicator follows client-side navigation, including links, programmatic navigation, and browser history. It ends when navigation settles, including error pages. Cancelled navigation does not start it. It does not represent a measured download percentage, the initial server render, arbitrary fetches, or full document navigations. Use a root layout so it survives route changes.

Animations respect `prefers-reduced-motion`. Choose foreground/background and spinner colors with sufficient contrast. NProgress is a global singleton: use one loader and avoid controlling the same NProgress instance elsewhere.

## Development

```sh
git clone https://github.com/vinnycrazzy/sveltekit-top-loading.git
cd sveltekit-top-loading
pnpm install
pnpm dev
pnpm check
pnpm lint
pnpm exec playwright install chromium
pnpm test
pnpm build
```

The demo includes fullscreen, spinner and delay controls. Page 1 and Page 2 deliberately wait 800 ms on the server so loading can be observed. The build generates the distributable package and runs publint. Browser tests exercise the real router, desktop/mobile fullscreen behavior, delay, cancellation, history, and reduced motion.

## Publishing to npm

The initial package version is `0.1.0`. Before the first release, authenticate with the npm account that will own `sveltekit-top-loading`:

```sh
npm login
npm whoami
```

Validate the project, run the browser suite, and simulate publication:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test
pnpm release:dry-run
```

The dry run does not upload the package. Both the dry run and real publication run the `prepublishOnly` checks: types, formatting/lint, package generation, and publint. Only `dist`, package metadata, README, and license are shipped.

When you are ready to publish the first version:

```sh
npm publish
```

`publishConfig` sets public access and the official npm registry. Complete any authentication or two-factor prompt requested by npm. After publication, users can install it with the commands above.

For future releases, record changes and let Changesets manage version bumps:

```sh
pnpm exec changeset
```

The existing GitHub Actions release workflow runs on pushes to `main`: it creates a version PR when changesets exist, or publishes unpublished versions. Configure the repository secret `NPM_TOKEN` with permission to publish the package, and enable GitHub Actions to create pull requests. The workflow checks types, lint, and browser tests before the release step. The local `pnpm release` command also publishes versions through Changesets; use it only when ready to release.

To try the package locally before publication:

```sh
pnpm package
pnpm pack --pack-destination /tmp
```

Install the generated `.tgz` archive from your SvelteKit application with `pnpm add /tmp/sveltekit-top-loading-0.1.0.tgz`.

## Migration

Existing props are preserved. Replace Svelte 4 layouts using `<slot />` with Svelte 5's `{@render children()}` and remove reliance on `svelte/legacy`. The library now requires SvelteKit 2.12+ because it uses `$app/state`. The repository itself has moved to SvelteKit 3's Vite-based configuration and `#lib` imports.

## Credits and license

The original implementation and inspiration are [sveltekit-top-loader](https://github.com/tsriram/sveltekit-top-loader), by **Sriram Thiagarajan (@tsriram)**. Thank you for creating the foundation of this library.

The original project was inspired by [nextjs-toploader](https://github.com/TheSGJ/nextjs-toploader/). Progress rendering uses [NProgress](https://github.com/rstacruz/nprogress).

This continuation is maintained by [Vinicius R. Vieira (@vinnycrazzy)](https://github.com/vinnycrazzy). Distributed under the [MIT license](./LICENSE), preserving attribution to the original author.
