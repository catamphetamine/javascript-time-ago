import { canonical, day, hour, getStep, getDate } from '../gradation'
import { intlDateTimeFormatSupported } from '../locale'

// A cache for `Intl.DateTimeFormat` twitter formatters
// for various locales (is a global variable).
const formatters = {}

// Twitter style relative time formatting.
// ("1m", "2h", "Mar 3", "Apr 4, 2012").
// Seconds, minutes and hours are shown relatively,
// and other intervals can be shown using full date format.
export default
{
	// Twitter gradation is derived from "canonical" gradation
	// adjusting its "minute" `threshold` to be 45.
	gradation: [
		// Seconds
		{
			...getStep(canonical, 'second'),
			// At `0` seconds Twitter shows "now",
			// but in different languages "now" could be too long
			// and too contrasty compared to all other "Xs" seconds.
			// Therefore, it outputs "0s" in such case.
			threshold: 0
		},
		// Minutes
		{
			...getStep(canonical, 'minute'),
			// Starts showing `1m` after `59s`.
			threshold: 59.5
		},
		// Hours
		{
			...getStep(canonical, 'hour'),
			// After `59m` it will show `1h`.
			threshold: 59.5 * 60,
		},
		// If `date` and `now` happened the same year,
		// then only output month and day.
		{
			threshold: day - 0.5 * hour,
			format(value, locale) {
				// Whether can use `Intl.DateTimeFormat`.
				// If `Intl` is not available,
				// or the locale is not supported,
				// then don't override the default labels.
				/* istanbul ignore if */
				if (!intlDateTimeFormatSupported()) {
					return
				}
				/* istanbul ignore else */
				if (!formatters[locale]) {
					formatters[locale] = {}
				}
				/* istanbul ignore else */
				if (!formatters[locale].this_year) {
					// "Apr 11" (MMMd)
					formatters[locale].this_year = new Intl.DateTimeFormat(locale, {
						month : 'short',
						day   : 'numeric'
					})
				}
				// Output month and day.
				return formatters[locale].this_year.format(getDate(value))
			}
		},
		// If `date` and `now` happened in defferent years,
		// then output day, month and year.
		{
			threshold(now, future) {
				if (future) {
					// Jan 1st 00:00 of the next year.
					const nextYear = new Date(new Date(now).getFullYear() + 1, 0)
					return (nextYear.getTime() - now) / 1000
				} else {
					// Jan 1st of the current year.
					const thisYear = new Date(new Date(now).getFullYear(), 0)
					return (now - thisYear.getTime()) / 1000
				}
			},
			format(value, locale) {
				// Whether can use `Intl.DateTimeFormat`.
				// If `Intl` is not available,
				// or the locale is not supported,
				// then don't override the default labels.
				/* istanbul ignore if */
				if (!intlDateTimeFormatSupported()) {
					return
				}
				/* istanbul ignore if */
				if (!formatters[locale]) {
					formatters[locale] = {}
				}
				/* istanbul ignore else */
				if (!formatters[locale].other) {
					// "Apr 11, 2017" (yMMMd)
					formatters[locale].other = new Intl.DateTimeFormat(locale, {
						year  : 'numeric',
						month : 'short',
						day   : 'numeric'
					})
				}
				// Output day, month and year.
				return formatters[locale].other.format(getDate(value))
			}
		}
	],

	flavour: [
		'tiny',
		'short-time',
		'narrow',
		'short'
	]
}
