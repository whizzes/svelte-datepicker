import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { DatePicker } from '../src/lib/DatePicker';

describe('DatePicker (logic)', () => {
	it('opens and closes the panel, resetting to the day view on open', () => {
		const dp = new DatePicker();

		dp.openMonthView();
		expect(get(dp.view)).toBe('months');

		dp.open();
		expect(get(dp.isOpenCalendar)).toBe(true);
		expect(get(dp.view)).toBe('days');

		dp.close();
		expect(get(dp.isOpenCalendar)).toBe(false);
	});

	it('wraps month navigation across year boundaries', () => {
		const dp = new DatePicker();
		const startYear = get(dp.selectedYear);

		dp.selectMonth(12);
		expect(get(dp.selectedMonth)).toBe(12);
		expect(get(dp.selectedYear)).toBe(startYear);

		dp.nextMonth();
		expect(get(dp.selectedMonth)).toBe(1);
		expect(get(dp.selectedYear)).toBe(startYear + 1);

		dp.previousMonth();
		expect(get(dp.selectedMonth)).toBe(12);
		expect(get(dp.selectedYear)).toBe(startYear);
	});

	it('wraps year navigation while the month grid is showing', () => {
		const dp = new DatePicker();
		const startYear = get(dp.selectedYear);

		dp.openMonthView();
		dp.nextYear();
		expect(get(dp.selectedYear)).toBe(startYear + 1);

		dp.previousYear();
		dp.previousYear();
		expect(get(dp.selectedYear)).toBe(startYear - 1);
	});

	it('selecting a month returns to the day view and rebuilds the grid', () => {
		const dp = new DatePicker();

		dp.openMonthView();
		dp.selectMonth(2);

		expect(get(dp.view)).toBe('days');
		expect(get(dp.selectedMonth)).toBe(2);

		const year = get(dp.selectedYear);
		const expectedDays = Temporal.PlainDate.from({ year, month: 2, day: 1 }).daysInMonth;
		const filledDays = get(dp.rows)
			.flat()
			.filter((day) => day > 0);

		expect(filledDays).toHaveLength(expectedDays);
		expect(Math.max(...filledDays)).toBe(expectedDays);
	});

	it('selectDate sets the canonical ISO value and closes the panel', () => {
		const dp = new DatePicker();
		dp.open();

		dp.selectDate(2024, 3, 15);

		expect(get(dp.inputTxt)).toBe('2024-03-15');
		expect(get(dp.selectedDate)).toEqual({ year: 2024, month: 3, day: 15 });
		expect(get(dp.isOpenCalendar)).toBe(false);
	});

	it('setInputTxt accepts free typed text without touching selectedDate parsing rules', () => {
		const dp = new DatePicker();

		dp.setInputTxt('not a date');
		expect(get(dp.inputTxt)).toBe('not a date');
		expect(get(dp.selectedDate)).toBeNull();
	});

	it('formats displayText using the current locale, falling back to raw text otherwise', () => {
		const dp = new DatePicker('en-US');

		dp.selectDate(2024, 3, 15);
		const expected = Temporal.PlainDate.from({ year: 2024, month: 3, day: 15 }).toLocaleString(
			'en-US',
			{ dateStyle: 'medium' }
		);
		expect(get(dp.displayText)).toBe(expected);

		dp.setInputTxt('still typing');
		expect(get(dp.displayText)).toBe('still typing');
	});

	it('setLocale updates locale-derived stores without resetting other state', () => {
		const dp = new DatePicker('en-US');

		dp.open();
		dp.selectMonth(6);
		const monthNamesBefore = get(dp.monthNames);

		dp.setLocale('ja-JP');

		expect(get(dp.locale)).toBe('ja-JP');
		expect(get(dp.monthNames)).not.toEqual(monthNamesBefore);
		// state unrelated to locale must survive the change
		expect(get(dp.isOpenCalendar)).toBe(true);
		expect(get(dp.selectedMonth)).toBe(6);
	});

	it('arrDays always has 7 entries and re-localizes on setLocale', () => {
		const dp = new DatePicker('en-US');
		const enFirstDay = get(dp.arrDays)[0];

		dp.setLocale('ar-MA');
		const arFirstDay = get(dp.arrDays)[0];

		expect(get(dp.arrDays)).toHaveLength(7);
		expect(enFirstDay).not.toBe(arFirstDay);
	});
});
