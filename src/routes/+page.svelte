<script lang="ts">
	import { DatePicker } from '$lib';

	let picked = $state('');

	function datepicked(detail) {
		picked = detail.datepicked;
	}

	const examples = [
		{ title: 'DatePicker example', locale: 'en-US' },
		{ title: 'Ejemplo del DatePicker', locale: 'es-ES' },
		{ title: 'DatePicker példa', locale: 'hu-HU' },
		{ title: 'Exemplo do DatePicker', locale: 'pt-BR' },
		{ title: 'DatePickerの例', locale: 'ja-JP' },
		{ title: 'DatePicker 示例', locale: 'zh-CN' },
		{ title: 'مثال على DatePicker', locale: 'ar-MA' },
		{ title: 'Exemple de DatePicker', locale: 'fr-FR' },
		{ title: 'DatePicker Beispiel', locale: 'de-DE' }
	];

	const badges = ['Svelte 5', 'TypeScript', 'Zero Tailwind dependency', 'Themeable'];

	// matches the docs page's own dark palette, passed to every example below
	const darkTheme = {
		panelBackground: '#15151b',
		textColor: '#e6e6ea',
		mutedTextColor: '#9a9aa5',
		accentBackground: '#7c5cff',
		accentTextColor: '#ffffff',
		selectedBackground: '#e11d48',
		selectedTextColor: '#ffffff',
		hoverBackground: '#9df26c',
		borderRadius: '0.5rem',
		boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.6)',
		fontSize: '0.9375rem',
		inputBackground: 'rgba(255, 255, 255, 0.04)',
		inputTextColor: '#e6e6ea',
		inputBorderColor: 'rgba(255, 255, 255, 0.15)'
	};

	const navLinks = [
		{ href: '#overview', label: 'Overview' },
		{ href: '#installation', label: 'Installation' },
		{ href: '#usage', label: 'Usage' },
		{ href: '#props', label: 'Props' },
		{ href: '#theming', label: 'Theming' },
		{ href: '#locale', label: 'Locale & i18n' },
		{ href: '#playground', label: 'Playground' },
		{ href: '#examples', label: 'Examples' }
	];

	const playgroundLocales = [
		'en-US',
		'en-GB',
		'es-ES',
		'fr-FR',
		'de-DE',
		'pt-BR',
		'ja-JP',
		'zh-CN',
		'ar-MA',
		'hu-HU'
	];

	let playgroundPicked = $state('');

	function playgroundDatepicked(detail) {
		playgroundPicked = detail.datepicked;
	}

	// only the most relevant/visible props are exposed as playground controls
	let playgroundLocale = $state('en-US');
	let playgroundCustomclass = $state('');
	let playgroundAccentBackground = $state('#4338ca');
	let playgroundSelectedBackground = $state('#e11d48');
	let playgroundHoverBackground = $state('#6366f1');
	let playgroundPanelBackground = $state('#ffffff');
	let playgroundTextColor = $state('#1f2937');
	let playgroundBorderRadius = $state('0.25rem');

	const playgroundTheme = $derived({
		accentBackground: playgroundAccentBackground,
		selectedBackground: playgroundSelectedBackground,
		hoverBackground: playgroundHoverBackground,
		panelBackground: playgroundPanelBackground,
		textColor: playgroundTextColor,
		borderRadius: playgroundBorderRadius
	});

	const props = [
		{
			name: 'ondatepicked',
			type: '(detail: { datepicked: string }) => void',
			default: '-',
			description:
				'Called whenever the selected date changes. `detail.datepicked` is the ISO 8601 date string (YYYY-MM-DD).'
		},
		{
			name: 'customclass',
			type: 'string',
			default: "''",
			description: 'Extra CSS class(es) applied to the text input, alongside the built-in styles.'
		},
		{
			name: 'theme',
			type: 'Partial<DatePickerTheme>',
			default: 'DEFAULT_DATE_PICKER_THEME',
			description: 'Overrides any subset of the visual theme - see Theming below.'
		},
		{
			name: 'locale',
			type: 'Intl.LocalesArgument',
			default: "'en-GB'",
			description: 'BCP 47 locale tag used to format weekday names, month names and the input text.'
		}
	];

	const themeFields = [
		{ name: 'overlayBackground', default: 'rgba(0, 0, 0, 0.4)' },
		{ name: 'panelBackground', default: '#ffffff' },
		{ name: 'textColor', default: '#1f2937' },
		{ name: 'mutedTextColor', default: '#6b7280' },
		{ name: 'accentBackground', default: '#4338ca' },
		{ name: 'accentTextColor', default: '#ffffff' },
		{ name: 'selectedBackground', default: '#e11d48' },
		{ name: 'selectedTextColor', default: '#ffffff' },
		{ name: 'hoverBackground', default: '#6366f1' },
		{ name: 'borderRadius', default: '0.25rem' },
		{
			name: 'boxShadow',
			default: '0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1)'
		},
		{ name: 'fontFamily', default: 'sans-serif' },
		{ name: 'fontSize', default: '1rem' },
		{ name: 'inputBackground', default: '#ffffff' },
		{ name: 'inputTextColor', default: '#1f2937' },
		{ name: 'inputBorderColor', default: '#d1d5db' }
	];
</script>

<div class="docs">
	<header class="hero">
		<nav class="topnav">
			<span class="brand">@whizzes/svelte-datepicker</span>
			<a class="topnav-link" href="https://svelte.dev/docs/kit">SvelteKit docs</a>
		</nav>

		<h1><span class="grad">Svelte</span> DatePicker</h1>
		<p class="tagline">
			A themeable, locale-aware date picker built on runes, Svelte stores and the native
			<a
				href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date"
				>Date API</a
			>. No Tailwind or stylesheet required by consumers.
		</p>

		<ul class="badge-row">
			{#each badges as badge (badge)}
				<li class="badge">{badge}</li>
			{/each}
		</ul>
	</header>

	<div class="body">
		<nav class="sidebar" aria-label="Table of contents">
			<span class="sidebar-title">On this page</span>
			<ul>
				{#each navLinks as link (link.href)}
					<li>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- same-page hash anchor, not an app route -->
						<a href={link.href}>{link.label}</a>
					</li>
				{/each}
			</ul>
		</nav>

		<main class="content">
			<section id="overview">
				<h2>Overview</h2>
				<p>
					<code>DatePicker</code> renders a text input that opens a floating calendar panel next to
					it - no full-screen modal, no scroll-lock. All state and logic lives in a plain
					<code>DatePicker</code> class backed by Svelte stores, so the component itself stays a thin
					view over that state.
				</p>
			</section>

			<section id="installation">
				<h2>Installation</h2>
				<pre class="code-block"><code>yarn add @whizzes/svelte-datepicker</code></pre>
			</section>

			<section id="usage">
				<h2>Usage</h2>
				<pre class="code-block"><code
						>{`<script lang="ts">
  import { DatePicker } from '@whizzes/svelte-datepicker';

  function datepicked(detail) {
    console.log(detail.datepicked); // '2026-07-26'
  }
</script>

<DatePicker ondatepicked={datepicked} locale="en-US" />`}</code
					></pre>
			</section>

			<section id="props">
				<h2>Props</h2>
				<div class="table-wrap">
					<table>
						<thead>
							<tr>
								<th>Prop</th>
								<th>Type</th>
								<th>Default</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							{#each props as prop (prop.name)}
								<tr>
									<td><code>{prop.name}</code></td>
									<td><code>{prop.type}</code></td>
									<td><code>{prop.default}</code></td>
									<td>{prop.description}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>

			<section id="theming">
				<h2>Theming</h2>
				<p>
					Every visual aspect is a CSS custom property, set via the <code>theme</code> prop - only pass
					the fields you want to override:
				</p>
				<pre class="code-block"><code
						>{`<DatePicker theme={{ accentBackground: '#059669', selectedBackground: '#e11d48' }} />`}</code
					></pre>
				<div class="table-wrap">
					<table>
						<thead>
							<tr>
								<th>Field</th>
								<th>Default</th>
							</tr>
						</thead>
						<tbody>
							{#each themeFields as field (field.name)}
								<tr>
									<td><code>{field.name}</code></td>
									<td><code>{field.default}</code></td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>

			<section id="locale">
				<h2>Locale &amp; i18n</h2>
				<p>
					Pass any BCP 47 tag (<code>"es-ES"</code>, <code>"ja-JP"</code>, <code>"ar-MA"</code>,
					...) via the <code>locale</code> prop. Weekday headers, month names and the text rendered
					in the input all follow it - the value emitted to <code>ondatepicked</code> stays a plain ISO
					date string regardless of locale.
				</p>
			</section>

			<section id="playground">
				<h2>Playground</h2>
				<p>Tweak the props below and watch the live instance update.</p>

				<div class="playground">
					<div class="playground-preview">
						<DatePicker
							locale={playgroundLocale}
							customclass={playgroundCustomclass}
							theme={playgroundTheme}
							ondatepicked={playgroundDatepicked}
						/>
						<p class="picked-line">Picked: <code>{playgroundPicked || '-'}</code></p>
					</div>

					<form class="playground-controls" onsubmit={(e) => e.preventDefault()}>
						<label class="field">
							<span>locale</span>
							<select bind:value={playgroundLocale}>
								{#each playgroundLocales as loc (loc)}
									<option value={loc}>{loc}</option>
								{/each}
							</select>
						</label>

						<label class="field">
							<span>customclass</span>
							<input type="text" bind:value={playgroundCustomclass} placeholder="e.g. my-input" />
						</label>

						<label class="field">
							<span>theme.accentBackground</span>
							<input type="color" bind:value={playgroundAccentBackground} />
						</label>

						<label class="field">
							<span>theme.selectedBackground</span>
							<input type="color" bind:value={playgroundSelectedBackground} />
						</label>

						<label class="field">
							<span>theme.hoverBackground</span>
							<input type="color" bind:value={playgroundHoverBackground} />
						</label>

						<label class="field">
							<span>theme.panelBackground</span>
							<input type="color" bind:value={playgroundPanelBackground} />
						</label>

						<label class="field">
							<span>theme.textColor</span>
							<input type="color" bind:value={playgroundTextColor} />
						</label>

						<label class="field">
							<span>theme.borderRadius</span>
							<input type="text" bind:value={playgroundBorderRadius} placeholder="0.25rem" />
						</label>
					</form>
				</div>
			</section>

			<section id="examples">
				<h2>Examples</h2>
				<p class="picked-line">Picked: <code>{picked || '-'}</code></p>

				<div class="example-grid">
					{#each examples as example (example.locale)}
						<div class="example-card">
							<h3>{example.title}</h3>
							<code class="locale-tag">{example.locale}</code>
							<DatePicker locale={example.locale} ondatepicked={datepicked} theme={darkTheme} />
						</div>
					{/each}
				</div>
			</section>
		</main>
	</div>
</div>

<style>
	:global(html) {
		color-scheme: dark;
	}

	:global(body) {
		margin: 0;
		background: #08080b;
	}

	.docs {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		color: #e6e6ea;
		min-height: 100vh;
	}

	a {
		color: #b9f27c;
	}

	code {
		font-family: 'SF Mono', Menlo, Consolas, monospace;
		font-size: 0.875em;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 0.25rem;
		padding: 0.1rem 0.35rem;
	}

	/* ---- hero ---- */

	.hero {
		position: relative;
		padding: 2rem 2.5rem 3rem;
		background:
			radial-gradient(circle at 15% 20%, rgba(157, 92, 255, 0.35), transparent 45%),
			radial-gradient(circle at 85% 65%, rgba(120, 220, 90, 0.3), transparent 50%), #08080b;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.topnav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 3rem;
	}

	.brand {
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.topnav-link {
		font-size: 0.875rem;
		color: #cfcfe0;
		text-decoration: none;
	}

	.topnav-link:hover {
		color: #b9f27c;
	}

	.hero h1 {
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 800;
		margin: 0 0 1rem;
		letter-spacing: -0.02em;
	}

	.grad {
		background: linear-gradient(90deg, #d9b8ff 0%, #9df26c 100%);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.tagline {
		max-width: 42rem;
		color: #cfcfe0;
		font-size: 1.125rem;
		line-height: 1.6;
	}

	.badge-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.625rem;
		list-style: none;
		padding: 0;
		margin: 1.75rem 0 0;
	}

	.badge {
		font-size: 0.8125rem;
		font-weight: 600;
		padding: 0.4rem 0.9rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: #e6e6ea;
	}

	/* ---- body layout ---- */

	.body {
		display: grid;
		grid-template-columns: 14rem 1fr;
		gap: 3rem;
		max-width: 72rem;
		margin: 0 auto;
		padding: 2.5rem;
	}

	.sidebar {
		position: sticky;
		top: 2.5rem;
		align-self: start;
		font-size: 0.875rem;
	}

	.sidebar-title {
		display: block;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 0.75rem;
		color: #8f8fa0;
		margin-bottom: 0.75rem;
	}

	.sidebar ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.sidebar a {
		color: #cfcfe0;
		text-decoration: none;
	}

	.sidebar a:hover {
		color: #b9f27c;
	}

	.content {
		min-width: 0;
	}

	.content section {
		margin-bottom: 3.5rem;
		scroll-margin-top: 1.5rem;
	}

	.content h2 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.content p {
		line-height: 1.7;
		color: #cfcfe0;
	}

	.code-block {
		background: #0d0f0d;
		border: 1px solid rgba(157, 242, 108, 0.2);
		border-radius: 0.5rem;
		padding: 1rem 1.25rem;
		overflow-x: auto;
	}

	.code-block code {
		background: none;
		padding: 0;
		color: #d7f5bd;
		white-space: pre;
	}

	.table-wrap {
		overflow-x: auto;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	th,
	td {
		text-align: left;
		padding: 0.65rem 0.9rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		vertical-align: top;
	}

	th {
		color: #8f8fa0;
		font-weight: 600;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		background: rgba(255, 255, 255, 0.03);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	.picked-line {
		font-size: 0.9375rem;
	}

	/* ---- playground ---- */

	.playground {
		display: grid;
		grid-template-columns: 1fr 18rem;
		gap: 2rem;
		align-items: start;
		margin-top: 1.5rem;
	}

	.playground-preview {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
		padding: 2.5rem 1.5rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 0.75rem;
		min-height: 8rem;
	}

	.playground-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.25rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 0.75rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.8125rem;
	}

	.field span {
		font-family: 'SF Mono', Menlo, Consolas, monospace;
		color: #9a9aa5;
	}

	.field input,
	.field select {
		font: inherit;
		color: #e6e6ea;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 0.375rem;
		padding: 0.4rem 0.55rem;
	}

	.field input[type='color'] {
		padding: 0.2rem;
		height: 2.25rem;
	}

	/* ---- examples ---- */

	.example-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin-top: 1.5rem;
	}

	.example-card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1.25rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 0.75rem;
	}

	.example-card h3 {
		margin: 0;
		font-size: 0.9375rem;
		font-weight: 600;
	}

	.locale-tag {
		align-self: flex-start;
		color: #b9f27c;
		background: rgba(157, 242, 108, 0.12);
	}

	@media (max-width: 900px) {
		.body {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
		}

		.playground {
			grid-template-columns: 1fr;
		}

		.example-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 560px) {
		.example-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
