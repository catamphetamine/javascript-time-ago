// https://www.quora.com/What-is-the-average-number-of-days-in-a-month
export const days_in_a_month = 30.44

// "400 years have 146097 days (taking into account leap year rules)"
export const days_in_a_year = 146097 / 400

export const a_day = 24 * 60 * 60 // in seconds

export const gradation =
{
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
				threshold: 0
			},
			{
				unit: 'minute',
				factor: 60,
				threshold: 45,
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
				threshold: 45 * 60
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
				threshold: 9 * days_in_a_month * a_day
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
//    elapsed - time interval in seconds
//    units   - a list of supported time units
//
//    options - (optional) 
//
//       (optional) gradation
//
// Returns an object of `unit` and `amount`
// (e.g. { unit: 'day', amount: 3 })
//
export default function classify_elapsed(elapsed, units, options = {})
{
	// time interval measurement unit rounding gradation
	const full_gradation = options.gradation || gradation.canonical()

	// Leave only supported gradation steps
	const gradation_steps = full_gradation.filter(step => units.indexOf(step.unit) >= 0)

	let i = 0
	while (i < gradation_steps.length)
	{
		const step = gradation_steps[i]
		const next_step = i + 1 < gradation_steps.length ? gradation_steps[i + 1] : undefined

		if (!next_step || elapsed < next_step.threshold)
		{
			const exact_amount = elapsed / step.factor
			let amount = Math.round(exact_amount)

			if (amount === 0)
			{
				amount = elapsed >= 0 ? 1 : -1
			}

			// apply granularity to the amount
			// (and fallback to the previous step
			//  if the first level of granularity
			//  isn't met by this amount)
			if (step.granularity)
			{
				const remainder = exact_amount % step.granularity
				amount = exact_amount - remainder
				amount += Math.round(remainder / step.granularity) * step.granularity

				if (amount === 0)
				{
					const previous_step = gradation_steps[i - 1]

					const previous_step_result =
					{
						unit   : previous_step.unit, 
						amount : Math.floor(elapsed / previous_step.factor)
					}

					return previous_step_result
				}
			}

			return { unit: step.unit, amount }
		}

		i++
	}

	throw new Error(`Not a single time unit of "${units.join(', ')}" was specified `
		+ `in the gradation \n ${JSON.stringify({ gradation: full_gradation }, null, 3)}`)
}