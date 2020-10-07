import approximate from './steps/approximate'
import { minute, hour, day, week, month, year } from './steps/units'

/**
 * Takes seconds `elapsed` and measures them against
 * `steps` to return a suitable step.
 *
 * @param {number} elapsed - Time interval (in seconds). Is < 0 for past dates and > 0 for future dates.
 *
 * @param {string[]} units - A list of allowed time units
 *                           (e.g. ['second', 'minute', 'hour', …])
 *
 * @param {Object} [steps] - Time scale steps.
 *
 *                               E.g.:
 *                               [
 *                                 { unit: 'second', factor: 1 },
 *                                 { unit: 'minute', factor: 60, threshold: 60 },
 *                                 { format(), threshold: 24 * 60 * 60 },
 *                                 …
 *                               ]
 *
 * @return {?Object} step.
 */
export default function getStep(elapsed, now, units, steps = approximate) {
	// Leave only allowed time measurement units.
	// E.g. omit "quarter" unit.
	steps = getAllowedSteps(steps, units)

	// If no steps fit the conditions then return nothing.
	if (steps.length === 0) {
		return
	}

	// Find the most appropriate step.
	const i = getStepIndex(elapsed, now, steps)
	const step = steps[i]

	// If time elapsed is too small and even the first step
	// doesn't suit it then return nothing.
	if (i === -1) {
		return
	}

	// Apply granularity to the time amount
	// (and fall back to the previous step
	//  if the first level of granularity
	//  isn't met by this amount)
	if (step.granularity) {
		// Recalculate the elapsed time amount based on granularity
		const amount = Math.round((Math.abs(elapsed) / getStepDenominator(step)) / step.granularity) * step.granularity
		// If the granularity for this step is too high,
		// then fall back to the previous step.
		// (if there is any previous step)
		if (amount === 0 && i > 0) {
			return steps[i - 1]
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
function getThreshold(fromStep, toStep, now, future) {
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
		throw new Error(`Each step must have a threshold defined except for the first one. Got "${threshold}", ${type}. Step: ${JSON.stringify(toStep)}`)
	}

	return threshold
}

/**
 * Iterates through steps until it finds the maximum one satisfying the threshold.
 * @param  {number} elapsed - Time elapsed (in seconds).
 * @param  {number} now - Current timestamp.
 * @param  {Object} steps - Steps.
 * @param  {number} i - Gradation step currently being tested.
 * @return {number} Gradation step index.
 */
function getStepIndex(elapsed, now, steps, i = 0) {
	// If the threshold for moving from previous step
	// to this step is too high then return the previous step.
	if (Math.abs(elapsed) < getThreshold(steps[i - 1], steps[i], now, elapsed < 0)) {
		return i - 1
	}
	// If it's the last step then return it.
	if (i === steps.length - 1) {
		return i
	}
	// Move to the next step.
	return getStepIndex(elapsed, now, steps, i + 1)
}

/**
 * Leaves only allowed steps.
 * @param  {Object[]} steps
 * @param  {string[]} units - Allowed time units.
 * @return {Object[]}
 */
function getAllowedSteps(steps, units) {
	return steps.filter(({ unit }) => {
		// If this step has a `unit` defined
		// then this `unit` must be in the list of allowed `units`.
		if (unit) {
			return units.indexOf(unit) >= 0
		}
		// A step is not required to specify a `unit`:
		// alternatively, it could specify `format()`.
		// (see "twitter" style for an example)
		return true
	})
}

export function getStepDenominator(step) {
	// `factor` is a legacy property.
	if (step.factor !== undefined) {
		return step.factor
	}
	switch (step.unit) {
		case 'now':
			return 1
		case 'second':
			return 1
		case 'minute':
			return minute
		case 'hour':
			return hour
		case 'day':
			return day
		case 'week':
			return week
		case 'month':
			return month
		case 'year':
			return year
	}
	return 1
}