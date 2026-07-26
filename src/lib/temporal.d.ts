// Minimal ambient typing for the subset of the Temporal global used by DatePicker.
// TypeScript doesn't ship official Temporal types yet - see
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal
declare namespace Temporal {
	class PlainDate {
		static from(fields: { year: number; month: number; day: number }): PlainDate;
		readonly day: number;
		readonly month: number;
		readonly year: number;
		readonly dayOfWeek: number;
		readonly daysInMonth: number;
		add(duration: { days?: number }): PlainDate;
		toString(): string;
		toLocaleString(locales?: string, options?: Intl.DateTimeFormatOptions): string;
	}
	namespace Now {
		function plainDateISO(): PlainDate;
	}
}
