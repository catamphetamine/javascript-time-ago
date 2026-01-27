export type DateInput = Date | number;

export type Locale = string;

// Users can add custom styles via `TimeAgo.addLabels(locale, styleName, labels)`.
export type CustomLabelStyleName = string;
// There're also "legacy" label styles like "time" or "long-time" that have been deprecated.
// Users can still use those by adding them manually via `TimeAgo.addLabels()`.
export type LabelStyleName = 'long' | 'short' | 'narrow' | 'mini' | 'now' | CustomLabelStyleName;

export type Rounding = 'round' | 'floor';

// https://github.com/eemeli/make-plural/blob/master/packages/compiler/src/compile-range.js#L1
export type Count = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export type CommonUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';
export type Unit = CommonUnit | 'quarter' | 'now';

export type CountLabels = {
	[count in Count]?: string;
}

export interface PastAndFutureLabels {
	past: string | CountLabels;
	future: string | CountLabels;
	previous?: string;
	current?: string;
	next?: string;
}

export interface PastAndFutureNowLabels {
	past: string;
	future: string;
	current: string;
}

export type UnitLabels = string | CountLabels | PastAndFutureLabels

export type Labels = {
	year: UnitLabels;
	quarter?: UnitLabels;
	month: UnitLabels;
	week: UnitLabels;
	day: UnitLabels;
	hour: UnitLabels;
	minute: UnitLabels;
	second: UnitLabels;
}

export type UnitLabelsMini = string | CountLabels;

export type MiniLabels = {
	year: UnitLabelsMini;
	quarter?: UnitLabelsMini;
	month: UnitLabelsMini;
	week: UnitLabelsMini;
	day: UnitLabelsMini;
	hour: UnitLabelsMini;
	minute: UnitLabelsMini;
	second: UnitLabelsMini;
}

export type NowLabels = {
	now: string | PastAndFutureNowLabels;
}

export type LocaleData = {
	locale: Locale;
	short: Labels;
	narrow: Labels;
	long: Labels;
	mini?: MiniLabels;
	now?: NowLabels;
}

export type FormatStyleName =
	'round' |
	'round-minute' |
	'mini' |
	'mini-now' |
	'mini-minute' |
	'mini-minute-now' |
	'twitter' |
	'twitter-now' |
	'twitter-minute' |
	'twitter-minute-now' |
	'twitter-first-minute';

export type MinTimeFunction = (date: number, options: {
	future: boolean,
	getMinTimeForUnit: (unit: Unit, prevUnit?: Unit) => number | void
}) => number;

export interface Step {
	formatAs?: Unit;

	minTime?: number | MinTimeFunction;

	format?(date: DateInput, locale: Locale, options: {
		formatAs: (unit: Unit, amount: number) => string,
		now: number,
		future: boolean
	}): string | void;

	getTimeToNextUpdate?(date: DateInput, options: {
		getTimeToNextUpdateForUnit: (unit: Unit) => number | void,
		now: number,
		future: boolean
	}): number | void;
}

export interface Style {
	steps: Step[];
	labels: LabelStyleName | LabelStyleName[];
	round?: Rounding;
}

interface FormatOptions {
	now?: number;
	future?: boolean;
	round?: Rounding;
}

interface FormatOptionsWithGetTimeToNextUpdate extends FormatOptions {
	getTimeToNextUpdate: boolean;

	// `setTimeout()` function has a bug when it fires immediately
	// when the delay is longer than about `24.85` days.
	// https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
	//
	// In order to not burden the end users of this library with manually working around that bug,
	// this library automatically caps the returned delay to a maximum value of about `24.85` days
	// which still works correctly with `setTimeout()` function and doesn't break it.
	//
	// The end user of this library could still disable this automatic workaround
	// by passing a `getTimeToNextUpdateUncapped: true` parameter.
	// In that case, it will return the original non-modified uncapped delay
	// which can be longer than `24.85` days and should be manually capped
	// by the developer if it's going to be used in a `setTimeout()` call.
	//
	getTimeToNextUpdateUncapped?: boolean;
}

interface FormatOptionsWithRefresh extends FormatOptions {
	refresh: (text: string) => void;
}

export default class TimeAgo {
	// Creates a `TimeAgo` instance.
  constructor(locale: Locale | Locale[], options?: { polyfill?: boolean });

	// Calling `.format()` function normally.
  format(date: DateInput, style?: FormatStyleName | Style, options?: FormatOptions): string;

	// Calling `.format()` with `getTimeToNextUpdate: true` parameter.
	//
	// When `.format()` is called with `getTimeToNextUpdate: true` parameter,
	// it returns an array containing the formatted time and the "time to next update" delay.
	//
	// Perhaps returning an array is not the best solution, and it would've been better
	// to introduce a new function called `.formatAndGetTimeToNextUpdate()` or something like that.
	// But at this stage it already returns an array and changing that would require
	// a "major" version number update, and I would prefer not doing that for such an insignificant change.
	//
  format(date: DateInput, options: FormatOptionsWithGetTimeToNextUpdate): [string, number?];
  format(date: DateInput, style: FormatStyleName | Style, options: FormatOptionsWithGetTimeToNextUpdate): [string, number?];

	// Calling `.format()` with a `refresh()` parameter.
	//
	// When `.format()` is called with a `refresh()` parameter,
	// it returns an array containing the formatted time and the "stop refreshing" function.
	//
	// I.e. it mimicks the return value of already-existing `getTimeToNextUpdate: true` parameter.
	//
  format(date: DateInput, options: FormatOptionsWithRefresh): [string, () => void];
  format(date: DateInput, style: FormatStyleName | Style, options: FormatOptionsWithRefresh): [string, () => void];

	// `getLabels()` function seems to be unused and is not documented.
	// Perhaps it even wasn't ever declared as part of the public API
	// and got in this TypeScript definition by accident.
	//
  // getLabels(labelsType: LabelStyleName | LabelStyleName[]): Labels;

  static addLocale(localeData: LocaleData): void;
  static addDefaultLocale(localeData: LocaleData): void;
  static getDefaultLocale(): Locale;
  static setDefaultLocale(locale: Locale): void;
  static addLabels(locale: Locale, name: LabelStyleName, labels: Labels): void;
}