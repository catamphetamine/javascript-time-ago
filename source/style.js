import gradation, { a_day } from './gradation'

// A cache for `Intl.DateTimeFormat` twitter formatters
// for various locales (is a global variable).
const twitter_formatters = {}

// A cached twitter gradation (if used)
let twitter_gradation

// @param {string} locale - the most suitable locale for formatting relative time.
//
// @return {Function} Returns a factory for creating relative time formatting presets.
//
// The factory returned is later being used like:
//
// ```js
// const timeAgo = new javascriptTimeAgo('en-US')
// const twitter = timeAgo.style.twitter()
// timeAgo.format(new Date(), twitter)
// ```
//
// A preset is an object having shape
// `{ units, gradation, flavour, override({ elapsed, time, date, now }) }`.
//
export default function(locale)
{
	return {
		// Twitter style relative time formatting.
		// Seconds, minutes and hours are shown relatively,
		// and other intervals can be shown using full date format.
		twitter()
		{
			// Initialize relative time formatters for non-recent dates.
			/* istanbul ignore else */
			if (!twitter_formatters[locale])
			{
				twitter_formatters[locale] = 
				{
					// "Apr 11" (MMMd)
					same_year    : new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }),

					// "Apr 11, 2017" (yMMMd)
					another_year : new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' })
				}
			}

			const twitter_same_year_date_formatter    = twitter_formatters[locale].same_year
			const twitter_another_year_date_formatter = twitter_formatters[locale].another_year

			// Create twitter gradation (if not previously created).
			// Twitter gradation is derived from "canonical" gradation
			// adjusting its "minute" `threshold` to be 45.
			if (!twitter_gradation)
			{
				twitter_gradation = gradation.canonical()
				for (const step of twitter_gradation)
				{
					if (step.unit === 'minute')
					{
						step.threshold = 45
						break
					}
				}
			}

			return {
				// Twitter style relative time formatting:
				// Seconds, minutes and hours are shown relatively,
				// and other intervals can be shown using full date format.
				override({ elapsed, time, date, now })
				{
					// If less than 24 hours elapsed,
					// then format it relatively
					// (don't override the default behaviour).
					if (Math.abs(elapsed) < a_day - 30 * 60)
					{
						return
					}

					// If `date` and `now` happened the same year,
					// then only output month and day.
					if (new Date(now).getFullYear() === date.getFullYear())
					{
						return twitter_same_year_date_formatter.format(date, 'MMMd')
					}

					// If `date` and `now` happened in defferent years,
					// then output day, month and year.
					return twitter_another_year_date_formatter.format(date, 'yMMMd')
				},

				units: ['just-now', 'minute', 'hour'],

				gradation: twitter_gradation,

				flavour: 'tiny'
			}
		},

		// The default ("fuzzy") relative time formatting style.
		//
		// just now
		// 5 minutes
		// 10 minutes
		// 15 minutes
		// 20 minutes
		// half an hour
		// an hour
		// 2 hours
		// …
		// 20 hours
		// 1 day
		// 2 days
		// a week
		// 2 weeks
		// 3 weeks
		// a month
		// 2 months
		// 3 months
		// 4 months
		// half a year
		// a year
		// 2 years
		//
		fuzzy()
		{
			return {
				gradation: gradation.convenient(),
				flavour: 'long_concise',
				units:
				[
					'just-now',
					'minute',
					'half-hour',
					'hour',
					'day',
					'week',
					'month',
					'half-year',
					'year'
				]
			}
		}
	}
}