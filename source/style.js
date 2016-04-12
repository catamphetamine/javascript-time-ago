import { resolve_locale }   from './time ago'
import { gradation, a_day } from './classify elapsed'

const twitter_formatters = {}

export default function(locales)
{
	const styles = 
	{
		// Twitter style relative time.
		// Seconds, minutes and hours are shown relatively,
		// and other intervals can be shown using full date format.
		twitter()
		{
			const locale = resolve_locale(locales)
			
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

			const twitter_gradation = gradation.canonical()
			for (let step of twitter_gradation)
			{
				if (step.unit === 'minute')
				{
					step.threshold = 45
					break
				}
			}

			const options = 
			{
				// Twitter style relative time.
				// Seconds, minutes and hours are shown relatively,
				// and other intervals can be shown using full date format.
				override({ elapsed, time, date, now })
				{
					// If less than 24 hours elapsed,
					// then format it relatively.
					if (Math.abs(elapsed) < a_day - 30 * 60)
					{
						return
					}

					// If `date` and `now` happened the same year,
					// then show month and day
					if (new Date(now).getFullYear() === date.getFullYear())
					{
						return twitter_same_year_date_formatter.format(date, 'MMMd')
					}

					// If `date` and `now` happened in defferent years,
					// then show full date
					return twitter_another_year_date_formatter.format(date, 'yMMMd')
				},

				units: ['just-now', 'minute', 'hour'],

				gradation: twitter_gradation,

				flavour: 'tiny'
			}

			return options
		},

		// I prefer this one.
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
		// yesterday
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
			const options = 
			{
				gradation: gradation.convenient(),
				flavour: 'long_concise',
				units: ['just-now', 'minute', 'half-hour', 'hour', 'day', 'week', 'month', 'half-year', 'year']
			}

			return options
		}
	}

	return styles
}