export default class FullDateFormatter {
	constructor(localeOrLocales) {
		// See if `Intl.DateTimeFormat` is supported in the current environment.
		//
		// `Intl` is present in all modern web browsers and is only absent from some of the ancient ones.
		//
		// Babel transforms `typeof` into some "branches"
		// so istanbul will show this as "branch not covered".
		/* istanbul ignore next */
		const isIntlAvailable = typeof Intl === 'object'
		const isIntlDateTimeFormatAvailable = isIntlAvailable && typeof Intl.DateTimeFormat === 'function'

		/* istanbul ignore else */
		if (isIntlDateTimeFormatAvailable) {
			this.formatter = new Intl.DateTimeFormat(localeOrLocales, VERBOSE_DATE_FORMAT_OPTIONS)
		} else {
			this.formatter = new FallbackDateFormatter()
		}
	}

	format(dateOrTimestamp) {
		return this.formatter.format(getDate(dateOrTimestamp))
	}
}

export class FallbackDateFormatter {
	format(date) {
		return String(date)
	}
}

function getDate(dateOrTimestamp) {
	if (typeof dateOrTimestamp === 'number') {
		return new Date(dateOrTimestamp)
	}
	return dateOrTimestamp
}

// `Intl.DateTimeFormat` options for outputting a verbose date.
// Formatted date example: "Thursday, December 20, 2012, 7:00:00 AM GMT+4"
const VERBOSE_DATE_FORMAT_OPTIONS = {
	weekday: 'long',
	day: 'numeric',
	month: 'long',
	year: 'numeric',
	hour: 'numeric',
	minute: '2-digit',
	second: '2-digit'
	// timeZoneName: 'short'
}