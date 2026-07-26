import '@testing-library/jest-dom/vitest';
import { Temporal } from '@js-temporal/polyfill';

// jsdom (like Node) has no native Temporal global - polyfill it so DatePicker's
// real date logic runs in tests instead of falling back to its no-Temporal branches.
if (typeof globalThis.Temporal === 'undefined') {
	// @ts-expect-error - test-only polyfill assignment, no official Temporal types yet
	globalThis.Temporal = Temporal;
}
