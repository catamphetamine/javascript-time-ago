import round from '../steps/round'
import { minute, hour, day, week, month, year, getDate } from '../steps'
import { intlDateTimeFormatSupported } from '../locale'

// For compatibility with the old versions of this library.
import renameLegacyProperties from './renameLegacyProperties'

// Twitter-style relative date/time formatting.
// ("1m", "2h", "Mar 3", "Apr 4, 2012").
//
// Seconds, minutes or hours are shown for shorter intervals,
// and longer intervals are formatted using full date format.

const steps = [
	// Seconds
	{
		// If "now" labels are not available, will show "0s".
		formatAs: 'second'
	},
	// Now
	{
		// If "now" labels are available, will show "now".
		// At `0` seconds, Twitter shows "now".
		minTime: 0,
		formatAs: 'now'
	},
	// Seconds
	{
		// Format time in seconds after 0.5 seconds.
		minTime: 0.5,
		formatAs: 'second'
	},
	// Minutes
	{
		// Starts showing `1m` after `59s`.
		minTime: minute - 0.5,
		formatAs: 'minute'
	},
	// Hours
	{
		// After `59m` it will show `1h`.
		minTime: hour - 0.5 * minute,
		formatAs: 'hour'
	}
]

// A cache for `Intl.DateTimeFormat` formatters
// for various locales (is a global variable).
const formatters = {}

// Starting from day intervals, output month and day.
const monthAndDay = {
	minTime: day - 0.5 * hour,
	format(value, locale) {
		/* istanbul ignore else */
		if (!formatters[locale]) {
			formatters[locale] = {}
		}
		/* istanbul ignore else */
		if (!formatters[locale].this_year) {
			// "Apr 11" (MMMd)
			formatters[locale].this_year = new Intl.DateTimeFormat(locale, {
				month: 'short',
				day: 'numeric'
			})
		}
		// Output month and day.
		return formatters[locale].this_year.format(getDate(value))
	},
	getTimeToNextUpdate(date, { now, future }) {
		const nextYear = new Date(new Date(now).getFullYear() + 1, 0)
		return nextYear.getTime() - now
	}
}

// If the `date` happened/happens outside of current year,
// then output day, month and year.
const yearMonthAndDay = {
	test(timestamp, { now, future }) {
		if (future) {
			// Jan 1st 00:00 of the next year.
			const nextYear = new Date(new Date(now).getFullYear() + 1, 0)
			// If the `date` is future year.
			return timestamp > nextYear.getTime()
		} else {
			// Jan 1st 00:00 of the this year.
			const thisYear = new Date(new Date(now).getFullYear(), 0)
			// If the `date` is past year.
			return timestamp < thisYear.getTime()
		}
	},
	format(value, locale) {
		/* istanbul ignore if */
		if (!formatters[locale]) {
			formatters[locale] = {}
		}
		/* istanbul ignore else */
		if (!formatters[locale].other) {
			// "Apr 11, 2017" (yMMMd)
			formatters[locale].other = new Intl.DateTimeFormat(locale, {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})
		}
		// Output day, month and year.
		return formatters[locale].other.format(getDate(value))
	},
	getTimeToNextUpdate() {
		// Doesn't need to be updated.
		return 1000 * year
	}
}

// If `Intl.DateTimeFormat` is supported,
// then longer time intervals will be formatted as dates.
/* istanbul ignore else */
if (intlDateTimeFormatSupported()) {
	steps.push(monthAndDay, yearMonthAndDay)
}
// Otherwise, if `Intl.DateTimeFormat` is not supported,
// which could be the case when using Internet Explorer,
// then simply mimick "round" steps.
else {
	steps.push(
		{
			minTime: day - 0.5 * hour,
			formatAs: 'day'
		},
		{
			minTime: week - 0.5 * day,
			formatAs: 'week'
		},
		{
			minTime: 3.5 * week,
			formatAs: 'month'
		},
		{
			minTime: year - 0.5 * month,
			formatAs: 'year'
		}
	)
}

export const style = {
	steps,
	labels: [
		// "mini-time" labels are only defined for a few languages.
		'mini-time',
		// "short-time" labels are only defined for a few languages.
		'short-time',
		// "narrow" and "short" labels are defined for all languages.
		// "narrow" labels can sometimes be weird (like "+5d."),
		// but "short" labels have the " ago" part, so "narrow" seem
		// more appropriate.
		// "short" labels would have been more appropriate if they
		// didn't have the " ago" part, hence the "short-time" above.
		'narrow',
		// Since "narrow" labels are always present, "short" element
		// of this array can be removed.
		'short'
	]
}

// For compatibility with the old versions of this library.
export default renameLegacyProperties(style)