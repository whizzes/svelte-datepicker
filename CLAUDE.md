# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@whizzes/svelte-datepicker` - a Svelte 5 component library (a single `DatePicker` component). Built with `sv`/SvelteKit's library template and packaged via `@sveltejs/package`.

- `src/lib/` - the published library. Only this directory ends up in the npm package.
- `src/routes/` - a SvelteKit app used as a docs/demo/showcase site. Not published; safe to edit freely without affecting the package output.

## Commands

Package manager is Bun (`bun.lock` present, `engine-strict=true` in `.npmrc`); npm/pnpm work too since scripts are plain.

```sh
bun run dev              # dev server for the src/routes showcase app
bun run build            # vite build + prepack (svelte-kit sync && svelte-package && publint)
bun run preview          # preview the showcase app's production build
bun run check            # svelte-kit sync && svelte-check (type checking)
bun run check:watch      # same, in watch mode
bun run lint             # prettier --check . && eslint .
bun run format           # prettier --write . && eslint . --fix
bun run test             # vitest run (single pass)
bun run test:unit        # vitest (watch mode)
```

Run a single test file: `bun run test:unit -- src/lib/vitest-examples/greet.spec.ts` (or `vitest run <path>` directly).

Vitest is split into two projects (see `vite.config.ts`):

- **client**: `src/**/*.svelte.{test,spec}.ts`, runs in a real headless Chromium via `@vitest/browser-playwright` + `vitest-browser-svelte` (`render()`, `page.getBy...`).
- **server**: `src/**/*.{test,spec}.ts` (excluding the `.svelte.` ones above), plain Node environment.

`vite.config.ts` forces Svelte runes mode for everything outside `node_modules` - always use `$props`/`$state`/`$derived`/`$effect`, never legacy `export let` / `$:`.

## Architecture

### State lives in a plain class, not the component

All `DatePicker` state and behavior lives in `src/lib/DatePicker.ts` (`export class DatePicker`), backed by Svelte stores (`svelte/store`, not runes - this file is plain `.ts`, not `.svelte.ts`). Internally every piece of state is a private `writable`; the class exposes only `Readable` wrappers (via a local `toReadable()` helper) plus methods that mutate them (`open`, `close`, `nextMonth`, `selectDate`, `setLocale`, ...).

`DatePicker.svelte` is a thin view over one class instance: it does `const datePicker = new DatePicker(...)`, destructures the stores it needs, reads them in markup with `$store`, and calls `datePicker.someMethod()` in event handlers. It never mutates state directly. When adding new behavior, add a store + method to the class first, then wire the component to it - don't reintroduce local component state for calendar logic.

### Locale is reactive without rebuilding the instance

The `locale` prop seeds construction once, read via `untrack(() => locale)` - re-running `new DatePicker(...)` on every prop change would blow away open/selected state. Instead, a tracked `$effect` calls `datePicker.setLocale(locale)` on every change, which updates an internal `_locale` writable. Everything locale-dependent (`arrDays`, `monthNames`, `monthYearLabel`, `yearLabel`, `displayText`) is a `derived` store off `_locale`, not a value computed once - follow this pattern for any new locale-dependent data.

### Temporal, not a date library

All date math uses the TC39 `Temporal` global (`Temporal.PlainDate`, `Temporal.Now`) - no dayjs/date-fns/luxon. `Temporal` is not available in Node (SSR) or in browsers without support, so every call site guards with a local `hasTemporal()` check and degrades gracefully (blank grid, empty labels) rather than throwing. TypeScript has no official `Temporal` types yet, so `src/lib/temporal.d.ts` hand-declares the minimal ambient surface actually used (`PlainDate.from`, `.add`, `.toLocaleString`, etc.) - extend it if a call site needs another `Temporal` member.

### Theming via CSS custom properties

`src/lib/theme.ts` defines the `DatePickerTheme` interface, `DEFAULT_DATE_PICKER_THEME`, a `CSS_VAR_NAMES` map, and `themeToCssVars()` which merges a partial theme over the defaults and serializes it to an inline `style` string (`--dp-x: value; ...`) applied to the component's root element. All component CSS reads `var(--dp-x, fallback)` - there is no Tailwind or external stylesheet dependency for consumers. Adding a themeable property requires touching all of: the interface, the defaults, `CSS_VAR_NAMES`, and the corresponding `var(--dp-...)` reference(s) in `DatePicker.svelte`'s `<style>` block.

### Floating panel, not a modal

The calendar renders as an absolutely-positioned panel anchored under the input (`position: absolute` relative to a `position: relative` root), not a full-screen modal/backdrop. Outside-click-to-close is a `document` `mousedown` listener with a `contains()` check against the root element, added/removed in an `$effect` keyed on the open state - there's no backdrop element to click.

### Responsive via container queries

The day grid and weekday labels shrink using a CSS container query (`container-type: inline-size` on `.dp-panel-inner`, queried as `@container dp-panel (...)`), not a viewport `@media` query - sizing responds to the panel's own rendered width regardless of why it's constrained.

### Public API surface

`src/lib/index.ts` re-exports: `DatePicker` (the `.svelte` component, default export), `DatePickerController` (the underlying class from `DatePicker.ts`, aliased to avoid a name clash with the component), and the theme types/helpers (`DatePickerTheme`, `DEFAULT_DATE_PICKER_THEME`, `themeToCssVars`).
