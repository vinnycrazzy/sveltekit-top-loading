# sveltekit-top-loading

## 0.2.0

### Minor Changes

- 567e9da: Migrate to Svelte 5 navigation state and a SvelteKit 3 development toolchain. Require SvelteKit 2.12+ and remove Svelte 4 support. Fix duplicated styles, reactive color and shadow updates, and loading indicators after cancelled navigation. Add fullscreen loading screens with logo, custom snippets, configurable colors, accessible messages, reduced-motion support, and a display delay.

## Unreleased

- Start an independently maintained project based on Sriram Thiagarajan’s [sveltekit-top-loader](https://github.com/tsriram/sveltekit-top-loader).
- Migrate the development setup to SvelteKit 3, Svelte 5, Vite 8, and TypeScript 6.
- Replace legacy navigation handling with reactive `$app/state` tracking.
- Fix duplicated styles, reactive color/shadow updates, and cancelled navigation handling.
- Add fullscreen loading screens with logos, snippets, configurable colors, messages, and display delay.
- Add accessibility, reduced-motion support, and browser coverage.

The source project’s release history is available in its [original changelog](https://github.com/tsriram/sveltekit-top-loader/blob/main/CHANGELOG.md).
