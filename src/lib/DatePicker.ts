import { derived, get, writable } from 'svelte/store';

import type { Readable } from 'svelte/store';

export const ARR_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

export type DatePickerView = 'days' | 'months';

export interface SelectedDate {
	year: number;
	month: number;
	day: number;
}

function parseInputTxt(value: string): SelectedDate | null {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (!match) {
		return null;
	}
	return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

function hasTemporal(): boolean {
	return typeof Temporal !== 'undefined';
}

function today(): Temporal.PlainDate | null {
	return hasTemporal() ? Temporal.Now.plainDateISO() : null;
}

function initRows(): number[][] {
	return Array.from({ length: 6 }, () => [0, 0, 0, 0, 0, 0, 0]);
}

function toReadable<T>(store: { subscribe: Readable<T>['subscribe'] }): Readable<T> {
	return { subscribe: store.subscribe };
}

function buildMonthNames(locale: Intl.LocalesArgument): string[] {
	return Array.from({ length: 12 }, (_, i) => {
		if (!hasTemporal()) {
			return String(i + 1);
		}
		const label = Temporal.PlainDate.from({ year: 2000, month: i + 1, day: 1 }).toLocaleString(
			locale,
			{
				month: 'short'
			}
		);
		return label.charAt(0).toUpperCase() + label.slice(1);
	});
}

function buildWeekdayNames(locale: Intl.LocalesArgument): string[] {
	if (!hasTemporal()) {
		return [...ARR_DAYS];
	}
	// 2024-01-01 is a Monday - the grid always starts the week on Monday (see refreshRows' startCol)
	const monday = Temporal.PlainDate.from({ year: 2024, month: 1, day: 1 });
	return Array.from({ length: 7 }, (_, i) => {
		const label = monday.add({ days: i }).toLocaleString(locale, { weekday: 'short' });
		return label.charAt(0).toUpperCase() + label.slice(1);
	});
}

/**
 * Holds all DatePicker state as Svelte stores and the logic to mutate it.
 * A component wires its markup to the exposed stores and calls the methods
 * in response to user interaction - it never mutates state itself.
 */
export class DatePicker {
	readonly currentDay: number;
	readonly currentMonth: number;
	readonly currentYear: number;

	readonly locale: Readable<Intl.LocalesArgument>;
	readonly arrDays: Readable<string[]>;
	readonly monthNames: Readable<string[]>;
	readonly inputTxt: Readable<string>;
	readonly displayText: Readable<string>;
	readonly isOpenCalendar: Readable<boolean>;
	readonly view: Readable<DatePickerView>;
	readonly selectedMonth: Readable<number>;
	readonly selectedYear: Readable<number>;
	readonly rows: Readable<number[][]>;
	readonly monthYearLabel: Readable<string>;
	readonly yearLabel: Readable<string>;
	readonly selectedDate: Readable<SelectedDate | null>;

	private readonly _locale;
	private readonly _inputTxt = writable('');
	private readonly _isOpenCalendar = writable(false);
	private readonly _view = writable<DatePickerView>('days');
	private readonly _selectedMonth;
	private readonly _selectedYear;
	private readonly _rows = writable(initRows());

	private selectedMonthValue: number;
	private selectedYearValue: number;

	constructor(locale: Intl.LocalesArgument = 'en-GB') {
		const now = today();

		this._locale = writable(locale);
		this.currentDay = now?.day ?? 1;
		this.currentMonth = now?.month ?? 1;
		this.currentYear = now?.year ?? 1970;

		this.selectedMonthValue = this.currentMonth;
		this.selectedYearValue = this.currentYear;

		this._selectedMonth = writable(this.selectedMonthValue);
		this._selectedYear = writable(this.selectedYearValue);
		this._selectedMonth.subscribe((month) => (this.selectedMonthValue = month));
		this._selectedYear.subscribe((year) => (this.selectedYearValue = year));

		this.locale = toReadable(this._locale);
		this.arrDays = derived(this._locale, buildWeekdayNames);
		this.monthNames = derived(this._locale, buildMonthNames);
		this.inputTxt = toReadable(this._inputTxt);
		this.isOpenCalendar = toReadable(this._isOpenCalendar);
		this.view = toReadable(this._view);
		this.selectedMonth = toReadable(this._selectedMonth);
		this.selectedYear = toReadable(this._selectedYear);
		this.rows = toReadable(this._rows);
		this.monthYearLabel = derived([this._selectedMonth, this._selectedYear], ([month, year]) =>
			this.formatMonthYear(month, year)
		);
		this.yearLabel = derived(this._selectedYear, (year) => String(year));
		this.selectedDate = derived(this._inputTxt, parseInputTxt);
		this.displayText = derived([this._inputTxt, this.locale], ([value, currentLocale]) =>
			this.formatDisplayText(value, currentLocale)
		);

		if (now) {
			this._inputTxt.set(now.toString());
		}
		this.refreshRows();
	}

	open(): void {
		this._view.set('days');
		this._isOpenCalendar.set(true);
	}

	close(): void {
		this._isOpenCalendar.set(false);
	}

	/** Switch the panel to the 12-month grid, so a month can be picked directly. */
	openMonthView(): void {
		this._view.set('months');
	}

	selectMonth(month: number): void {
		this._selectedMonth.set(month);
		this._view.set('days');
		this.refreshRows();
	}

	previousMonth(): void {
		let month = this.selectedMonthValue - 1;
		let year = this.selectedYearValue;
		if (month <= 0) {
			month = 12;
			year--;
		}
		this._selectedMonth.set(month);
		this._selectedYear.set(year);
		this.refreshRows();
	}

	nextMonth(): void {
		let month = this.selectedMonthValue + 1;
		let year = this.selectedYearValue;
		if (month > 12) {
			month = 1;
			year++;
		}
		this._selectedMonth.set(month);
		this._selectedYear.set(year);
		this.refreshRows();
	}

	/** Year navigation used while the month grid (not the day grid) is showing. */
	previousYear(): void {
		this._selectedYear.set(this.selectedYearValue - 1);
	}

	nextYear(): void {
		this._selectedYear.set(this.selectedYearValue + 1);
	}

	/** Allow the input to be typed into directly, bypassing the calendar grid. */
	setInputTxt(value: string): void {
		this._inputTxt.set(value);
	}

	/** Re-localizes weekday/month names and formatted text without resetting any other state. */
	setLocale(locale: Intl.LocalesArgument): void {
		this._locale.set(locale);
	}

	selectDate(year: number, month: number, day: number): void {
		if (hasTemporal()) {
			this._inputTxt.set(Temporal.PlainDate.from({ year, month, day }).toString());
		}
		this.close();
	}

	/** Falls back to the raw value while it isn't a full parseable date (eg. mid-typing). */
	private formatDisplayText(value: string, locale: Intl.LocalesArgument): string {
		const parsed = parseInputTxt(value);
		if (!parsed || !hasTemporal()) {
			return value;
		}
		return Temporal.PlainDate.from(parsed).toLocaleString(locale, { dateStyle: 'medium' });
	}

	private formatMonthYear(month: number, year: number): string {
		if (!hasTemporal()) {
			return '';
		}
		const label = Temporal.PlainDate.from({ year, month, day: 1 }).toLocaleString(
			get(this.locale),
			{
				month: 'long',
				year: 'numeric'
			}
		);
		return label.charAt(0).toUpperCase() + label.slice(1);
	}

	private refreshRows(): void {
		const rows = initRows();
		if (hasTemporal()) {
			const firstOfMonth = Temporal.PlainDate.from({
				year: this.selectedYearValue,
				month: this.selectedMonthValue,
				day: 1
			});
			const startCol = firstOfMonth.dayOfWeek - 1; // dayOfWeek: 1=Monday..7=Sunday -> 0=Lu..6=Di
			const lastDay = firstOfMonth.daysInMonth;
			let start = false;
			let cpt = 0;
			for (let iRow = 0; iRow < 6; iRow++) {
				for (let iCol = 0; iCol < 7; iCol++) {
					if (cpt > lastDay) {
						break;
					}
					if (!start && iCol === startCol) {
						cpt++;
						start = true;
					}
					rows[iRow][iCol] = cpt;
					if (start) {
						cpt++;
					}
				}
			}
		}
		this._rows.set(rows);
	}
}
