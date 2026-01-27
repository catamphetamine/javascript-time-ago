import { Locale, DateInput } from '../index.d.js'

export default class FullDateFormatter {
	constructor(locale: Locale | Locale[]);
	format(date: DateInput): string;
}