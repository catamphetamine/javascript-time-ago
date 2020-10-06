import { approximate } from './gradation'

/**
 * Takes seconds `elapsed` and measures them against
 * `gradation` to return the suitable `gradation` step.
 *
 * @param {number} elapsed - Time interval (in seconds). Is < 0 for past dates and > 0 for future dates.
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
export default function grade(elapsed, now, units, gradation = approximate)
{
	// Leave only allowed time measurement units.
	// E.g. omit "quarter" unit.
	gradation = getAllowedSteps(gradation, units)

	// If no steps of gradation fit the conditions
	// then return nothing.
	if (gradation.length === 0) {
		return
	}

	// Find the most appropriate gradation step
	const i = findGradationStep(elapsed, now, gradation)
	const step = gradation[i]

	// If time elapsed is too small and even
	// the first gradation step doesn't suit it
	// then return nothing.
	if (i === -1) {
		return
	}

	// Apply granularity to the time amount
	// (and fall back to the previous step
	//  if the first level of granularity
	//  isn't met by this amount)
	if (step.granularity) {
		// Recalculate the elapsed time amount based on granularity
		const amount = Math.round((Math.abs(elapsed) / step.factor) / step.granularity) * step.granularity
		// If the granularity for this step
		// is too high, then fallback
		// to the previous step of gradation.
		// (if there is any previous step of gradation)
		if (amount === 0 && i > 0) {
			return gradation[i - 1]
		}
	}

	return step
}

/**
 * Gets threshold for moving from `fromStep` to `next_step`.
 * @param  {Object} fromStep - From step.
 * @param  {Object} next_step - To step.
 * @param  {number} now - The current timestamp.
 * @param  {boolean} future - Is `true` for future dates ("in 5 minutes").
 * @return {number}
 * @throws Will throw if no threshold is found.
 */
function getThreshold(fromStep, toStep, now, future)
{
	let threshold

	// Allows custom thresholds when moving
	// from a specific step to a specific step.
	if (fromStep && (fromStep.id || fromStep.unit)) {
		threshold = toStep[`threshold_for_${fromStep.id || fromStep.unit}`]
	}

	// If no custom threshold is set for this transition
	// then use the usual threshold for the next step.
	if (threshold === undefined) {
		threshold = toStep.threshold
	}

	// Convert threshold to a number.
	if (typeof threshold === 'function') {
		threshold = threshold(now, future)
	}

	// Throw if no threshold is found.
	if (fromStep && typeof threshold !== 'number') {
		// Babel transforms `typeof` into some "branches"
		// so istanbul will show this as "branch not covered".
		/* istanbul ignore next */
		const type = typeof threshold
		throw new Error(`Each step of a gradation must have a threshold defined except for the first one. Got "${threshold}", ${type}. Step: ${JSON.stringify(toStep)}`)
	}

	return threshold
}

/**
 * @param  {number} elapsed - Time elapsed (in seconds).
 * @param  {number} now - Current timestamp.
 * @param  {Object} gradation - Gradation.
 * @param  {number} i - Gradation step currently being tested.
 * @return {number} Gradation step index.
 */
function findGradationStep(elapsed, now, gradation, i = 0)
{
	// If the threshold for moving from previous step
	// to this step is too high then return the previous step.
	if (Math.abs(elapsed) < getThreshold(gradation[i - 1], gradation[i], now, elapsed < 0)) {
		return i - 1
	}
	// If it's the last step of gradation then return it.
	if (i === gradation.length - 1) {
		return i
	}
	// Move to the next step.
	return findGradationStep(elapsed, now, gradation, i + 1)
}

/**
 * Leaves only allowed gradation steps.
 * @param  {Object[]} gradation
 * @param  {string[]} units - Allowed time units.
 * @return {Object[]}
 */
function getAllowedSteps(gradation, units)
{
	return gradation.filter(({ unit }) => {
		// If this step has a `unit` defined
		// then this `unit` must be in the list of `units` allowed.
		if (unit) {
			return units.indexOf(unit) >= 0
		}
		// A gradation step is not required to specify a `unit`.
		// E.g. for Twitter gradation it specifies `format()` instead.
		return true
	})
}