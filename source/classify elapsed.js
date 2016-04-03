// https://www.quora.com/What-is-the-average-number-of-days-in-a-month
const days_in_a_month = 30.44

// "400 years have 146097 days (taking into account leap year rules)"
const days_in_a_year = 146097 / 400

const a_day = 24 * 60 * 60 // in seconds

const default_gradation =
[
	{
		unit: 'second',
		factor: 1
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
		threshold: 27.5 * 60
	},
	{
		unit: 'hour',
		factor: 60 * 60,
		threshold: 45 * 60
	},
	{
		unit: 'day',
		factor: a_day,
		threshold: (23.5 / 24) * a_day
	},
	{
		unit: 'week',
		factor: 7 * a_day,
		threshold: 6.5 * a_day
	},
	{
		unit: 'month',
		factor: days_in_a_month * a_day,
		threshold: 3.5 * 7 * a_day
	},
	{
		unit: 'half-year',
		factor: 0.5 * days_in_a_year * a_day,
		threshold: 3 * days_in_a_month * a_day
	},
	{
		unit: 'year',
		factor: days_in_a_year * a_day,
		threshold: 9 * days_in_a_month * a_day
	}
]

// Chooses the appropriate time measurement unit 
// and also returns the corresponding rounded time amount.
//
// Rounds the `elapsed` time interval 
// to the most appropriate time measurement unit.
//
// Parameters:
//
//    elapsed - time interval in seconds
//    units   - a list of available units
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
	const full_gradation = options.gradation || default_gradation

	// Leave only supported gradation steps
	const gradation = full_gradation.filter(step => units.indexOf(step.unit) >= 0)

	let i = 0
	while (i < gradation.length)
	{
		const step = gradation[i]
		const next_step = i + 1 < gradation.length ? gradation[i + 1] : undefined

		if (!next_step || elapsed < next_step.threshold)
		{
			return { unit: step.unit, amount: Math.floor(elapsed / step.factor) }
		}

		i++
	}

	throw new Error(`Not a single time unit of "${units.join(', ')}" was specified `
		+ `in the gradation \n ${JSON.stringify({ gradation: full_gradation }, null, 3)}`)
}