import { day, getDate } from '../steps/index.js'
import { intlDateTimeFormatSupported } from '../locale.js'

// For compatibility with the old versions of this library.
import renameLegacyProperties from './renameLegacyProperties.js'

// Twitter-style relative date/time formatting.
// ("1m", "2h", "Mar 3", "Apr 4, 2012").
//
// Seconds, minutes or hours are shown for shorter intervals,
// and longer intervals are formatted using full date format.

const steps = [
	{
		formatAs: 'second'
	},
	{
		formatAs: 'minute'
	},
	{
		formatAs: 'hour'
	}
]

// A cache for `Intl.DateTimeFormat` formatters
// for various locales (is a global variable).
const formatters = {}

// Starting from day intervals, output month and day.
const monthAndDay = {
	minTime(timestamp, { future, getMinTimeForUnit }) {
		// Returns `23.5 * 60 * 60` when `round` is "round",
		// and `24 * 60 * 60` when `round` is "floor".
		return getMinTimeForUnit('day')
	},
	format(value, locale) {
		/* istanbul ignore else */
		if (!formatters[locale]) {
			formatters[locale] = {}
		}
		/* istanbul ignore else */
		if (!formatters[locale].dayMonth) {
			// "Apr 11" (MMMd)
			formatters[locale].dayMonth = new Intl.DateTimeFormat(locale, {
				month: 'short',
				day: 'numeric'
			})
		}
		// Output month and day.
		return formatters[locale].dayMonth.format(getDate(value))
	}
}

// If the `date` happened/happens outside of current year,
// then output day, month and year.
// The interval should be such that the `date` lies outside of the current year.
const yearMonthAndDay = {
	minTime(timestamp, { future }) {
		if (future) {
			// January 1, 00:00, of the `date`'s year is right after
			// the maximum `now` for formatting a future date:
			// When `now` is before that date, the `date` is formatted as "day/month/year" (this step),
			// When `now` is equal to or after that date, the `date` is formatted as "day/month" (another step).
			// After that, it's hours, minutes, seconds, and after that it's no longer `future`.
			// The date is right after the maximum `now` for formatting a future date,
			// so subtract 1 millisecond from it.
			const maxFittingNow = new Date(new Date(timestamp).getFullYear(), 0).getTime() - 1
			// Return `minTime` (in seconds).
			return (timestamp - maxFittingNow) / 1000
		} else {
			// January 1, 00:00, of the year following the `date`'s year
			// is the minimum `now` for formatting a past date:
			// When `now` is before that date, the `date` is formatted as "day/month" (another step),
			// When `now` is equal to or after that date, the `date` is formatted as "day/month/year" (this step).
			// After that, it's hours, minutes, seconds, and after that it's no longer `future`.
			const minFittingNow = new Date(new Date(timestamp).getFullYear() + 1, 0).getTime()
			// Return `minTime` (in seconds).
			return (minFittingNow - timestamp) / 1000
		}
	},
	format(value, locale) {
		/* istanbul ignore if */
		if (!formatters[locale]) {
			formatters[locale] = {}
		}
		/* istanbul ignore else */
		if (!formatters[locale].dayMonthYear) {
			// "Apr 11, 2017" (yMMMd)
			formatters[locale].dayMonthYear = new Intl.DateTimeFormat(locale, {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})
		}
		// Output day, month and year.
		return formatters[locale].dayMonthYear.format(getDate(value))
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
			formatAs: 'day'
		},
		{
			formatAs: 'week'
		},
		{
			formatAs: 'month'
		},
		{
			formatAs: 'year'
		}
	)
}

export default {
	steps,
	labels: [
		// "mini" labels are only defined for a few languages.
		'mini',
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