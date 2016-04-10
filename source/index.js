// just an npm package helper

import { resolve_locale } from './time ago'
export { default, from_CLDR,  } from './time ago'
import { gradation, a_day } from './classify elapsed'
export { default as classify_elapsed, a_day, days_in_a_month, days_in_a_year, gradation } from './classify elapsed'

const twitter_formatters = {}

export const preset = 
{
	twitter: (locale) =>
	{
		locale = resolve_locale(locale)
		
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

			gradation: twitter_gradation
		}

		return options
	}
}