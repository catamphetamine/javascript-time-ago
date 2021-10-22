export type DateInput = Date | number;

export type Locale = string;

export type LabelStyleName = 'long' | 'short' | 'narrow' | 'mini' | 'now';

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
		formatAs: (unit: Unit, value: number) => string,
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
}

interface FormatOptions {
	now?: number;
	future?: boolean;
	getTimeToNextUpdate?: boolean;
	round?: Rounding;
}

export default class TimeAgo {
  constructor(locale: Locale | Locale[], options?: { polyfill?: boolean });
  format(date: DateInput, style?: FormatStyleName | Style, options?: FormatOptions): string | [string, number?];
  format(date: DateInput, options: FormatOptions): string | [string, number?];
  getLabels(labelsType: LabelStyleName | LabelStyleName[]): Labels;
  static addLocale(localeData: LocaleData): void;
  static addDefaultLocale(localeData: LocaleData): void;
  static setDefaultLocale(locale: Locale): void;
  static addLabels(locale: Locale, name: LabelStyleName, labels: Labels);
}