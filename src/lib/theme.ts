/**
 * Every visual aspect of DatePicker is themeable through this interface, applied
 * as CSS custom properties on the component's root element - no Tailwind or
 * external stylesheet required by the consumer.
 */
export interface DatePickerTheme {
	overlayBackground: string;
	panelBackground: string;
	textColor: string;
	mutedTextColor: string;
	accentBackground: string;
	accentTextColor: string;
	selectedBackground: string;
	selectedTextColor: string;
	hoverBackground: string;
	borderRadius: string;
	boxShadow: string;
	fontFamily: string;
	fontSize: string;
	inputBackground: string;
	inputTextColor: string;
	inputBorderColor: string;
}

export const DEFAULT_DATE_PICKER_THEME: DatePickerTheme = {
	overlayBackground: 'rgba(0, 0, 0, 0.4)',
	panelBackground: '#ffffff',
	textColor: '#1f2937',
	mutedTextColor: '#6b7280',
	accentBackground: '#4338ca',
	accentTextColor: '#ffffff',
	selectedBackground: '#e11d48',
	selectedTextColor: '#ffffff',
	hoverBackground: '#6366f1',
	borderRadius: '0.25rem',
	boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
	fontFamily: 'sans-serif',
	fontSize: '1rem',
	inputBackground: '#ffffff',
	inputTextColor: '#1f2937',
	inputBorderColor: '#d1d5db'
};

const CSS_VAR_NAMES: Record<keyof DatePickerTheme, string> = {
	overlayBackground: '--dp-overlay-bg',
	panelBackground: '--dp-panel-bg',
	textColor: '--dp-text',
	mutedTextColor: '--dp-muted-text',
	accentBackground: '--dp-accent-bg',
	accentTextColor: '--dp-accent-text',
	selectedBackground: '--dp-selected-bg',
	selectedTextColor: '--dp-selected-text',
	hoverBackground: '--dp-hover-bg',
	borderRadius: '--dp-radius',
	boxShadow: '--dp-shadow',
	fontFamily: '--dp-font-family',
	fontSize: '--dp-font-size',
	inputBackground: '--dp-input-bg',
	inputTextColor: '--dp-input-text',
	inputBorderColor: '--dp-input-border'
};

/** Merge a partial theme over the defaults and serialize it as an inline `style` string. */
export function themeToCssVars(theme?: Partial<DatePickerTheme>): string {
	const merged = { ...DEFAULT_DATE_PICKER_THEME, ...theme };
	return (Object.keys(CSS_VAR_NAMES) as (keyof DatePickerTheme)[])
		.map((key) => `${CSS_VAR_NAMES[key]}: ${merged[key]}`)
		.join('; ');
}
