import { day, canonical } from '../gradation'
import { intlDateTimeFormatSupported } from '../locale'

// A cache for `Intl.DateTimeFormat` twitter formatters
// for various locales (is a global variable).
const formatters = {}

// Twitter gradation is derived from "canonical" gradation
// adjusting its "minute" `threshold` to be 45.
const gradation = canonical.map((step) =>
{
	if (step.unit === 'minute')
	{
		return {
			...step,
			threshold: 45
		}
	}

	return step
})

// Twitter style relative time formatting.
// ("1m", "2h", "Mar 3", "Apr 4, 2012").
// Seconds, minutes and hours are shown relatively,
// and other intervals can be shown using full date format.
export default
{
	// Twitter style relative time formatting:
	// Seconds, minutes and hours are shown relatively,
	// and other intervals can be shown using full date format.
	custom({ elapsed, date, time, now, locale })
	{
		// Whether can use `Intl.DateTimeFormat`.
		// If `Intl` is not available,
		// or the locale is not supported,
		// then don't override the default labels.
		/* istanbul ignore if */
		if (!intlDateTimeFormatSupported())
		{
			return
		}

		// If less than 24 hours elapsed,
		// then format it relatively
		// (don't override the default behaviour).
		if (Math.abs(elapsed) < day - 30 * 60)
		{
			return
		}

		// Ensure `date` is set.
		date = date || new Date(time)

		// Initialize relative time formatters for non-recent dates.
		/* istanbul ignore else */
		if (!formatters[locale])
		{
			formatters[locale] =
			{
				// "Apr 11" (MMMd)
				this_year : new Intl.DateTimeFormat(locale,
				{
					month : 'short',
					day   : 'numeric'
				}),

				// "Apr 11, 2017" (yMMMd)
				other : new Intl.DateTimeFormat(locale,
				{
					year  : 'numeric',
					month : 'short',
					day   : 'numeric'
				})
			}
		}

		// If `date` and `now` happened the same year,
		// then only output month and day.
		if (new Date(now).getFullYear() === date.getFullYear())
		{
			return formatters[locale].this_year.format(date)
		}

		// If `date` and `now` happened in defferent years,
		// then output day, month and year.
		return formatters[locale].other.format(date)
	},

	units: ['now', 'minute', 'hour'],

	gradation,

	flavour: ['tiny', 'short_time', 'narrow', 'short']
}
