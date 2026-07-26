import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Prerendered as a static site for GitHub Pages, see .github/workflows/pages.yml.
			adapter: adapter({ fallback: 'index.html' }),

			paths: {
				base: '/svelte-datepicker'
			}
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			},

			{
				extends: './vite.config.ts',
				// resolve Svelte's client build (with `mount`) instead of the SSR-only build -
				// jsdom alone doesn't tell Vite/vite-plugin-svelte to pick the browser condition
				resolve: {
					conditions: ['browser']
				},
				test: {
					name: 'jsdom',
					environment: 'jsdom',
					setupFiles: ['./test/setup.ts'],
					include: ['test/**/*.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
