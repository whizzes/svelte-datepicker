<script lang="ts">
	/**
	 * USAGE
	 * import DatePicker from './DatePicker.svelte'
	 * function datepicked (detail) { console.log(detail.datepicked) }
	 *
	 * <DatePicker
	 *  ondatepicked={datepicked}
	 *  customclass=""                  (facultative) css class for the text input
	 *  theme={{ accentBackground: '#059669' }}   (facultative) partial DatePickerTheme override
	 * />
	 *
	 * Styles ship with the component (no Tailwind/stylesheet needed by the consumer).
	 * Every visual aspect is overridable via the `theme` prop - see DatePickerTheme in ./theme.ts
	 */

	import { untrack } from 'svelte';
	import { DatePicker } from './DatePicker';
	import { themeToCssVars, type DatePickerTheme } from './theme';

	// props
	let {
		customclass = '',
		ondatepicked,
		theme,
		locale
	}: {
		customclass?: string;
		ondatepicked?: (detail: { datepicked: string }) => void;
		theme?: Partial<DatePickerTheme>;
		locale: Intl.LocalesArgument;
	} = $props();

	const cssVars = $derived(themeToCssVars(theme));

	// all DatePicker state/logic lives in the class - the component only reads its stores
	// and calls its methods in response to user interaction
	// the initial locale seeds construction; later changes are pushed via setLocale() below,
	// so the class instance (and its open/selected state) isn't rebuilt from scratch
	const datePicker = new DatePicker(untrack(() => locale));
	const {
		inputTxt,
		displayText,
		isOpenCalendar,
		view,
		selectedMonth,
		selectedYear,
		rows,
		monthYearLabel,
		yearLabel,
		selectedDate,
		arrDays,
		monthNames,
		currentDay,
		currentMonth,
		currentYear
	} = datePicker;

	let rootEl: HTMLElement | undefined = $state();

	// keep the class' locale store in sync whenever the prop changes
	$effect(() => {
		datePicker.setLocale(locale);
	});

	// reactivity, on inputTxt store changes
	$effect(() => {
		ondatepicked?.({
			datepicked: $inputTxt
		});
	});

	// close the floating panel on any click outside the component, while it's open
	$effect(() => {
		if (!$isOpenCalendar) return;

		function handleDocumentClick(e: MouseEvent) {
			if (rootEl && !rootEl.contains(e.target as Node)) {
				datePicker.close();
			}
		}

		document.addEventListener('mousedown', handleDocumentClick);
		return () => document.removeEventListener('mousedown', handleDocumentClick);
	});
</script>

<div class="dp-root" style={cssVars} bind:this={rootEl}>
	{#if $isOpenCalendar}
		<div class="dp-panel">
			<div class="dp-panel-inner">
				<div class="dp-header">
					<!-- Month year -->
					<button type="button" class="dp-month-label" onclick={() => datePicker.openMonthView()}>
						{$view === 'days' ? $monthYearLabel : $yearLabel}
					</button>
					<div class="dp-nav">
						<!-- bnt previous -->
						<button
							onclick={() =>
								$view === 'days' ? datePicker.previousMonth() : datePicker.previousYear()}
							aria-label="calendar backward"
							class="dp-nav-btn"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="icon icon-tabler icon-tabler-chevron-left"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<polyline points="15 6 9 12 15 18" />
							</svg>
						</button>
						<!-- bnt next -->
						<button
							onclick={() => ($view === 'days' ? datePicker.nextMonth() : datePicker.nextYear())}
							aria-label="calendar forward"
							class="dp-nav-btn dp-nav-btn-next"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="icon icon-tabler icon-tabler-chevron-right"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<polyline points="9 6 15 12 9 18" />
							</svg>
						</button>
					</div>
				</div>
				{#if $view === 'days'}
					<div class="dp-table-wrap">
						<div class="dp-weekday-row">
							{#each $arrDays as day (day)}
								<div class="dp-weekday-cell">
									<p class="dp-weekday">{day}</p>
								</div>
							{/each}
						</div>
						<div class="dp-day-grid">
							{#each $rows.flat() as i, idx (idx)}
								<div class="dp-day-cell">
									{#if i > 0}
										<button
											type="button"
											onclick={() => {
												datePicker.selectDate($selectedYear, $selectedMonth, i);
											}}
											class="dp-day"
											class:dp-day-today={i === currentDay &&
												$selectedMonth === currentMonth &&
												$selectedYear === currentYear}
											class:dp-day-selected={$selectedDate?.year === $selectedYear &&
												$selectedDate?.month === $selectedMonth &&
												$selectedDate?.day === i}
										>
											{i}
										</button>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<div class="dp-month-grid">
						{#each $monthNames as name, idx (idx)}
							<button
								type="button"
								class="dp-month-cell"
								class:dp-month-cell-selected={idx + 1 === $selectedMonth}
								onclick={() => datePicker.selectMonth(idx + 1)}
							>
								{name}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<input
		type="text"
		value={$displayText}
		class="dp-input {customclass}"
		onclick={() => datePicker.open()}
		oninput={(e) => datePicker.setInputTxt(e.currentTarget.value)}
	/>
</div>

<style>
	.dp-root {
		position: relative;
		display: inline-block;
		max-width: 100%;
		font-family: var(--dp-font-family, sans-serif);
		font-size: var(--dp-font-size, 1rem);
		color: var(--dp-text, #1f2937);
	}

	.dp-root,
	.dp-root *,
	.dp-root *::before,
	.dp-root *::after {
		box-sizing: border-box;
	}

	.dp-panel {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		z-index: 40;
		width: 20rem;
		max-width: calc(100vw - 2rem);
		overflow: hidden;
		box-shadow: var(--dp-shadow);
	}

	.dp-panel-inner {
		container-type: inline-size;
		container-name: dp-panel;
		padding: 1.25rem;
		background: var(--dp-panel-bg, #fff);
		border-radius: var(--dp-radius, 0.25rem);
	}

	@media (min-width: 768px) {
		.dp-panel-inner {
			padding: 1.5rem;
		}
	}

	.dp-header {
		padding: 0 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.dp-month-label {
		font: inherit;
		font-weight: 700;
		font-size: 1rem;
		color: var(--dp-text, #1f2937);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		border-radius: var(--dp-radius, 0.25rem);
	}

	.dp-month-label:hover {
		color: var(--dp-hover-bg, #6366f1);
	}

	.dp-nav {
		display: flex;
		align-items: center;
	}

	.dp-nav-btn {
		color: var(--dp-text, #1f2937);
		background: none;
		border: none;
		padding: 0;
		line-height: 0;
		cursor: pointer;
		border-radius: var(--dp-radius, 0.25rem);
	}

	.dp-nav-btn:hover {
		color: var(--dp-hover-bg, #6366f1);
	}

	.dp-nav-btn-next {
		margin-left: 0.75rem;
	}

	.dp-table-wrap {
		padding-top: 2rem;
	}

	.dp-weekday-row {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
	}

	.dp-weekday-cell {
		display: flex;
		justify-content: center;
	}

	.dp-weekday {
		font-weight: 500;
		font-size: 0.875rem;
		text-align: center;
		color: var(--dp-text, #1f2937);
		transition: font-size 0.15s ease;
	}

	.dp-day-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
		margin-top: 0.5rem;
		transition: gap 0.15s ease;
	}

	.dp-day-cell {
		display: flex;
		justify-content: center;
	}

	.dp-day {
		width: 100%;
		max-width: 2rem;
		aspect-ratio: 1;
		border: none;
		border-radius: var(--dp-radius, 0.25rem);
		display: flex;
		align-items: center;
		justify-content: center;
		font: inherit;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--dp-muted-text, #6b7280);
		background: none;
		cursor: pointer;
	}

	/* Compact spacing/text once the panel itself has little room to work with */
	@container dp-panel (max-width: 300px) {
		.dp-weekday {
			font-size: 0.6875rem;
		}

		.dp-day-grid {
			gap: 0.25rem;
		}
	}

	.dp-day:hover,
	.dp-day:focus {
		color: var(--dp-accent-text, #fff);
		background: var(--dp-hover-bg, #6366f1);
	}

	.dp-day:focus-visible {
		outline: 2px solid var(--dp-hover-bg, #6366f1);
		outline-offset: 2px;
	}

	.dp-day-today {
		color: var(--dp-accent-text, #fff);
		background: var(--dp-accent-bg, #4338ca);
	}

	.dp-day-selected {
		color: var(--dp-selected-text, #fff);
		background: var(--dp-selected-bg, #e11d48);
	}

	.dp-month-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		padding-top: 1.5rem;
	}

	.dp-month-cell {
		font: inherit;
		font-weight: 500;
		text-align: center;
		padding: 0.5rem;
		color: var(--dp-muted-text, #6b7280);
		background: none;
		border: none;
		border-radius: var(--dp-radius, 0.25rem);
		cursor: pointer;
	}

	.dp-month-cell:hover {
		background: var(--dp-hover-bg, #6366f1);
		color: var(--dp-accent-text, #fff);
	}

	.dp-month-cell-selected {
		color: var(--dp-accent-text, #fff);
		background: var(--dp-accent-bg, #4338ca);
	}

	.dp-input {
		background: var(--dp-input-bg, #fff);
		color: var(--dp-input-text, #1f2937);
		border: 1px solid var(--dp-input-border, #d1d5db);
		border-radius: var(--dp-radius, 0.25rem);
		padding: 0.5rem 0.75rem;
		font-family: var(--dp-font-family, sans-serif);
		font-size: var(--dp-font-size, 1rem);
	}
</style>
