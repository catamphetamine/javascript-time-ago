// https://www.quora.com/What-is-the-average-number-of-days-in-a-month
export const days_in_a_month = 30.44

// "400 years have 146097 days (taking into account leap year rules)"
export const days_in_a_year = 146097 / 400

export const a_day = 24 * 60 * 60 // in seconds

export const gradation =
{
	// just now
	// 1 second ago
	// …
	// 59 seconds ago
	// 1 minute ago
	// …
	// 59 minutes ago
	// 1 hour ago
	// …
	// 24 hours ago
	// 1 day ago
	// …
	// 7 days ago
	// 1 week ago
	// …
	// 3 weeks ago
	// 1 month ago
	// …
	// 11 months ago
	// 1 year ago
	// …
	canonical: () =>
	{
		const result =
		[
			{
				unit: 'just-now',
				factor: 1
			},
			{
				unit: 'second',
				factor: 1,
				threshold: 0.5
			},
			{
				unit: 'minute',
				factor: 60,
				threshold: 59.5
			},
			{
				unit: 'hour',
				factor: 60 * 60,
				threshold: 59.5 * 60
			},
			{
				unit: 'day',
				factor: a_day,
				threshold: 23.5 * 60 * 60
			},
			{
				unit: 'week',
				factor: 7 * a_day,
				threshold: 6.5 * a_day
			},
			{
				unit: 'month',
				factor: days_in_a_month * a_day,
				threshold: 3.5 * 7 * a_day * a_day
			},
			{
				unit: 'year',
				factor: days_in_a_year * a_day,
				threshold: 11.5 * days_in_a_month * a_day
			}
		]

		return result
	},

	// just now
	// 5 minutes ago
	// 10 minutes ago
	// 15 minutes ago
	// 20 minutes ago
	// half an hour ago
	// an hour ago
	// 2 hours ago
	// …
	// 20 hours ago
	// yesterday
	// 2 days ago
	// 5 days ago
	// a week ago
	// 2 weeks ago
	// 3 weeks ago
	// a month ago
	// 2 months ago
	// 4 months ago
	// half a year ago
	// a year ago
	// 2 years ago
	// …
	convenient: () =>
	{
		const result =
		[
			{
				unit: 'just-now',
				factor: 1
			},
			{
				unit: 'second',
				factor: 1,
				threshold: 1,
				'threshold_for_just-now': 45
			},
			{
				unit: 'minute',
				factor: 60,
				threshold: 45
			},
			{
				unit: 'minute',
				factor: 60,
				threshold: 2.5 * 60,
				granularity: 5
			},
			{
				unit: 'half-hour',
				factor: 30 * 60,
				threshold: 22.5 * 60
			},
			{
				unit: 'hour',
				factor: 60 * 60,
				threshold: 42.5 * 60,
				threshold_for_minute: 52.5 * 60
			},
			{
				unit: 'day',
				factor: a_day,
				threshold: (20.5 / 24) * a_day
			},
			{
				unit: 'week',
				factor: 7 * a_day,
				threshold: 5.5 * a_day
			},
			{
				unit: 'month',
				factor: days_in_a_month * a_day,
				threshold: 3.5 * 7 * a_day
			},
			{
				unit: 'half-year',
				factor: 0.5 * days_in_a_year * a_day,
				threshold: 4.5 * days_in_a_month * a_day
			},
			{
				unit: 'year',
				factor: days_in_a_year * a_day,
				threshold: 9 * days_in_a_month * a_day,
				threshold_for_month: 10.5 * days_in_a_month * a_day
			}
		]

		return result
	}
}

// Chooses the appropriate time measurement unit 
// and also returns the corresponding rounded time amount.
//
// Rounds the `elapsed` time interval 
// to the most appropriate time measurement unit.
//
// Parameters:
//
//    elapsed - time interval (in seconds)
//
//    units   - a list of allowed time units
//              (e.g. ['second', 'minute', 'hour', …])
//
//    gradation - (optional) time scale gradation steps.
//                (e.g.
//                [
//                   { unit: 'second', factor: 1 }, 
//                   { unit: 'minute', factor: 60, threshold: 60 },
//                   …
//                ])
//
// Returns an object of `unit` and `amount`
// (e.g. { unit: 'day', amount: 3 })
//
export default function classify_elapsed(elapsed, units, gradation_steps)
{
	// Time interval measurement unit rounding gradation
	gradation_steps = gradation_steps || gradation.convenient()

	// Leave only supported gradation steps
	gradation_steps = gradation_steps.filter(step => units.indexOf(step.unit) >= 0)

	// Find the most appropriate time scale gradation step
	let i = 0
	while (i < gradation_steps.length)
	{
		// Current step of time scale
		const step = gradation_steps[i]
		// The next step of time scale
		const next_step = i + 1 < gradation_steps.length ? gradation_steps[i + 1] : undefined

		// If it's not the last step of time scale,
		// and the next step of time scale is reachable,
		// then proceed with that next step of time scale.
		if (next_step)
		{
			// Allows threshold customization
			// based on which time interval measurement units
			// are available at the moment.
			const specific_threshold = next_step[`threshold_for_${step.unit}`]
			const next_step_threshold = specific_threshold || next_step.threshold

			if (elapsed >= next_step_threshold)
			{
				i++
				continue
			}
		}

		// Either it's the last step of time scale,
		// or the next step of time scale is unreachable,
		// so stick with the current step of time scale.

		const exact_amount = elapsed / step.factor
		let amount = Math.round(exact_amount)

		// Amount shouldn't be zero, 
		// so set it to 1 at least.
		if (amount === 0)
		{
			amount = elapsed >= 0 ? 1 : -1
		}

		// Apply granularity to the time amount
		// (and fallback to the previous step
		//  if the first level of granularity
		//  isn't met by this amount)
		if (step.granularity)
		{
			// Recalculate time amount based on the granularity
			const remainder = exact_amount % step.granularity
			amount = exact_amount - remainder
			amount += Math.round(remainder / step.granularity) * step.granularity

			// If the granularity for this step of time scale
			// is too high, then fallback 
			// to the previous step of time scale.
			// (if there is the previous step of time scale)
			if (amount === 0)
			{
				const previous_step = gradation_steps[i - 1]

				if (previous_step)
				{
					const previous_step_result =
					{
						unit   : previous_step.unit, 
						amount : Math.round(elapsed / previous_step.factor)
					}

					return previous_step_result
				}
			}
		}

		// Result
		return { unit: step.unit, amount }
	}

	throw new Error(`Not a single time unit of "${units.join(', ')}" was specified `
		+ `in the gradation \n ${JSON.stringify({ gradation: gradation_steps }, null, 3)}`)
}