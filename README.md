# @whizzes/svelte-datepicker

A themeable, locale-aware date picker for Svelte 5. The calendar opens as a small
floating panel next to its input (no full-screen modal), ships its own styles
(no Tailwind or external stylesheet required), and uses the native
[Temporal API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)
for all date math instead of a date library like dayjs or date-fns.

## Features

- Built for Svelte 5 runes (`$props`, `$state`, `$derived`, `$effect`)
- Locale-aware: weekday/month names and the input text follow any BCP 47 locale
  tag (`"en-US"`, `"ja-JP"`, `"ar-MA"`, ...), reactively
- Fully themeable via CSS custom properties, set through a single `theme` prop
- Floating calendar panel, responsive day grid (CSS container queries)
- No runtime dependencies beyond Svelte itself

## Requirements

The `Temporal` global must be available in your target runtime/browser. Where
it isn't, the component degrades gracefully (empty labels, blank grid) instead
of throwing - see [MDN's Temporal browser compatibility table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal#browser_compatibility).

## Installation

```sh
bun add @whizzes/svelte-datepicker
# or
npm install @whizzes/svelte-datepicker
# or
pnpm add @whizzes/svelte-datepicker
# or
yarn add @whizzes/svelte-datepicker
```

`svelte` `^5.0.0` is a peer dependency.

## Usage

```svelte
<script lang="ts">
	import { DatePicker } from '@whizzes/svelte-datepicker';

	function datepicked(detail: { datepicked: string }) {
		console.log(detail.datepicked); // '2026-07-26'
	}
</script>

<DatePicker ondatepicked={datepicked} locale="en-US" />
```

### Props

| Prop           | Type                                       | Default                     | Description                                                                                               |
| -------------- | ------------------------------------------ | --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `ondatepicked` | `(detail: { datepicked: string }) => void` | -                           | Called whenever the selected date changes. `detail.datepicked` is an ISO 8601 date string (`YYYY-MM-DD`). |
| `customclass`  | `string`                                   | `''`                        | Extra CSS class(es) applied to the text input, alongside the built-in styles.                             |
| `theme`        | `Partial<DatePickerTheme>`                 | `DEFAULT_DATE_PICKER_THEME` | Overrides any subset of the visual theme.                                                                 |
| `locale`       | `Intl.LocalesArgument`                     | `'en-GB'`                   | BCP 47 locale tag used to format weekday names, month names and the input text.                           |

### Theming

Every visual aspect is a CSS custom property, set via the `theme` prop - only
pass the fields you want to override:

```svelte
<DatePicker theme={{ accentBackground: '#059669', selectedBackground: '#e11d48' }} />
```

See `DatePickerTheme` (exported from the package) for the full list of
themeable fields and their defaults.

## Development

```sh
bun install
bun run dev      # dev server for the src/routes showcase/docs app
bun run check    # type-check
bun run lint     # prettier --check . && eslint .
bun run test     # run the test suite once
bun run build    # build the publishable package into dist/
```

`src/lib/` is the published library; `src/routes/` is a SvelteKit showcase app
used for local development and documentation, not published to npm.

## Release

Releases are published manually to npm:

1. Bump `version` in `package.json` (semver).
2. Run `bun run build` - this runs `svelte-kit sync`, `svelte-package` (builds
   `src/lib` into `dist/`) and `publint` (validates the package before publish).
3. Commit and tag the release: `git tag vX.Y.Z && git push --tags`.
4. Publish: `npm publish` (or `bun publish`).

## License

[MIT](./LICENSE) © Whizzes
