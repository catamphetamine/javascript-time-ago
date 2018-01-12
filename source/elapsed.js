import { convenient } from './gradation'

/**
 * `elapsed()` function result.
 *
 * @typedef {Object} ElapsedResultUnits
 * @property {number} unit - The most appropriate time interval measurement unit for the time elapsed.
 * @property {number} amount - The rounded amount of time measurement `unit`s elapsed.
 *
 * @example
 * // Returns { unit: 'day', amount: 3 }
 * elapsed(2.7 * 24 * 60 * 60)
 */

/**
 * `elapsed()` function result when gradation step has `format` instead of `unit`.
 *
 * @typedef {Object} ElapsedResultFormat
 * @property {Function} format - Formats `value` to a string given locale.
 */

/**
 * Chooses the appropriate time measurement unit
 * and also returns the corresponding rounded time amount.
 * In other words, rounds the `elapsed` time interval
 * to the most appropriate time measurement unit.
 *
 * @param {number} elapsed - Time interval (in seconds)
 *
 * @param {string[]} units - A list of allowed time units
 *                           (e.g. ['second', 'minute', 'hour', …])
 *
 * @param {Object} [gradation] - Time scale gradation steps.
 *
 *                               E.g.:
 *                               [
 *                                 { unit: 'second', factor: 1 },
 *                                 { unit: 'minute', factor: 60, threshold: 60 },
 *                                 …
 *                               ]
 *
 * @return {(ElapsedResultUnits|ElapsedResultFormat)}
 */
export default function elapsed(elapsed, now, units, gradation_steps)
{
	// Time interval measurement unit rounding gradation
	gradation_steps = gradation_steps || convenient

	// Leave only supported gradation steps
	gradation_steps = gradation_steps.filter(({ unit }) =>
	{
		if (unit)
		{
			return units.indexOf(unit) >= 0
		}

		return true
	})

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
			// based on which time interval measurement `units`
			// are available during this `elapsed(value, units)` call.
			const specific_threshold = next_step[`threshold_for_${step.unit}`]
			let  next_step_threshold = specific_threshold || next_step.threshold

			// `threshold` can be a function of `now`.
			if (typeof next_step_threshold === 'function')
			{
				next_step_threshold = next_step_threshold(now)
			}

			// If the next step of time scale is reachable,
			// then proceed with that next step of time scale.
			if (elapsed >= next_step_threshold)
			{
				i++
				continue
			}
		}

		// Either it's the last step of time scale,
		// or the next step of time scale is unreachable,
		// so stick with the current step of time scale.

		// If time elapsed is so small no gradation scale unit suits it.
		if (step.threshold)
		{
			const threshold = typeof step.threshold === 'function' ? step.threshold(now) : step.threshold
			if (threshold && elapsed < threshold)
			{
				return {}
			}
		}

		const exact_amount = elapsed / step.factor
		let amount = Math.round(exact_amount)

		// Apply granularity to the time amount
		// (and fallback to the previous step
		//  if the first level of granularity
		//  isn't met by this amount)
		if (step.granularity)
		{
			// Recalculate the elapsed time amount based on granularity
			amount = Math.round(exact_amount / step.granularity) * step.granularity

			// If the granularity for this step of time scale
			// is too high, then fallback
			// to the previous step of time scale.
			// (if there is the previous step of time scale)
			if (amount === 0)
			{
				const previous_step = gradation_steps[i - 1]

				if (previous_step)
				{
					/* istanbul ignore if */
					if (previous_step.format)
					{
						return { format : previous_step.format }
					}

					return {
						unit   : previous_step.unit,
						amount : Math.round(elapsed / previous_step.factor)
					}
				}
			}
		}

		if (step.format)
		{
			return { format : step.format }
		}

		return {
			unit : step.unit,
			amount
		}
	}

	console.error(`Not a single time unit of "${units.join(', ')}" was specified `
		+ `in the gradation \n ${JSON.stringify({ gradation: gradation_steps }, null, 3)}`)

	return {}
}