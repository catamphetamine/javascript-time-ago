import { convenient } from './gradation'

/**
 * Takes seconds `elapsed` and measures them
 * against `gradation` to return the suitable
 * `gradation` step.
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
 *                                 { format(), threshold: 24 * 60 * 60 },
 *                                 …
 *                               ]
 *
 * @return {?Object} `gradation` step.
 */
export default function grade(elapsed, now, units, gradation = convenient)
{
	// Leave only supported gradation steps
	gradation = gradation.filter(({ unit }) =>
	{
		if (unit)
		{
			return units.indexOf(unit) >= 0
		}

		return true
	})

	// Find the most appropriate time scale gradation step
	let i = 0
	while (i < gradation.length)
	{
		// Current step of time scale
		const step = gradation[i]
		// The next step of time scale
		const next_step = i + 1 < gradation.length ? gradation[i + 1] : undefined

		// If it's not the last step of time scale,
		// and the next step of time scale is reachable,
		// then proceed with that next step of time scale.
		if (next_step)
		{
			// Allows threshold customization
			// based on which time interval measurement `units`
			// are available during this `elapsed(value, units)` call.
			let threshold = next_step[`threshold_for_${step.unit}`] || next_step.threshold

			// `threshold` can be a function of `now`.
			if (typeof threshold === 'function')
			{
				threshold = threshold(now)
			}

			if (typeof threshold !== 'number')
			{
				// Babel transforms `typeof` into some "branches"
				// so istanbul will show this as "branch not covered".
				/* istanbul ignore next */
				const type = typeof threshold
				throw new Error(`Each step of a gradation must have a threshold defined except for the first one. Got "${threshold}", ${type}. Step: ${JSON.stringify(next_step)}`)
			}

			// If the next step of time scale is reachable,
			// then proceed with that next step of time scale.
			if (elapsed >= threshold)
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
			const threshold =
				typeof step.threshold === 'function' ?
				step.threshold(now) :
				step.threshold

			if (threshold && elapsed < threshold)
			{
				return
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
				if (gradation[i - 1])
				{
					return gradation[i - 1]
				}
			}
		}

		return step
	}

	console.error(`Not a single time unit of "${units.join(', ')}" was specified `
		+ `in the gradation \n ${JSON.stringify({ gradation }, null, 3)}`)
}