import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import DatePicker from '../src/lib/DatePicker.svelte';

async function openPanel(container: HTMLElement) {
	const input = container.querySelector('input.dp-input');
	if (!input) throw new Error('input.dp-input not found');
	await fireEvent.click(input);
}

describe('DatePicker.svelte', () => {
	it('opens the floating panel on click and closes it once a day is picked', async () => {
		const ondatepicked = vi.fn();
		const { container, queryByLabelText } = render(DatePicker, {
			locale: 'en-US',
			ondatepicked
		});

		expect(queryByLabelText('calendar forward')).not.toBeInTheDocument();

		await openPanel(container);
		expect(queryByLabelText('calendar forward')).toBeInTheDocument();

		const today = container.querySelector('.dp-day-today');
		expect(today).not.toBeNull();
		await fireEvent.click(today as HTMLElement);

		const expectedIso = Temporal.Now.plainDateISO().toString();
		expect(ondatepicked).toHaveBeenCalledWith({ datepicked: expectedIso });

		expect(queryByLabelText('calendar forward')).not.toBeInTheDocument();

		const input = container.querySelector('input.dp-input') as HTMLInputElement;
		const expectedDisplay = Temporal.Now.plainDateISO().toLocaleString('en-US', {
			dateStyle: 'medium'
		});
		expect(input.value).toBe(expectedDisplay);
	});

	it('re-localizes the weekday header and month/year label when the locale prop changes', async () => {
		const { container, rerender } = render(DatePicker, { locale: 'en-US' });

		await openPanel(container);

		const weekdaysBefore = Array.from(container.querySelectorAll('.dp-weekday')).map(
			(el) => el.textContent
		);

		await rerender({ locale: 'ja-JP' });

		const weekdaysAfter = Array.from(container.querySelectorAll('.dp-weekday')).map(
			(el) => el.textContent
		);

		expect(weekdaysAfter).not.toEqual(weekdaysBefore);
	});

	it('typing into the input bypasses the grid and echoes the raw text back', async () => {
		const { container } = render(DatePicker, { locale: 'en-US' });
		const input = container.querySelector('input.dp-input') as HTMLInputElement;

		await fireEvent.input(input, { target: { value: 'hello' } });

		expect(input.value).toBe('hello');
	});
});
