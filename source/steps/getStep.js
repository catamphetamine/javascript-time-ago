import getStepDenominator from './getStepDenominator.js'
import getStepMinTime from './getStepMinTime.js'
import { getRoundFunction } from '../round.js'

/**
 * Finds an appropriate `step` of `steps` for the time interval (in seconds).
 *
 * @param {Object[]} steps - Time formatting steps.
 *
 * @param {number} secondsPassed - Time interval (in seconds).
 *                                 `< 0` for past dates and `> 0` for future dates.
 *
 * @param {number} options.now - Current timestamp.
 *
 * @param {boolean} [options.future] - Whether the date should be formatted as a future one
 *                                     instead of a past one.
 *
 * @param {string} [options.round] - (undocumented) Rounding mechanism.
 *
 * @param {string[]} [options.units] - A list of allowed time units.
 *                                     (Example: ['second', 'minute', 'hour', …])
 *
 * @param {boolean} [options.getNextStep] - Pass true to return `[step, nextStep]` instead of just `step`.
 *
 * @return {Object|Object[]} [step] — Either a `step` or `[prevStep, step, nextStep]`.
 */
export default function getStep(steps, secondsPassed, { now, future, round, units, getNextStep }) {
	// Ignore steps having not-supported time units in `formatAs`.
	steps = filterStepsByUnits(steps, units)
	const step = _getStep(steps, secondsPassed, { now, future, round })
	if (getNextStep) {
		if (step) {
			const prevStep = steps[steps.indexOf(step) - 1]
			const nextStep = steps[steps.indexOf(step) + 1]
			return [prevStep, step, nextStep]
		}
		return [undefined, undefined, steps[0]]
	}
	return step
}

function _getStep(steps, secondsPassed, { now, future, round }) {
	// If no steps fit the conditions then return nothing.
	if (steps.length === 0) {
		return
	}

	// Find the most appropriate step.
	const i = getStepIndex(steps, secondsPassed, {
		now,
		future: future || secondsPassed < 0,
		round
	})

	// If no step is applicable the return nothing.
	if (i === -1) {
		return
	}

	const step = steps[i]

	// Apply granularity to the time amount
	// (and fall back to the previous step
	//  if the first level of granularity
	//  isn't met by this amount)
	if (step.granularity) {
		// Recalculate the amount of seconds passed based on `granularity`.
		const secondsPassedGranular = getRoundFunction(round)((Math.abs(secondsPassed) / getStepDenominator(step)) / step.granularity) * step.granularity
		// If the granularity for this step is too high,
		// then fall back to the previous step.
		// (if there is any previous step)
		if (secondsPassedGranular === 0 && i > 0) {
			return steps[i - 1]
		}
	}

	return step
}

/**
 * Iterates through steps until it finds the maximum one satisfying the `minTime` threshold.
 * @param  {Object} steps - Steps.
 * @param  {number} secondsPassed - How much seconds have passed since the date till `now`.
 * @param  {number} options.now - Current timestamp.
 * @param  {boolean} options.future - Whether the time interval should be formatted as a future one.
 * @param  {number} [i] - Gradation step currently being tested.
 * @return {number} Gradation step index.
 */
function getStepIndex(steps, secondsPassed, options, i = 0) {
	const minTime = getStepMinTime(steps[i], {
		prevStep: steps[i - 1],
		timestamp: options.now - secondsPassed * 1000,
		...options
	})
	// If `minTime` isn't defined or deduceable for this step, then stop.
	if (minTime === undefined) {
		return i - 1
	}
	// If the `minTime` threshold for moving from previous step
	// to this step is too high then return the previous step.
	if (Math.abs(secondsPassed) < minTime) {
		return i - 1
	}
	// If it's the last step then return it.
	if (i === steps.length - 1) {
		return i
	}
	// Move to the next step.
	return getStepIndex(steps, secondsPassed, options, i + 1)
}

/**
 * Leaves only allowed steps.
 * @param  {Object[]} steps
 * @param  {string[]} units - Allowed time units.
 * @return {Object[]}
 */
function filterStepsByUnits(steps, units) {
	return steps.filter(({ unit, formatAs }) => {
		// "unit" is now called "formatAs".
		unit = unit || formatAs
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